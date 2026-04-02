import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategorias, getCategoria } from '../../lib/produtos'
import Header from '../../components/Header'
import SectionHeader from '../../components/SectionHeader'
import CategoryGrid from '../../components/CategoryGrid'
import ProductGrid from '../../components/ProductGrid'
import BottomNav from '../../components/BottomNav'

interface PageProps {
  params: Promise<{ categoria: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoria: slug } = await params
  const cat = getCategoria(slug)
  if (!cat) return {}
  return {
    title: `${cat.nome} — Achadinhos`,
    description: cat.descricao,
  }
}

export async function generateStaticParams() {
  const categorias = getCategorias()
  return categorias.map(c => ({ categoria: c.slug }))
}

export default async function CategoriaPage({ params }: PageProps) {
  const { categoria: slug } = await params
  const cat = getCategoria(slug)

  if (!cat) notFound()

  const categorias = getCategorias()

  return (
    <div className="min-h-screen bg-page-bg pb-20">
      <Header />

      {/* Mini banner da categoria */}
      <section
        className="px-5 py-6"
        style={{ background: cat.cor }}
      >
        <p className="text-3xl">{cat.emoji}</p>
        <h1 className="mt-1 text-xl font-black text-gray-900">
          {cat.nome}
        </h1>
        <p className="text-sm text-gray-500">{cat.descricao}</p>
        <p className="mt-1 text-xs font-semibold text-brand">
          {cat.produtos.length} achados
        </p>
      </section>

      <SectionHeader title="Categorias" />
      <CategoryGrid categorias={categorias} slugAtivo={slug} />

      <SectionHeader title={`Todos os achados — ${cat.nome}`} />
      <ProductGrid produtos={cat.produtos} categorias={categorias} />

      <BottomNav />
    </div>
  )
}
