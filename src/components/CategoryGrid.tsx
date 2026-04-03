'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Categoria } from '@/types'

interface CategoryGridProps {
  categorias: Categoria[]
  slugAtivo?: string
}

export default function CategoryGrid({ categorias, slugAtivo }: CategoryGridProps) {
  return (
    /* CORREÇÕES UX: 
       - pt-4 adicionado para evitar que o scale-105 corte no topo.
       - lg:justify-center centraliza os itens no desktop.
    */
    <div className="flex flex-nowrap lg:justify-center gap-4 px-4 md:px-0 pt-4 pb-6 overflow-x-auto overflow-y-visible snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {categorias.map(cat => {
        const ativo = cat.slug === slugAtivo
        const currentColor = ativo ? cat.cor : '#1A1A24'
        const borderSecondary = '#2A2A35'

        return (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className="group flex flex-col items-center gap-3 shrink-0 snap-start"
          >
            <div
              className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-[22px] transition-all duration-300 group-hover:scale-110 group-active:scale-95 relative overflow-hidden"
              style={{
                backgroundColor: ativo ? cat.cor : '#1A1A24',
                boxShadow: ativo ? `0 8px 20px ${cat.cor}40` : '0 4px 12px rgba(0,0,0,0.2)',
                border: ativo ? `2px solid ${cat.cor}` : `1px solid ${borderSecondary}`
              }}
            >
              {/* LÓGICA DE ÍCONE: Imagem IA > Emoji */}
              {cat.iconeUrl ? (
                <div className="relative w-8 h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:rotate-3">
                  <Image
                    src={cat.iconeUrl}
                    alt={cat.nome}
                    fill
                    sizes="(max-width: 768px) 32px, 40px"
                    className={`object-contain transition-all ${ativo ? 'brightness-0 invert' : ''}`}
                  />
                </div>
              ) : (
                <span className={`text-2xl md:text-3xl transition-transform duration-300 group-hover:scale-110 ${ativo ? 'drop-shadow-md' : ''}`}>
                  {cat.emoji}
                </span>
              )}

              {ativo && (
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
              )}
            </div>

            <span
              className={`text-[10px] md:text-[11px] font-black tracking-widest uppercase transition-colors duration-300 ${
                ativo ? 'text-white' : 'text-[#A1A1AA] group-hover:text-white'
              }`}
              style={ativo ? { color: cat.cor } : undefined}
            >
              {cat.nome}
            </span>
          </Link>
        )
      })}
    </div>
  )
}