import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withAdmin } from '@/lib/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export const POST = withAdmin(async function(req: Request) {
  try {
    const { action, id, novaData } = await req.json()

    if (action === 'renovar') {
      const { error } = await supabase.from('produtos').update({ createdAt: novaData }).eq('id', id)
      if (error) throw error
    } 
    else if (action === 'excluir') {
      const { error } = await supabase.from('produtos').delete().eq('id', id)
      if (error) throw error
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})