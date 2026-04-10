import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Garantir que a rota não sofra cache agressivo do Next.js
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // 1. Proteção: Garantir que só o Vercel Cron acesse essa rota
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Não autorizado', { status: 401 });
  }

  // 2. Instanciar Supabase com Service Role Key (Bypassa RLS para background jobs)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // 3. A Lógica da Fila: Pega 1 produto, priorizando os que nunca foram postados (NULL) 
    // ou os que foram postados há mais tempo.
    const { data: produtos, error: dbError } = await supabase
      .from('produtos')
      .select('id, titulo, precoOriginal, desconto_pct, lojaOrigem, linkAfiliado, imagemUrl')
      // Você pode adicionar um .eq('ativo', true) se tiver essa coluna
      .order('ultimaVezPostado', { ascending: true, nullsFirst: true })
      .limit(1);

    if (dbError || !produtos || produtos.length === 0) {
      throw new Error('Nenhum produto encontrado na fila.');
    }

    const produto = produtos[0];
    const precoComDesconto = produto.precoOriginal * (1 - (produto.desconto_pct / 100));

    // Engenharia de Resiliência para o MarkdownV2 do Telegram
    const escapeMarkdownV2 = (text: string) => text ? text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&') : '';
    
    const tituloSeguro = escapeMarkdownV2(produto.titulo);
    const lojaSegura = escapeMarkdownV2(produto.lojaOrigem);
    const precoOriginalFmt = escapeMarkdownV2(produto.precoOriginal.toFixed(2).replace('.', ','));
    const precoDescontoFmt = escapeMarkdownV2(precoComDesconto.toFixed(2).replace('.', ','));

    // Copy de Retenção: Textos rotativos indicam para o usuário que é uma seleção especial
    const textoMensagem = `
🎯 *ACHADINHO EM DESTAQUE* 🎯

*${tituloSeguro}*

💰 De: ~R\\$ ${precoOriginalFmt}~
🚀 *Por: R\\$ ${precoDescontoFmt}*
🛍️ Loja: ${lojaSegura}

⏳ Aproveite antes que o preço suba\\!
    `.trim();

    // 4. Disparo para o Telegram
    const telegramRes = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        photo: produto.imagemUrl,
        caption: textoMensagem,
        parse_mode: 'MarkdownV2',
        reply_markup: {
          inline_keyboard: [[{ text: "🛒 COMPRAR AGORA", url: produto.linkAfiliado }]]
        }
      })
    });

    if (!telegramRes.ok) throw new Error(await telegramRes.text());

    // 5. Atualizar a Fila: Joga o produto pro "final" atualizando a data
    await supabase
      .from('produtos')
      .update({ ultimaVezPostado: new Date().toISOString() })
      .eq('id', produto.id);

    return NextResponse.json({ success: true, message: `Produto ${produto.id} rotacionado com sucesso.` });

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[CRON TELEGRAM ERROR]:', errorMsg);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}