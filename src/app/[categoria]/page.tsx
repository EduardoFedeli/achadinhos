import { createClient } from '@supabase/supabase-js'
import { getCategorias, formatarPreco } from '@/lib/produtos'
import Header from '@/components/Header'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CategoriaPage({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params
  const categorias = getCategorias()
  const categoriaInfo = categorias.find(c => c.slug === categoria)

  if (!categoriaInfo) notFound()

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const { data: produtosRaw } = await supabase
    .from('produtos')
    .select('*')
    .contains('categoriaSlugs', [categoria])
    .order('createdAt', { ascending: false })

  return (
    <main className="min-h-screen bg-page-bg text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-12">
          <span className="text-5xl bg-white/5 p-4 rounded-2xl border border-white/5 shadow-2xl">{categoriaInfo.emoji}</span>
          <div>
            <p className="text-brand text-xs font-black uppercase tracking-[0.2em] mb-1">Categoria</p>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter">{categoriaInfo.nome}</h1>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {(produtosRaw || []).map(p => (
            <ProductCard key={p.id} produto={p} categorias={categorias} />
          ))}
          {(!produtosRaw || produtosRaw.length === 0) && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
               <p className="text-muted-foreground uppercase font-bold tracking-widest">Nenhuma oferta encontrada nesta categoria no momento.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

// Reutilizando o card local para evitar erros de import
function ProductCard({ produto, categorias }: { produto: any, categorias: any[] }) {
  const slugPrincipal = produto.categoriaSlugs?.[0] || 'geral'
  const cat = categorias.find(c => c.slug === slugPrincipal)
  return (
    <div className="bg-[#1A1A24]/40 border border-[#2A2A35] rounded-2xl overflow-hidden hover:border-brand/50 transition-all group flex flex-col h-full">
      <div className="aspect-square relative overflow-hidden bg-[#0F0F13]">
        <img src={produto.imagem} alt={produto.nome} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-4 flex flex-col flex-1 gap-3">
        <h3 className="font-bold text-sm line-clamp-2 h-10">{produto.nome}</h3>
        <span className="text-xl font-black text-brand mt-auto">{formatarPreco(produto.preco)}</span>
        <a href={produto.linkAfiliado || produto.link_afiliado} target="_blank" className="w-full bg-white/5 hover:bg-brand hover:text-black text-center py-3 rounded-xl text-[11px] font-black transition-all uppercase">Ver Oferta</a>
      </div>
    </div>
  )
}