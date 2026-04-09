import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withAdmin } from '@/lib/auth'

export const POST = withAdmin(async function(req: Request) {
  try {
    const body = await req.json()
    const { ids, action } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'IDs não fornecidos.' }, { status: 400 })
    }

    // A MÁGICA AQUI: Trocamos a ANON_KEY pela SERVICE_ROLE_KEY
    // Isso dá poder de "Deus" para a rota pular as regras do RLS e excluir os itens
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    if (action === 'delete') {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .in('id', ids)

      if (error) {
        throw error
      }

      return NextResponse.json({ success: true, message: `${ids.length} produtos deletados com sucesso.` })
    }

    return NextResponse.json({ error: 'Ação não suportada.' }, { status: 400 })

  } catch (error: any) {
    console.error('Erro na operação em lote (bulk):', error)
    return NextResponse.json({ error: error.message || 'Erro interno do servidor.' }, { status: 500 })
  }
});