'use client'

import { useState, useMemo } from 'react'
import type { Categoria, FiltrosProduto } from '@/types'
import ProductCard from '@/components/ProductCard'
import FilterPanel from '@/components/FilterPanel'
import CategoryGrid from '@/components/CategoryGrid'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Filter } from 'lucide-react'

interface CategoriaContentProps {
  cat: Categoria
  todasCategorias: Categoria[]
}

function getTagsDaCategoria(produtos?: any[]): string[] {
  if (!produtos || !Array.isArray(produtos)) return []
  const set = new Set<string>()
  for (const p of produtos) {
    for (const tag of p.tags ?? []) set.add(tag)
  }
  return Array.from(set).sort()
}

export default function CategoriaContent({ cat, todasCategorias }: CategoriaContentProps) {
  const [filtros, setFiltros] = useState<FiltrosProduto>({})
  const [ordenacao, setOrdenacao] = useState<string>('popularidade')

  const produtosDaCategoria = cat?.produtos || []
  
  const precoMaxTotal = useMemo(() => {
    if (produtosDaCategoria.length === 0) return 1000 
    return Math.ceil(Math.max(...produtosDaCategoria.map(p => p.preco || 0)) / 10) * 10
  }, [produtosDaCategoria])

  const marketplacesDisponiveis = useMemo(() => {
    if (!produtosDaCategoria) return []
    const mkt = new Set<string>()
    produtosDaCategoria.forEach((p: any) => {
      if (p.marketplace) mkt.add(p.marketplace.toLowerCase())
      else if (p.loja) mkt.add(p.loja.toLowerCase()) 
    })
    return Array.from(mkt)
  }, [produtosDaCategoria])

  const tags = useMemo(() => getTagsDaCategoria(produtosDaCategoria), [produtosDaCategoria])

  const produtosFiltradosEOrdenados = useMemo(() => {
    let filtrados = produtosDaCategoria.filter((p: any) => {
      // Filtro de Preço
      if (filtros.precoMin && p.preco < filtros.precoMin) return false
      if (filtros.precoMax && p.preco > filtros.precoMax) return false
      
      // Filtro de Loja
      if (filtros.lojas && filtros.lojas.length > 0) {
        const pLoja = (p.marketplace || p.loja || '').toLowerCase()
        if (!filtros.lojas.includes(pLoja)) return false
      }
      
      // Filtro de Tags
      if (filtros.tags && filtros.tags.length > 0) {
        if (!p.tags) return false
        if (!filtros.tags.some(t => p.tags.includes(t))) return false
      }
      
      return true
    })

    return filtrados.sort((a: any, b: any) => {
      switch (ordenacao) {
        case 'menor-preco':
          return (a.preco || 0) - (b.preco || 0)
        case 'maior-preco':
          return (b.preco || 0) - (a.preco || 0)
        case 'maior-desconto':
          const descA = a.precoOriginal && a.preco ? ((a.precoOriginal - a.preco) / a.precoOriginal) : 0
          const descB = b.precoOriginal && b.preco ? ((b.precoOriginal - b.preco) / b.precoOriginal) : 0
          return descB - descA
        case 'a-z':
          return (a.nome || '').localeCompare(b.nome || '')
        case 'popularidade':
        default:
          return 0
      }
    })
  }, [produtosDaCategoria, filtros, ordenacao])

  const catColor = cat?.cor || '#22C55E'

  if (!cat) return <div className="p-8 text-white text-center">Carregando departamento...</div>

  const filtrosAtivos = 
    (filtros.precoMin || filtros.precoMax ? 1 : 0) +
    (filtros.lojas?.length || 0) +
    (filtros.tags?.length || 0)

  return (
    <div className="w-full pb-24 space-y-8 mt-4 relative">
      <div className="py-6 mb-2">
        <CategoryGrid categorias={todasCategorias} slugAtivo={cat.slug} />
      </div>

      <section className="relative overflow-hidden rounded-3xl bg-[#1A1A24] border border-[#2A2A35] px-6 py-8 md:px-10 flex items-center justify-between shadow-lg">
        <div
          className="absolute -right-10 -top-20 h-64 w-64 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ backgroundColor: catColor }}
        />
        
        <div className="relative z-10">
          <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-[#A1A1AA]">
            Departamento
          </p>
          <h1 className="text-3xl md:text-4xl font-black leading-tight" style={{ color: catColor }}>
            {cat.nome}
          </h1>
          <p className="text-sm text-[#A1A1AA] font-medium">{cat.descricao}</p>
        </div>
        
        <span className="relative z-10 text-6xl md:text-7xl opacity-90 hidden sm:block select-none">
          {cat.emoji}
        </span>
      </section>

      <div className="flex flex-col md:flex-row gap-8">
        
        <aside className="hidden md:block w-[260px] shrink-0 sticky top-28 h-fit">
          <FilterPanel
            filtros={filtros}
            onFiltrosChange={setFiltros}
            tagsDaCategoria={tags}
            precoMaxTotal={precoMaxTotal}
            cor={catColor}
            marketplacesDisponiveis={marketplacesDisponiveis} 
          />
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-[#1A1A24]/60 p-4 rounded-2xl border border-[#2A2A35]">
            <h2 className="text-lg font-bold text-white flex items-center gap-3">
              <span className="w-1.5 h-5 rounded-full" style={{ backgroundColor: catColor }} />
              {produtosFiltradosEOrdenados.length} achados
            </h2>

            <Select value={ordenacao} onValueChange={setOrdenacao}>
              <SelectTrigger className="w-[180px] bg-[#0F0F13] border-[#2A2A35] text-white focus:ring-1 transition-colors rounded-xl font-medium outline-none" style={{ '--tw-ring-color': catColor } as React.CSSProperties}>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1A24] border-[#2A2A35] text-white rounded-xl">
                <SelectItem value="popularidade" className="focus:bg-white/10 focus:text-white cursor-pointer font-medium">Popularidade</SelectItem>
                <SelectItem value="maior-desconto" className="focus:bg-white/10 focus:text-white cursor-pointer font-medium">Maior Desconto</SelectItem>
                <SelectItem value="menor-preco" className="focus:bg-white/10 focus:text-white cursor-pointer font-medium">Menor Preço</SelectItem>
                <SelectItem value="maior-preco" className="focus:bg-white/10 focus:text-white cursor-pointer font-medium">Maior Preço</SelectItem>
                <SelectItem value="a-z" className="focus:bg-white/10 focus:text-white cursor-pointer font-medium">A - Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {produtosFiltradosEOrdenados.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {produtosFiltradosEOrdenados.map(produto => (
                <ProductCard key={produto.id} produto={produto} categoria={cat} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-[#1A1A24]/40 border border-[#2A2A35] rounded-3xl border-dashed">
              <span className="text-6xl mb-4 opacity-80 select-none">🦖</span>
              <h3 className="text-xl font-black text-white mb-2 tracking-tight">Poxa, nenhum achadinho...</h3>
              <p className="text-[#A1A1AA] text-sm mb-6 max-w-sm">
                O T-Hex farejou por toda a internet, mas não encontrou ofertas com essa combinação exata de filtros.
              </p>
              <Button
                onClick={() => setFiltros({})}
                style={{ backgroundColor: catColor, color: '#0F0F13' }}
                className="font-black px-6 h-11 rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.3)] hover:scale-105 transition-all"
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: catColor }}
            >
              <Filter className="text-[#0F0F13]" size={24} strokeWidth={2.5} />
              {filtrosAtivos > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF3838] text-[10px] font-black text-white border-2 border-[#0F0F13]">
                  {filtrosAtivos}
                </span>
              )}
            </button>
          </SheetTrigger>
          
          <SheetContent side="right" className="w-[85vw] bg-[#1A1A24] border-l border-[#2A2A35] p-0 flex flex-col h-full">
            <SheetHeader className="p-5 border-b border-[#2A2A35] bg-[#0F0F13]">
              <SheetTitle className="text-left text-white flex items-center gap-2 font-black">
                <Filter size={20} style={{ color: catColor }} />
                Filtros
              </SheetTitle>
            </SheetHeader>
            
            <div className="flex-1 overflow-y-auto p-5">
              <FilterPanel
                filtros={filtros}
                onFiltrosChange={setFiltros}
                tagsDaCategoria={tags}
                precoMaxTotal={precoMaxTotal}
                cor={catColor}
                marketplacesDisponiveis={marketplacesDisponiveis} 
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}