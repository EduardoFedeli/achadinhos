"use client"

import { createClient } from '@supabase/supabase-js'
import { getCategorias } from '@/lib/produtos'
import Header from '@/components/Header'
import HeroBanner from '@/components/HeroBanner'
import ProductCardRanked from '@/components/ProductCardRanked'
import Link from 'next/link'
import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { CarouselApi } from "@/components/ui/carousel"
import type { Categoria, Produto } from '@/types'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

async function getHomePageData() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  
  const [categoriasRaw, { data: produtosRaw }] = await Promise.all([
    getCategorias(),
    supabase.from('produtos').select('*')
  ])
  
  const todosProdutos = produtosRaw || []
  const maisVendidos = shuffleArray(todosProdutos.filter((p: Produto) => p.destaque === true)).slice(0, 12)
  const novidades = shuffleArray(todosProdutos.filter((p: Produto) => p.novo === true)).slice(0, 12)

  return {
    categoriasRaw,
    maisVendidos,
    novidades
  }
}

export default function HomePage() {
  const [data, setData] = React.useState<any>(null)
  
  const [heroApi, setHeroApi] = React.useState<CarouselApi>()
  const [heroCurrent, setHeroCurrent] = React.useState(0)
  const [heroCount, setHeroCount] = React.useState(0)

  React.useEffect(() => {
    getHomePageData().then(setData)
  }, [])

  React.useEffect(() => {
    if (!heroApi) return

    setHeroCount(heroApi.scrollSnapList().length)
    setHeroCurrent(heroApi.selectedScrollSnap())

    heroApi.on("select", () => {
      setHeroCurrent(heroApi.selectedScrollSnap())
    })
  }, [heroApi])

  if (!data) return <div className="min-h-screen bg-[#0F0F13]" />

  const { categoriasRaw, maisVendidos, novidades } = data
  const getCat = (slug: string) => categoriasRaw.find((c: Categoria) => c.slug === slug) || categoriasRaw[0]

  return (
    <div className="min-h-screen flex flex-col pb-20 overflow-hidden">

      <div>
        <Header />

        <main className="w-full max-w-7xl mx-auto px-4 md:px-8 space-y-12 md:space-y-16 mt-6 md:mt-10">

          {/* HeroBanner */}
          <section className="w-full relative rounded-3xl overflow-hidden group/hero shadow-2xl">
            <HeroBanner setApi={setHeroApi} />
            
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
              {Array.from({ length: heroCount }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => heroApi?.scrollTo(index)}
                  aria-label={`Ir para o slide ${index + 1}`}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all duration-300 active:scale-95",
                    heroCurrent === index 
                      ? "bg-[#22C55E] w-6 shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
                      : "bg-white/40 hover:bg-white/70"
                  )}
                />
              ))}
            </div>
          </section>

          {/* ── MAIS VENDIDOS ── */}
          {maisVendidos.length > 0 && (
            <section className="relative bg-[#1E1505]/60 p-5 md:p-7 rounded-3xl border border-[#F97316]/25 shadow-2xl overflow-visible backdrop-blur-sm">
              <div className="absolute -left-20 -top-20 w-80 h-80 bg-[#F97316]/10 blur-[130px] pointer-events-none rounded-full" />
              <div className="absolute right-0 bottom-0 w-56 h-56 bg-[#F97316]/6 blur-[90px] pointer-events-none rounded-full" />

              <div className="flex items-center justify-between mb-6 relative z-10">
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-2 leading-none">
                  🏆 Mais Vendidos
                </h2>
                <Link
                  href="/mais-vendidos"
                  className="group flex items-center gap-1.5 text-[10px] font-black text-[#F97316] border border-[#F97316]/40 px-3 py-1.5 rounded-full hover:bg-[#F97316] hover:text-[#0F0F13] transition-all duration-300"
                >
                  VER TUDO
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              </div>

              <div className="relative z-10 w-full">
                <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                  <CarouselContent className="-ml-3 md:-ml-4">
                    {maisVendidos.map((produto: Produto, i: number) => (
                      <CarouselItem key={produto.id} className="pl-3 md:pl-4 basis-[55%] sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                        <ProductCardRanked
                          produto={produto}
                          categoria={getCat(produto.categoriaSlugs?.[0] || "")}
                          badgeLabel="Mais Vendido"
                          badgeColor="#F97316"
                          priority={i < 2}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  
                  <div className="hidden md:block">
                    <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 bg-[#F97316] border-none text-white z-20 h-10 w-10 shadow-[0_4px_15px_rgba(249,115,22,0.4)] hover:bg-[#EA580C] hover:scale-110 transition-all disabled:hidden flex items-center justify-center" />
                    <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 bg-[#F97316] border-none text-white z-20 h-10 w-10 shadow-[0_4px_15px_rgba(249,115,22,0.4)] hover:bg-[#EA580C] hover:scale-110 transition-all disabled:hidden flex items-center justify-center" />
                  </div>
                </Carousel>
              </div>
            </section>
          )}

          {/* ── NOVIDADES ── */}
          {novidades.length > 0 && (
            <section className="relative bg-[#051018]/60 p-5 md:p-7 rounded-3xl border border-[#22D3EE]/20 shadow-2xl overflow-visible backdrop-blur-sm">
              <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#22D3EE]/8 blur-[130px] pointer-events-none rounded-full" />
              <div className="absolute left-0 bottom-0 w-56 h-56 bg-[#22D3EE]/5 blur-[90px] pointer-events-none rounded-full" />

              <div className="flex items-center justify-between mb-6 relative z-10">
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase flex items-center gap-2 leading-none">
                  ⚡ Novidades
                </h2>
                <Link
                  href="/novidades"
                  className="group flex items-center gap-1.5 text-[10px] font-black text-[#22D3EE] border border-[#22D3EE]/40 px-3 py-1.5 rounded-full hover:bg-[#22D3EE] hover:text-[#0F0F13] transition-all duration-300"
                >
                  VER TUDO
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              </div>

              <div className="relative z-10 w-full">
                <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                  <CarouselContent className="-ml-3 md:-ml-4">
                    {novidades.map((produto: Produto, i: number) => (
                      <CarouselItem key={produto.id} className="pl-3 md:pl-4 basis-[55%] sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                        <ProductCardRanked
                          produto={produto}
                          categoria={getCat(produto.categoriaSlugs?.[0] || "")}
                          badgeLabel="Novidade"
                          badgeColor="#22D3EE"
                          priority={i < 2}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  
                  <div className="hidden md:block">
                    <CarouselPrevious className="absolute -left-12 top-1/2 -translate-y-1/2 bg-[#22D3EE] border-none text-[#0F0F13] z-20 h-10 w-10 shadow-[0_4px_15px_rgba(34,211,238,0.4)] hover:bg-[#06B6D4] hover:scale-110 transition-all disabled:hidden flex items-center justify-center" />
                    <CarouselNext className="absolute -right-12 top-1/2 -translate-y-1/2 bg-[#22D3EE] border-none text-[#0F0F13] z-20 h-10 w-10 shadow-[0_4px_15px_rgba(34,211,238,0.4)] hover:bg-[#06B6D4] hover:scale-110 transition-all disabled:hidden flex items-center justify-center" />
                  </div>
                </Carousel>
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  )
}