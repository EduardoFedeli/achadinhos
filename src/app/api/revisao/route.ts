import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { withAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

// Usamos a SERVICE_ROLE_KEY para ter poder de gravação
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const POST = withAdmin(async function(request: Request) {
  try {
    const { id, preco, precoOriginal, desconto_pct } = await request.json()

    // Atualiza apenas as colunas que TEMOS CERTEZA que existem no seu banco
    const { error } = await supabase
      .from('produtos')
      .update({ 
        preco, 
        precoOriginal, 
        desconto_pct
      })
      .eq('id', id)

    if (error) throw new Error(error.message)

    // O PULO DO GATO: Limpa o cache do Next.js. Isso faz o preço atualizar no site inteiro instantaneamente.
    revalidatePath('/', 'layout')

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('[API REVISAO ERROR]', error.message)
    return NextResponse.json({ error: error.message || 'Erro ao atualizar preço.' }, { status: 500 })
  }
})