import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isAdminAuthenticated } from '@/lib/adminAuth'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const { slug } = await params
    
    // Desestruturação explícita para garantir a captura do imagem_url
    const { nome, slug: novoSlug, emoji, cor, descricao, imagem_url } = await request.json()
    
    const { data, error } = await supabase
      .from('categorias')
      .update({ nome, slug: novoSlug, emoji, cor, descricao, imagem_url })
      .eq('slug', slug)
      .select()
      
    if (error) throw error
    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const { slug } = await params
    const { error } = await supabase.from('categorias').delete().eq('slug', slug)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}