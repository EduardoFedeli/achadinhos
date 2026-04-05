import { createClient } from '@supabase/supabase-js'
import { getCategorias, formatarPreco } from '@/lib/produtos'
import Header from '@/components/Header'
import CategoryGrid from '@/components/CategoryGrid'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const categorias = getCategorias()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const { data: produtosRaw } = await supabase
    .from('produtos')
    .select('*')
    .order('createdAt', { ascending: false })

  const produtos = produtosRaw || []
  const produtosDestaque = produtos.filter(p => p.destaque)

  return (
    <main className="min-h-screen bg-page-bg text-white">
      <Header />
      
      <section className="relative pt-20 pb-16 px-4 overflow-hidden bg-[#0A0A0B]">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase italic">
            A sua próxima <br />
            <span className="text-brand">Grande Descoberta</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            As melhores ofertas de tecnologia, games e setup selecionadas a dedo.
          </p>
          <Link href="#ofertas" className="bg-brand text-black font-black px-8 py-4 rounded-full text-lg hover:scale-105 transition-transform inline-block uppercase">
            Começar a Caçada →
          </Link>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <CategoryGrid categorias={categorias} />
      </div>

      <div id="ofertas" className="max-w-7xl mx-auto px-4 py-16 space-y-20">
        {produtosDestaque.length > 0 && (
          <section>
            <h2 className="text-3xl font-black mb-8 flex items-center gap-3 uppercase tracking-tighter">
              🏆 Em <span className="text-brand">Destaque</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {produtosDestaque.map(p => (
                <ProductCard key={p.id} produto={p} categorias={categorias} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-3xl font-black mb-8 flex items-center gap-3 uppercase tracking-tighter">
            🔥 Melhores <span className="text-brand">Ofertas</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {produtos.map(p => (
              <ProductCard key={p.id} produto={p} categorias={categorias} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

function ProductCard({ produto, categorias }: { produto: any, categorias: any[] }) {
  const slugPrincipal = produto.categoriaSlugs?.[0] || 'geral'
  const cat = categorias.find(c => c.slug === slugPrincipal)
  
  return (
    <div className="bg-[#1A1A24]/40 border border-[#2A2A35] rounded-2xl overflow-hidden hover:border-brand/50 transition-all group flex flex-col h-full">
      <div className="aspect-square relative overflow-hidden bg-[#0F0F13]">
        <img 
          src={produto.imagem} 
          alt={produto.nome} 
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" 
        />
        {produto.desconto_pct && (
          <span className="absolute top-3 right-3 bg-brand text-black text-[10px] font-black px-2 py-1 rounded-md shadow-lg">
            {produto.desconto_pct}% OFF
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
          <span className="bg-white/5 px-2 py-1 rounded">{cat?.emoji} {cat?.nome || 'Oferta'}</span>
        </div>

        <h3 className="font-bold text-sm line-clamp-2 h-10 text-gray-100 group-hover:text-brand transition-colors">
          {produto.nome}
        </h3>

        <div className="mt-auto pt-2">
          <div className="flex flex-col">
            {(produto.precoOriginal || produto.preco_original) && (
              <span className="text-xs text-muted-foreground line-through decoration-brand/30">
                {formatarPreco(produto.precoOriginal || produto.preco_original)}
              </span>
            )}
            <span className="text-xl font-black text-brand tracking-tighter">
              {formatarPreco(produto.preco)}
            </span>
          </div>
        </div>

        <a 
          href={produto.linkAfiliado || produto.link_afiliado} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full bg-white/5 hover:bg-brand hover:text-black text-center py-3 rounded-xl text-[11px] font-black transition-all uppercase tracking-widest mt-2"
        >
          Ver Oferta
        </a>
      </div>
    </div>
  )
}