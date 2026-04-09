import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withAdmin } from '@/lib/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export const PUT = withAdmin(async function(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { produto, categoriaSlugs } = body
    
    // Mapeamento exato com a mesma blindagem feita no POST
    const updateData = {
      nome: produto.nome,
      categoriaSlugs: categoriaSlugs,
      lojaOrigem: produto.lojaOrigem || produto.loja, // Resolve o conflito pro Radar
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

    const { data, error } = await supabase
      .from('produtos')
      .update(updateData)
      .eq('id', id)
      .select()
    
    if (error) throw error

    // Opcional: Se você usa tabela relacional 'produto_categoria', limpamos e refazemos os vínculos
    if (categoriaSlugs && categoriaSlugs.length > 0) {
      await supabase.from('produto_categoria').delete().eq('produto_id', id)
      
      const catInserts = categoriaSlugs.map((slug: string) => ({
        produto_id: id,
        categoria_slug: slug
      }))
      await supabase.from('produto_categoria').insert(catInserts)
    }

    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
});

export const DELETE = withAdmin(async function(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { error } = await supabase.from('produtos').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
});