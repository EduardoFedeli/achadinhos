import { createClient } from '@supabase/supabase-js'
import { getCategorias } from '@/lib/produtos'
import Header from '@/components/Header'
import CategoriaContent from '../[slug]/CategoriaContent'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export const dynamic = 'force-dynamic'

export default async function ExplorarPage() {
  const categorias = await getCategorias()
  
  const { data: produtos } = await supabase
    .from('produtos')
    .select('*')
    .order('createdAt', { ascending: false })

  const produtosIniciais = produtos || []

  const categoriaExplorar = {
    nome: 'Todos os Achados',
    slug: 'explorar',
    emoji: '🧭',
    cor: '#22C55E',
    descricao: 'Explore a base completa de ofertas garimpadas pelo T-Hex.'
  }

  const lojasPresentes = [...new Set(produtosIniciais.map(p => p.lojaOrigem))]
  const tagsPresentes = [...new Set(produtosIniciais.flatMap(p => p.tags || []))].sort()

  return (
    <div className="flex flex-col pb-20">
      <Header />
      <CategoriaContent 
        slug="explorar"
        categoriaAtual={categoriaExplorar as any}
        categorias={categorias}
        produtosIniciais={produtosIniciais}
        marketplacesDisponiveis={lojasPresentes}
        tagsDaCategoria={tagsPresentes}
      />
    </div>
  )
}