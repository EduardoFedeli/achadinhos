import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isAdminAuthenticated } from '@/lib/adminAuth'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  try {
    const { id, preco, precoOriginal, desconto_pct } = await request.json()
    const { error } = await supabase.from('produtos').update({ preco, precoOriginal, desconto_pct }).eq('id', id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}