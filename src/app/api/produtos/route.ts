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
    // Garantimos que o objeto enviado ao Supabase tenha exatamente 
    // os nomes das colunas da tabela 'produtos'.
    const insertData = {
      id: produto.id,
      nome: produto.nome,
      categoriaSlugs: categoriaSlugs,
      lojaOrigem: produto.lojaOrigem || produto.loja || 'amazon', // Resolve o conflito pro Radar
      preco: produto.preco,
      precoOriginal: produto.preco_original || null,
      desconto_pct: produto.desconto_pct || null,
      imagem: produto.imagem,
      linkAfiliado: produto.link_afiliado,
      destaque: produto.destaque,
      createdAt: produto.createdAt,
      novo: produto.novo,
      tags: produto.tags || []
    }

    // 2. Insere na tabela principal
    const { data: newProd, error: prodError } = await supabase
      .from('produtos')
      .insert([insertData])
      .select('id')
      .single()

    if (prodError) throw new Error(prodError.message)

    // 3. Opcional: Se você usa tabela relacional 'produto_categoria', mantemos a inserção
    if (categoriaSlugs && categoriaSlugs.length > 0) {
      const catInserts = categoriaSlugs.map((slug: string) => ({
        produto_id: produto.id,
        categoria_slug: slug
      }))
      
      const { error: catError } = await supabase
        .from('produto_categoria')
        .insert(catInserts)
        
      if (catError) console.error('[API PRODUTOS] Erro na tabela relacional:', catError.message)
    }

    return NextResponse.json({ success: true, id: produto.id })
  } catch (error: any) {
    console.error('[API PRODUTOS ERROR]', error.message)
    return NextResponse.json({ error: error.message || 'Erro ao criar produto.' }, { status: 500 })
  }
})