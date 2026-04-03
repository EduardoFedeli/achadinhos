import Link from 'next/link'
import type { Categoria } from '@/types'

interface CategoryGridProps {
  categorias: Categoria[]
  slugAtivo?: string
}

export default function CategoryGrid({ categorias, slugAtivo }: CategoryGridProps) {
  return (
    // Transformado em carrossel flex-nowrap com scroll oculto
    <div className="flex flex-nowrap gap-4 px-4 md:px-8 pb-5 overflow-x-auto snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {categorias.map(cat => {
        const ativo = cat.slug === slugAtivo
        return (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            // shrink-0 garante que o botão não seja esmagado; snap-start alinha o scroll
            className="group flex flex-col items-center gap-2 shrink-0 snap-start"
          >
            <div
              className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-2xl text-2xl transition-transform duration-300 group-hover:scale-105"
              style={{
                backgroundColor: ativo ? cat.cor : '#1A1A24',
                boxShadow: ativo ? `0 0 16px ${cat.cor}40` : undefined,
                border: ativo ? `1px solid ${cat.cor}` : '1px solid #2A2A35'
              }}
            >
              {cat.emoji}
            </div>
            <span
              className={`text-[11px] font-bold tracking-wide transition-colors ${ativo ? 'text-white' : 'text-[#A1A1AA] group-hover:text-white'}`}
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