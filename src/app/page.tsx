import { getCategorias, getProdutosDestaque, getProdutosOferta } from '@/lib/produtos'
import Header from '@/components/Header'
import HeroBanner from '@/components/HeroBanner'
import SectionHeader from '@/components/SectionHeader'
import CategoryGrid from '@/components/CategoryGrid'
import ProductGrid from '@/components/ProductGrid'
import BottomNav from '@/components/BottomNav'

export default function HomePage() {
  const categorias = getCategorias()
  const destaques = getProdutosDestaque(8)
  const ofertas = getProdutosOferta().slice(0, 8)

  return (
    <div className="min-h-screen bg-page-bg pb-20">
      <Header />
      <HeroBanner />

      <SectionHeader title="Categorias" />
      <CategoryGrid categorias={categorias} />

      <SectionHeader id="destaques" title="🔥 Em destaque" />
      <ProductGrid produtos={destaques} categorias={categorias} />

      <SectionHeader title="💰 Melhores ofertas" />
      <ProductGrid produtos={ofertas} categorias={categorias} />

      <BottomNav />
    </div>
  )
}
