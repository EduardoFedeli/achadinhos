import { getCategorias, getProdutosDestaque, getProdutosOferta } from '@/lib/produtos'
import Header from '@/components/Header'
import HeroBanner from '@/components/HeroBanner'
import CategoryGrid from '@/components/CategoryGrid'
import ProductCard from '@/components/ProductCard'

export default function HomePage() {
  const categorias = getCategorias()
  const destaques = getProdutosDestaque(10)
  const ofertas = getProdutosOferta().slice(0, 10)

  const getCat = (slug: string) => categorias.find(c => c.slug === slug) || categorias[0]

  return (
    <div className="min-h-screen bg-[#0F0F13] flex flex-col pb-20">
      <Header />

      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 space-y-16 mt-6">
        
        <HeroBanner />

        {/* Menu de Categorias */}
        <section>
          <CategoryGrid categorias={categorias} />
        </section>

        {/* Seção Destaques */}
        <section className="bg-[#1A1A24]/40 p-8 rounded-[32px] border border-[#2A2A35] shadow-2xl relative overflow-hidden">
          {/* Efeito de luz de fundo Brand Green */}
          <div className="absolute -left-20 -top-20 w-64 h-64 bg-[#22C55E]/10 blur-[100px] pointer-events-none" />
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔥</span>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">Em destaque</h2>
            </div>
            <button className="group flex items-center gap-2 text-xs font-black text-[#22C55E] border border-[#22C55E]/30 px-4 py-2 rounded-full hover:bg-[#22C55E] hover:text-[#0F0F13] transition-all duration-300">
              VER TUDO
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {destaques.map(produto => {
              const categoriaDoProduto = categorias.find(c => c.slug === (produto as any).categoriaSlug) || categorias[0];
              return (
                <ProductCard 
                  key={produto.id} 
                  produto={produto} 
                  categoria={categoriaDoProduto} 
                />
              );
            })}
          </div>
        </section>

        {/* Seção Ofertas */}
        <section className="bg-[#1A1A24]/40 p-8 rounded-[32px] border border-[#2A2A35] shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#22C55E]/10 blur-[100px] pointer-events-none" />

          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💰</span>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">Melhores ofertas</h2>
            </div>
            <button className="group flex items-center gap-2 text-xs font-black text-[#22C55E] border border-[#22C55E]/30 px-4 py-2 rounded-full hover:bg-[#22C55E] hover:text-[#0F0F13] transition-all duration-300">
              VER TUDO
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {ofertas.map(produto => (
              <ProductCard 
                key={produto.id} 
                produto={produto} 
                categoria={getCat((produto as any).categoriaSlug)} 
              />
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}