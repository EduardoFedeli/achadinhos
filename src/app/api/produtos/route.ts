import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isAdminAuthenticated } from '@/lib/adminAuth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: Request) {
// ... resto do seu código ...
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
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .order('createdAt', { ascending: false }) // Traz os mais novos primeiro

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data || [])
}