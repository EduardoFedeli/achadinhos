import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isAdminAuthenticated } from '@/lib/adminAuth'

// Função resiliente para garantir que a URL sempre seja válida para o compilador
function getValidSupabaseUrl() {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://build-fallback.supabase.co'
  url = url.trim().replace(/^["']|["']$/g, '') // Remove aspas ou espaços acidentais
  if (!url.startsWith('http')) {
    url = `https://${url}`
  }
  return url
}

const supabaseUrl = getValidSupabaseUrl()
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || 'build-fallback-key').trim()

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { produto, categoriaSlugs } = body

    if (!categoriaSlugs || categoriaSlugs.length === 0) {
      return NextResponse.json({ error: 'Nenhuma categoria informada' }, { status: 400 })
    }

    const produtoParaInserir = {
      nome: produto.nome,
      categoriaSlugs: categoriaSlugs,
      lojaOrigem: produto.loja,
      preco: produto.preco,
      precoOriginal: produto.preco_original || null,
      desconto_pct: produto.desconto_pct || null,
      imagem: produto.imagem,
      linkAfiliado: produto.link_afiliado,
      destaque: produto.destaque,
      novo: produto.novo,
      tags: produto.tags || [],
      createdAt: produto.createdAt
    }

    // ... código anterior permanece ...
    const { data, error } = await supabase.from('produtos').insert([produtoParaInserir]).select()

    // Se o Supabase reclamar, devolvemos o objeto de erro INTEIRO para o frontend
    if (error) {
      return NextResponse.json({ error: error }, { status: 400 })
    }

    return NextResponse.json({ ok: true, data }, { status: 201 })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  const { data, error } = await supabase.from('produtos').select('*').order('createdAt', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}