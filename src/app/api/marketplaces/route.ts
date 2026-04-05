import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isAdminAuthenticated } from '@/lib/adminAuth'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  
  try {
    const { action, payload, id, ids } = await request.json()

    // 1. Criar novo
    if (action === 'create') {
      const { data, error } = await supabase.from('marketplaces').insert([payload]).select()
      if (error) throw error
      return NextResponse.json({ ok: true, data })
    }
    // 2. Editar 1 loja (ou ativar/pausar individual)
    if (action === 'update') {
      const { error } = await supabase.from('marketplaces').update(payload).eq('id', id)
      if (error) throw error
      return NextResponse.json({ ok: true })
    }
    // 3. Pausar/Ativar em massa
    if (action === 'update_many') {
      const { error } = await supabase.from('marketplaces').update(payload).in('id', ids)
      if (error) throw error
      return NextResponse.json({ ok: true })
    }
    // 4. Excluir em massa
    if (action === 'delete_many') {
      const { error } = await supabase.from('marketplaces').delete().in('id', ids)
      if (error) throw error
      return NextResponse.json({ ok: true })
    }
    
    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}