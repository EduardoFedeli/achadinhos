import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategorias, getCategoria } from '@/lib/produtos'
import Header from '@/components/Header'
import CategoriaContent from './CategoriaContent'

interface PageProps {
  params: Promise<{ categoria: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoria: slug } = await params
  const cat = getCategoria(slug)
  if (!cat) return {}
  return {
    title: `${cat.nome} — T-Hex Indica`,
    description: cat.descricao,
  }
}

export async function generateStaticParams() {
  return getCategorias().map(c => ({ categoria: c.slug }))
}

export default async function CategoriaPage({ params }: PageProps) {
  const { categoria: slug } = await params
  const cat = getCategoria(slug)
  
  if (!cat) {
    notFound()
  }

  const todasCategorias = getCategorias()

  return (
    <div className="min-h-screen bg-[#0F0F13] flex flex-col">
      <Header />
      {/* mx-auto e max-w-7xl para espelhar a estrutura da Home */}
      <main className="w-full max-w-7xl mx-auto flex-1 px-4 md:px-8 mt-6">
        <CategoriaContent cat={cat} todasCategorias={todasCategorias} />
      </main>
    </div>
  )
}