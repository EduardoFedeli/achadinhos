import { createClient } from '@supabase/supabase-js'
import { getCategorias } from '@/lib/produtos'
import Header from '@/components/Header'
import CategoriaContent from '../[slug]/CategoriaContent'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export const dynamic = 'force-dynamic'

export default async function NovidadesPage() {
  const categorias = await getCategorias()

  const { data: produtos } = await supabase
    .from('produtos')
    .select('*')
    .eq('novo', true)
    .order('createdAt', { ascending: false })

  const produtosIniciais = produtos || []

  const categoriaNovidadesPage = {
    nome: 'Novidades',
    slug: 'novidades',
    emoji: '⚡',
    cor: '#22D3EE',
    descricao: 'Os produtos mais recentes garimpados pelo T-Hex.',
  }

  const lojasPresentes = [...new Set(produtosIniciais.map((p: any) => p.lojaOrigem || p.loja).filter(Boolean))]
  const tagsPresentes = [...new Set(produtosIniciais.flatMap((p: any) => p.tags || []))].sort() as string[]

  return (
    // REMOVIDO: O 'bg-[#0F0F13]' e o 'min-h-screen' que cobriam o layout global
    <div className="flex flex-col pb-20">
      <Header />
      <CategoriaContent
        slug="novidades"
        categoriaAtual={categoriaNovidadesPage as any}
        categorias={categorias}
        produtosIniciais={produtosIniciais}
        marketplacesDisponiveis={lojasPresentes}
        tagsDaCategoria={tagsPresentes}
        opcoesOcultasOrdenacao={['novidades']}
      />
    </div>
  )
}