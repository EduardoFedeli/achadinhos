'use client'

import Link from 'next/link'
import type { Categoria } from '@/types'

interface CategoriaComImagem extends Categoria {
  imagem_url?: string
}

interface CategoryGridProps {
  categorias: CategoriaComImagem[]
  slugAtivo?: string
  compact?: boolean
}

export default function CategoryGrid({ categorias, slugAtivo, compact = false }: CategoryGridProps) {
  const categoriasOrdenadas = [...categorias].sort((a, b) => a.nome.localeCompare(b.nome))

  const roundedClass = compact ? 'rounded-[20px]' : 'rounded-[28px]'
  const sizeClass = compact ? 'h-16 w-16 md:h-20 md:w-24' : 'h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24'
  const borderSecondary = '#2A2A35'

  // Gera as classes dinâmicas para TODAS as categorias de uma vez
  const dynamicStyles = categoriasOrdenadas.map(cat => `
    .cat-hover-${cat.slug}:hover .cat-text-${cat.slug} { color: ${cat.cor}; }
    .cat-active-bg-${cat.slug} { background-color: ${cat.cor}; box-shadow: 0 0 30px ${cat.cor}50; border: 2px solid ${cat.cor}; }
    .cat-inactive-bg-${cat.slug} { background-color: #1A1A24; border: 1px solid ${borderSecondary}; }
    .cat-border-hover-${cat.slug} { border-color: ${cat.cor}; }
    .cat-text-active-${cat.slug} { color: ${cat.cor}; }
  `).join('\n')

  return (
    <div className={`w-full ${compact ? 'py-0' : 'py-2'}`}>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none !important; }
        ${dynamicStyles}
      `}} />

      <div className={`
        flex 
        ${compact ? 'gap-2 md:gap-3 lg:gap-2' : 'gap-4 xl:gap-0'}
        ${compact ? 'px-0' : 'px-4 md:px-0'}
        py-4 flex-nowrap overflow-x-auto scrollbar-hide w-full 
        ${compact ? 'justify-start lg:justify-between max-w-none' : 'justify-start xl:justify-between max-w-7xl mx-auto'}
      `}>
        {categoriasOrdenadas.map(cat => {
          const ativo = cat.slug === slugAtivo

          return (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className={`cat-hover-${cat.slug} group flex flex-col items-center gap-2 md:gap-3 shrink-0 transition-transform active:scale-95`}
            >
              <div className={`flex items-center justify-center transition-all duration-300 relative ${sizeClass} ${roundedClass} ${ativo ? `cat-active-bg-${cat.slug}` : `cat-inactive-bg-${cat.slug}`}`}>
                
                {/* Borda de hover */}
                <div className={`cat-border-hover-${cat.slug} absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 ${roundedClass}`} />

                {cat.imagem_url ? (
                  <div className={`relative z-20 transition-transform duration-300 group-hover:scale-110 ${compact ? 'w-10 h-10 md:w-12 md:h-14' : 'w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14'}`}>
                    <img src={cat.imagem_url} alt={cat.nome} className={`w-full h-full object-contain ${ativo ? 'brightness-0 invert' : ''}`} />
                  </div>
                ) : (
                  <span className={`relative z-20 transition-transform duration-300 group-hover:scale-110 ${compact ? 'text-2xl md:text-3xl' : 'text-3xl md:text-3xl lg:text-4xl'}`}>
                    {cat.emoji}
                  </span>
                )}
              </div>

              <span className={`cat-text-${cat.slug} font-black tracking-widest uppercase transition-colors duration-300 ${compact ? 'text-[9px] md:text-[11px] lg:text-[12px]' : 'text-[11px] md:text-[12px] lg:text-[13px]'} ${ativo ? `text-white cat-text-active-${cat.slug}` : 'text-[#A1A1AA]'}`}>
                {cat.nome}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}