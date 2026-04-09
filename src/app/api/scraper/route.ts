import { NextResponse } from 'next/server'
import { withAdmin } from '@/lib/auth'
import { rasparProduto } from '@/lib/scraper'

export const POST = withAdmin(async function(req: Request) {
  try {
    const { url } = await req.json()
    if (!url) return NextResponse.json({ error: 'URL não fornecida.' }, { status: 400 })

    const resultado = await rasparProduto(url)
    return NextResponse.json({
      nome: resultado.nome,
      preco: resultado.preco,
      preco_original: resultado.preco_original,
      imagem: resultado.imagem,
    })
  } catch (error: any) {
    console.error('[SCRAPER ERROR]', error.message)
    return NextResponse.json({ error: error.message || 'Erro ao caçar os dados.' }, { status: 500 })
  }
})
