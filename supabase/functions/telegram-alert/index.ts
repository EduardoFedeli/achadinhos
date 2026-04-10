import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');

serve(async (req) => {
  try {
    const payload = await req.json();
    const produto = payload.record;

    const titulo = produto.nome || produto.titulo;
    const link = produto.linkAfiliado;
    const imagem = produto.imagem;
    const precoAtual = produto.preco || 0;
    const precoDe = produto.precoOriginal || 0;
    const desconto = produto.desconto_pct || 0;
    const loja = produto.lojaOrigem || 'Amazon';

    if (!link || !imagem) return new Response("Ok", { status: 200 });

    const escapeMarkdownV2 = (text: string) => {
      if (!text) return '';
      return String(text).replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
    };

    const fmtPreco = (num: number) => escapeMarkdownV2(num.toFixed(2).replace('.', ','));

    // Montagem da mensagem com Badge de Desconto
    const textoMensagem = `
🔥 *OFERTA ENCONTRADA* 🔥

*${escapeMarkdownV2(titulo)}*

💰 De: ~R\\$ ${fmtPreco(precoDe)}~
🚀 *Por: R\\$ ${fmtPreco(precoAtual)}* ${desconto > 0 ? `\\(${desconto}% OFF\\)` : ''}
🛍️ Loja: ${escapeMarkdownV2(loja)}

⏳ Corre antes que acabe\\!
    `.trim();

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        photo: imagem,
        caption: textoMensagem,
        parse_mode: 'MarkdownV2',
        reply_markup: {
          inline_keyboard: [[{ text: "🛒 COMPRAR AGORA", url: link }]]
        }
      })
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});