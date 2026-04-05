import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isAdminAuthenticated } from '@/lib/adminAuth'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  try {
    const { action, payload, id } = await request.json()

    // Atualiza os preços em massa (sem tocar na data de cadastro!)
    if (action === 'update_prices') {
      const updates = payload.map((p: any) => supabase.from('produtos').update({ preco: p.preco }).eq('id', p.id))
      await Promise.all(updates) // Executa todos juntos
      return NextResponse.json({ ok: true })
    }

    // Exclui um produto diretamente pela tela do Radar
    if (action === 'delete_product') {
      await supabase.from('produtos').delete().eq('id', id)
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}