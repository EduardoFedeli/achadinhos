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
    
    const { data, error } = await supabase.from('produtos').update({
      nome: produto.nome,
      categoriaSlugs: categoriaSlugs,
      lojaOrigem: produto.loja,
      preco: produto.preco,
      precoOriginal: produto.preco_original || null,
      desconto_pct: produto.desconto_pct || null,
      imagem: produto.imagem,
      linkAfiliado: produto.link_afiliado, // Mapeia o nome do form para o banco
      destaque: produto.destaque,
      novo: produto.novo,
      tags: produto.tags || []
    }).eq('id', id).select()
    
    if (error) throw error
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