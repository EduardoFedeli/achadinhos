import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withAdmin } from '@/lib/auth'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export const PUT = withAdmin(async function(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    
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
});

export const DELETE = withAdmin(async function(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params

    // 1. BACKEND LOCK: Busca os produtos para checar se a categoria está em uso
    const { data: produtos, error: erroProdutos } = await supabase
      .from('produtos')
      .select('categoriaSlugs, categoriaSlug')

    if (erroProdutos) throw erroProdutos

    // 2. Faz a mesma matemática do page.tsx para blindar a API
    const emUso = produtos?.some(p => {
      let slugsArray: string[] = [];
      if (Array.isArray(p.categoriaSlugs)) {
        slugsArray = p.categoriaSlugs;
      } else if (typeof p.categoriaSlugs === 'string') {
        try { slugsArray = JSON.parse(p.categoriaSlugs); } catch (e) {}
      }
      return slugsArray.includes(slug) || p.categoriaSlug === slug;
    });

    if (emUso) {
      return NextResponse.json(
        { error: 'Ação bloqueada pelo servidor: Esta categoria possui produtos vinculados e não pode ser excluída.' }, 
        { status: 400 }
      )
    }

    // 3. Executa a exclusão segura
    const { error } = await supabase.from('categorias').delete().eq('slug', slug)
    
    if (error) throw error
    
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
});