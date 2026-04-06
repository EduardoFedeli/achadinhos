import { createClient } from '@supabase/supabase-js'
import { getCategorias } from '@/lib/produtos'
import Header from '@/components/Header'
import HeroBanner from '@/components/HeroBanner'
import CategoryGrid from '@/components/CategoryGrid'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// ESTRATÉGIA DE CACHE: Revalida a página automaticamente a cada 15 minutos (900 seg)
// Isso garante velocidade de site estático com dados atualizados.
export const revalidate = 900; 

// Função utilitária para aleatoriedade (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default async function HomePage() {
  const categorias = await getCategorias()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Busca todos os produtos ativos
  const { data: produtosRaw } = await supabase.from('produtos').select('*');
  const todosProdutos = produtosRaw || [];

  // Filtros de Vitrine com Aleatoriedade para aumentar o CTR (Click Through Rate)
  const destaques = shuffleArray(todosProdutos.filter(p => p.destaque)).slice(0, 10);
  const ofertas = shuffleArray(todosProdutos.filter(p => (p.desconto_pct || 0) > 0)).slice(0, 10);

  const getCat = (slug: string) => categorias.find(c => c.slug === slug) || categorias[0];

  return (
    <div className="min-h-screen bg-[#0F0F13] flex flex-col pb-20 font-inter">
      <Header />

      <section className="w-full border-b border-[#2A2A35]">
        <HeroBanner />
      </section>

      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 space-y-12 mt-8">
        
        {/* Grade de Categorias Dinâmica */}
        <section>
          <CategoryGrid categorias={categorias} />
        </section>

        {/* VITRINE: EM DESTAQUE */}
        {destaques.length > 0 && (
          <section className="bg-[#1A1A24]/40 p-6 md:p-10 rounded-[40px] border border-[#2A2A35] relative overflow-hidden">
            <div className="absolute -left-20 -top-20 w-80 h-80 bg-[#22C55E]/5 blur-[120px] pointer-events-none" />
            
            <header className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🏆</span>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase italic">Em destaque</h2>
              </div>
              <SeeAllButton href="/explorar" color="#22C55E" />
            </header>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-8">
              {destaques.map((produto, i) => (
                <ProductCard 
                  key={produto.id} 
                  produto={produto} 
                  categoria={getCat(produto.categoriaSlugs?.[0])} 
                  brandColorOnly={true}
                  priority={i < 5} // Otimização LCP: Prioriza as primeiras 5 imagens
                />
              ))}
            </div>
          </section>
        )}

        {/* VITRINE: MELHORES OFERTAS */}
        <section className="bg-[#1A1A24]/40 p-6 md:p-10 rounded-[40px] border border-[#2A2A35] relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#F97316]/5 blur-[120px] pointer-events-none" />

          <header className="flex items-center justify-between mb-10 relative z-10">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔥</span>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase italic">Melhores ofertas</h2>
            </div>
            <SeeAllButton href="/explorar" color="#F97316" />
          </header>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-8">
            {ofertas.map(produto => (
              <ProductCard 
                key={produto.id} 
                produto={produto} 
                categoria={getCat(produto.categoriaSlugs?.[0])} 
                forceColor="#F97316" 
              />
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}

// Componente Interno para manter consistência visual nos botões
function SeeAllButton({ href, color }: { href: string, color: string }) {
  return (
    <Link 
      href={href} 
      className="group flex items-center gap-2 text-[10px] font-black border px-5 py-2.5 rounded-full transition-all duration-300"
      style={{ color: color, borderColor: `${color}4D` }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = color;
        e.currentTarget.style.color = '#0F0F13';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = color;
      }}
    >
      VER TUDO
      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
    </Link>
  )
}