import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withAdmin } from '@/lib/auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const POST = withAdmin(async function(req: Request) {
  try {
    const body = await req.json()
    const { produto, categoriaSlugs } = body

    // 1. Mapeamento e Blindagem
    // Corrigimos aqui para aceitar tanto preco_original quanto precoOriginal
    const insertData: any = {
      nome: produto.nome,
      categoriaSlugs: categoriaSlugs,
      lojaOrigem: produto.lojaOrigem || produto.loja || 'amazon',
      preco: produto.preco,
      // BUSCA NAS DUAS VARIANTES:
      precoOriginal: produto.preco_original || produto.precoOriginal || null, 
      desconto_pct: produto.desconto_pct || null,
      imagem: produto.imagem,
      linkAfiliado: produto.linkAfiliado || produto.link_afiliado,
      destaque: produto.destaque,
      createdAt: produto.createdAt,
      novo: produto.novo,
      tags: produto.tags || []
    }

    // 2. Insere na tabela principal (O Banco gera o UUID automaticamente)
    const { data: newProd, error: prodError } = await supabase
      .from('produtos')
      .insert([insertData])
      .select('id')
      .single()

    if (prodError) throw new Error(prodError.message)

    const generatedId = newProd.id;

    // 3. Tabela relacional 'produto_categoria'
    if (categoriaSlugs && categoriaSlugs.length > 0) {
      const catInserts = categoriaSlugs.map((slug: string) => ({
        produto_id: generatedId,
        categoria_slug: slug
      }))
      
      const { error: catError } = await supabase
        .from('produto_categoria')
        .insert(catInserts)
        
      if (catError) console.error('[API PRODUTOS] Erro na tabela relacional:', catError.message)
    }

    return NextResponse.json({ success: true, id: generatedId })
  } catch (error: any) {
    console.error('[API PRODUTOS ERROR]', error.message)
    return NextResponse.json({ error: error.message || 'Erro ao criar produto.' }, { status: 500 })
  }
})