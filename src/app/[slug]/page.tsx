import { createClient } from '@supabase/supabase-js'
import { getCategorias } from '@/lib/produtos'
import Header from '@/components/Header'
import CategoriaContent from './CategoriaContent'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export const dynamic = 'force-dynamic'

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const categorias = await getCategorias()
  const categoriaAtual = categorias.find(c => c.slug === slug)

  if (!categoriaAtual) return <div className="text-white p-20 text-center font-black">CATEGORIA NÃO ENCONTRADA</div>

  // Busca produtos da categoria
  const { data: produtos } = await supabase
    .from('produtos')
    .select('*')
    .contains('categoriaSlugs', [slug])
    .order('createdAt', { ascending: false })

  const produtosIniciais = produtos || []

  // Extrai lojas e tags que REALMENTE existem nestes produtos
  const lojasPresentes = [...new Set(produtosIniciais.map(p => p.lojaOrigem))]
  const tagsPresentes = [...new Set(produtosIniciais.flatMap(p => p.tags || []))].sort()

  return (
    <div className=" flex flex-col pb-20">
      <Header />
      <CategoriaContent 
        slug={slug}
        categoriaAtual={categoriaAtual}
        categorias={categorias}
        produtosIniciais={produtosIniciais}
        marketplacesDisponiveis={lojasPresentes}
        tagsDaCategoria={tagsPresentes}
      />
    </div>
  )
}