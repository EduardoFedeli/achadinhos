import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withAdmin } from '@/lib/auth'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export const POST = withAdmin(async function(request: Request) {
  try {
    const cat = await request.json()
    const { data, error } = await supabase.from('categorias').insert([cat]).select()
    if (error) throw error
    return NextResponse.json({ ok: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
});