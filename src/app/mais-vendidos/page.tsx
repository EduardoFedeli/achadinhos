import { createClient } from '@supabase/supabase-js'
import { getCategorias } from '@/lib/produtos'
import Header from '@/components/Header'
import ProductCardRanked from '@/components/ProductCardRanked'
import Link from 'next/link'
import { Flame } from 'lucide-react'
import type { Categoria } from '@/types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export const dynamic = 'force-dynamic'

export default async function MaisVendidosPage() {
  const categorias = await getCategorias()

  const { data: produtos } = await supabase
    .from('produtos')
    .select('*')
    .eq('destaque', true)

  const produtosAll = produtos || []

  // Agrupa produtos por categoria sem o slice, permitindo o scroll no carrossel
  const gruposPorCategoria: { categoria: Categoria; produtos: any[] }[] = []

  for (const cat of categorias) {
    const produtosDaCat = produtosAll.filter((p: any) =>
      Array.isArray(p.categoriaSlugs)
        ? p.categoriaSlugs.includes(cat.slug)
        : p.categoriaSlug === cat.slug
    )
    if (produtosDaCat.length > 0) {
      gruposPorCategoria.push({ categoria: cat, produtos: produtosDaCat })
    }
  }

  const totalProdutos = produtosAll.length

  return (
    <div className=" flex flex-col pb-20">
      <Header />

      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-8 space-y-12">

        {/* Header Otimizado - Foco em Tipografia */}
        <header className="border-b border-[#27272A] pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F97316]/10 text-[#F97316]">
              <Flame size={24} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white leading-none">
              Mais Vendidos
            </h1>
          </div>
          <p className="text-[#A1A1AA] text-sm ml-13">
            {totalProdutos} produto{totalProdutos !== 1 ? 's' : ''} em alta no momento
          </p>
        </header>

        {gruposPorCategoria.length === 0 && (
          <div className="text-center py-20 text-[#A1A1AA] bg-[#1A1A24] rounded-2xl border border-[#27272A]">
            Nenhum produto marcado como Mais Vendido ainda.
          </div>
        )}

        {gruposPorCategoria.map(({ categoria, produtos: prods }) => (
          <section key={categoria.slug} className="relative">
            {/* Título da Categoria unificado */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg md:text-xl font-bold text-white uppercase tracking-tight flex items-center gap-2">
                <span>{categoria.emoji}</span>
                <span>{categoria.nome}</span>
              </h2>
              <Link
                href={`/${categoria.slug}`}
                className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA] transition-colors hover:text-[#F97316]"
              >
                Ver todos →
              </Link>
            </div>

            {/* Carrossel Horizontal - Responsivo e com Setas */}
            <Carousel
              opts={{
                align: "start",
                dragFree: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-3 md:-ml-4">
                {prods.map((produto: any, i: number) => (
                  <CarouselItem 
                    key={`${categoria.slug}-${produto.id}`} 
                    // Bases ajustadas para diminuir o card relativo à tela e mostrar mais itens
                    className="pl-3 md:pl-4 basis-[55%] sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                  >
                    <ProductCardRanked
                      produto={produto}
                      categoria={categoria}
                      badgeLabel="Mais Vendido"
                      badgeColor="#F97316" // Forçando o laranja padrão da tela
                      priority={i === 0}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {/* Setas nativas do shadcn/ui visíveis apenas em desktop (md+) */}
              {/* Setas reposicionadas para fora e com cor de destaque */}
              <div className="hidden md:block">
                <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 bg-[#F97316] border-none text-white z-20 h-10 w-10 shadow-[0_4px_15px_rgba(249,115,22,0.4)] hover:bg-[#EA580C] hover:scale-110 transition-all disabled:hidden flex items-center justify-center" />
                <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 bg-[#F97316] border-none text-white z-20 h-10 w-10 shadow-[0_4px_15px_rgba(249,115,22,0.4)] hover:bg-[#EA580C] hover:scale-110 transition-all disabled:hidden flex items-center justify-center" />
              </div>
            </Carousel>
          </section>
        ))}

      </main>
    </div>
  )
}