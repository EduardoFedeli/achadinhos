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
  
  // Aumentado o tamanho no modo compacto: de w-20 para w-24 no desktop
  const sizeClass = compact ? 'h-16 w-16 md:h-20 md:w-24' : 'h-16 w-16 md:h-20 md:w-20 lg:h-24 lg:w-24'

  return (
    <div className={`w-full ${compact ? 'py-0' : 'py-2'}`}>
      <div className={`
        flex 
        /* Gap reduzido drásticamente no compact para caber ícones maiores */
        ${compact ? 'gap-2 md:gap-3 lg:gap-2' : 'gap-4 xl:gap-0'}
        ${compact ? 'px-0' : 'px-4 md:px-0'}
        py-4
        flex-nowrap 
        ${compact ? 'justify-start lg:justify-between' : 'justify-start xl:justify-between'}
        overflow-x-auto scrollbar-hide w-full 
        ${compact ? 'max-w-none' : 'max-w-7xl mx-auto'}
      `}
      style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar { display: none !important; }
        `}</style>

        {categoriasOrdenadas.map(cat => {
          const ativo = cat.slug === slugAtivo
          const borderSecondary = '#2A2A35'

          return (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="group flex flex-col items-center gap-2 md:gap-3 shrink-0 transition-transform active:scale-95"
              style={{ '--cat-color': cat.cor } as React.CSSProperties}
            >
              <div
                className={`flex items-center justify-center transition-all duration-300 relative ${sizeClass} ${roundedClass}`}
                style={{
                  backgroundColor: ativo ? cat.cor : '#1A1A24',
                  boxShadow: ativo ? `0 0 30px ${cat.cor}50` : undefined,
                  border: ativo ? `2px solid ${cat.cor}` : `1px solid ${borderSecondary}`,
                } as React.CSSProperties}
              >
                <div 
                  className={`absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 ${roundedClass}`}
                  style={{ borderColor: cat.cor }}
                />

                {cat.imagem_url ? (
                  // Tamanho da imagem aumentado proporcionalmente ao card maior
                  <div className={`relative z-20 transition-transform duration-300 group-hover:scale-110 ${compact ? 'w-10 h-10 md:w-12 md:h-14' : 'w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14'}`}>
                    <img src={cat.imagem_url} alt={cat.nome} className={`w-full h-full object-contain ${ativo ? 'brightness-0 invert' : ''}`} />
                  </div>
                ) : (
                  // Fonte do emoji ajustada
                  <span className={`relative z-20 transition-transform duration-300 group-hover:scale-110 ${compact ? 'text-2xl md:text-3xl' : 'text-3xl md:text-3xl lg:text-4xl'}`}>
                    {cat.emoji}
                  </span>
                )}
              </div>

              {/* Fonte levemente maior no compact para equilibrar o ícone maior */}
              <span className={`font-black tracking-widest uppercase transition-colors duration-300 ${compact ? 'text-[9px] md:text-[11px] lg:text-[12px]' : 'text-[11px] md:text-[12px] lg:text-[13px]'} ${ativo ? 'text-white' : 'text-[#A1A1AA] group-hover:text-[var(--cat-color)]'}`} style={ativo ? { color: cat.cor } : undefined}>
                {cat.nome}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}