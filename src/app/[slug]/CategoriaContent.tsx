'use client'

import { useState, useMemo, useEffect } from 'react'
import CategoryGrid from '@/components/CategoryGrid'
import ProductCard from '@/components/ProductCard'
import FilterPanel from '@/components/FilterPanel'
import type { Categoria, Produto, FiltrosProduto } from '@/types'

export default function CategoriaContent({ slug, categoriaAtual, categorias, produtosIniciais, marketplacesDisponiveis, tagsDaCategoria }: any) {
  const [filtros, setFiltros] = useState<FiltrosProduto>({})
  const [ordenacao, setOrdenacao] = useState('popularidade')
  // Novo estado para controlar a gaveta de filtros no celular
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const corAtiva = categoriaAtual?.cor || '#22C55E'

  useEffect(() => {
    document.documentElement.style.setProperty('--brand-color', corAtiva);
    return () => {
      document.documentElement.style.setProperty('--brand-color', '#22C55E');
    }
  }, [corAtiva])

  const precoMaximoReal = useMemo(() => {
    if (!produtosIniciais || produtosIniciais.length === 0) return 1000
    const max = Math.max(...produtosIniciais.map((p: any) => p.preco || 0))
    return Math.ceil(max)
  }, [produtosIniciais])

  const produtosExibidos = useMemo(() => {
    let filtrados = [...(produtosIniciais || [])].filter((p: any) => {
      const dentroPreco = (p.preco || 0) >= (filtros.precoMin || 0) && (p.preco || 0) <= (filtros.precoMax || precoMaximoReal)
      const naLoja = filtros.lojas && filtros.lojas.length > 0 ? filtros.lojas.includes(p.lojaOrigem as any) : true
      const temTags = filtros.tags && filtros.tags.length > 0 ? filtros.tags.every(tag => p.tags?.includes(tag)) : true
      return dentroPreco && naLoja && temTags
    })

    if (ordenacao === 'menor_preco') filtrados.sort((a: any, b: any) => a.preco - b.preco)
    if (ordenacao === 'maior_preco') filtrados.sort((a: any, b: any) => b.preco - a.preco)
    if (ordenacao === 'desconto') filtrados.sort((a: any, b: any) => {
      const descA = (a.preco_original || 0) - a.preco
      const descB = (b.preco_original || 0) - b.preco
      return descB - descA
    })

    return filtrados
  }, [filtros, produtosIniciais, precoMaximoReal, ordenacao])

  return (
    <main className="relative z-10 w-full min-h-screen">
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-[1000px] h-[500px] opacity-20 pointer-events-none blur-[150px] -z-10 transition-colors duration-700" 
        style={{ backgroundColor: corAtiva }} 
      />

      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 mt-1 space-y-6">
        
        <div className="w-full">
          <CategoryGrid categorias={categorias} slugAtivo={slug} compact={true} />
        </div>

        <header className="relative p-6 md:p-8 rounded-[32px] border border-[#2A2A35]/50 bg-[#1A1A24]/40 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 opacity-80" style={{ backgroundColor: corAtiva, boxShadow: `0 0 20px ${corAtiva}` }} />
          
          <div className="flex items-center gap-6 md:gap-8 ml-2">
            <div className="relative">
               <div className="absolute inset-0 blur-2xl opacity-40 rounded-full" style={{ backgroundColor: corAtiva }} />
               <span className="relative z-10 text-5xl md:text-7xl leading-none">{categoriaAtual?.emoji || '📂'}</span>
            </div>
             
             <div>
               <h1 
                 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-none bg-clip-text text-transparent"
                 style={{ backgroundImage: `linear-gradient(to right, #FFFFFF, ${corAtiva})` }}
               >
                 {categoriaAtual?.nome || 'Categoria'}
               </h1>
               <p className="text-[#A1A1AA] text-xs md:text-sm font-medium mt-2 md:mt-3 uppercase tracking-[0.2em]">
                 {categoriaAtual?.descricao || 'Achadinhos garimpados'}
               </p>
             </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* PAINEL DE FILTROS DESKTOP: Oculto no celular (hidden lg:block) */}
          <aside className="hidden lg:block w-[280px] shrink-0">
            <FilterPanel 
              filtros={filtros} 
              onFiltrosChange={setFiltros} 
              tagsDaCategoria={tagsDaCategoria || []} 
              precoMaxTotal={precoMaximoReal}
              cor={corAtiva} 
              marketplacesDisponiveis={marketplacesDisponiveis || []}
            />
          </aside>

          {/* ÁREA PRINCIPAL: Produtos e Botões do Topo */}
          <div className="flex-1 pb-20">
            {/* Barra de Ferramentas (Achados, Botão Filtro Mobile, Ordenação) */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 px-2">
              <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 w-full md:w-auto">
                <span className="w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: corAtiva, color: corAtiva }} />
                {produtosExibidos.length} Achados
              </h2>

              <div className="flex items-center gap-2 w-full md:w-auto">
                {/* BOTÃO DE FILTRO MOBILE */}
                <button 
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex-1 flex items-center justify-center gap-2 bg-[#1A1A24] border border-[#2A2A35] text-white text-[10px] font-black uppercase tracking-widest px-4 h-10 rounded-lg active:scale-95 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                  Filtros
                </button>

                <select 
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                  className="flex-1 md:flex-none bg-[#1A1A24] border border-[#2A2A35] text-white text-[10px] font-black uppercase tracking-widest px-4 h-10 rounded-lg outline-none cursor-pointer hover:border-[#3A3A45] transition-colors appearance-none"
                >
                  <option value="popularidade">Popularidade</option>
                  <option value="menor_preco">Menor Preço</option>
                  <option value="maior_preco">Maior Preço</option>
                  <option value="desconto">Melhores Ofertas</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {produtosExibidos.map((produto: any) => (
                <ProductCard key={produto.id} produto={produto} categoria={categoriaAtual} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* GAVETA DE FILTROS MOBILE (MODAL) */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#0F0F13] lg:hidden animate-in slide-in-from-bottom-full duration-300">
          {/* Cabeçalho do Modal */}
          <div className="flex items-center justify-between p-5 border-b border-[#2A2A35] bg-[#1A1A24]">
            <span className="font-black text-white uppercase tracking-widest text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: corAtiva }}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Filtros
            </span>
            <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-[#2A2A35] rounded-full text-white hover:text-[var(--brand-color)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          {/* Corpo do Modal com Scroll */}
          <div className="flex-1 overflow-y-auto p-4 pb-24">
            {/* Reaproveitamos o mesmo painel perfeitamente */}
            <FilterPanel 
              filtros={filtros} 
              onFiltrosChange={setFiltros} 
              tagsDaCategoria={tagsDaCategoria || []} 
              precoMaxTotal={precoMaximoReal}
              cor={corAtiva} 
              marketplacesDisponiveis={marketplacesDisponiveis || []}
            />
          </div>

          {/* Botão Fixo de Aplicar no Rodapé */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#1A1A24] border-t border-[#2A2A35] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <button 
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full h-12 rounded-xl font-black text-[#0F0F13] uppercase tracking-widest text-xs transition-transform active:scale-95"
              style={{ backgroundColor: corAtiva }}
            >
              Ver {produtosExibidos.length} Achados
            </button>
          </div>
        </div>
      )}
    </main>
  )
}