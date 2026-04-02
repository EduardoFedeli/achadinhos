import Link from 'next/link'
import type { Categoria } from '@/types'

interface CategoryGridProps {
  categorias: Categoria[]
  slugAtivo?: string
}

export default function CategoryGrid({ categorias, slugAtivo }: CategoryGridProps) {
  return (
    <div className="flex flex-wrap justify-center gap-x-3 gap-y-4 px-5 pb-5">
      {categorias.map(cat => {
        const ativo = cat.slug === slugAtivo
        return (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className="flex flex-col items-center gap-1.5"
          >
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
              style={{
                backgroundColor: ativo ? cat.cor : 'rgba(255,255,255,0.08)',
                boxShadow: ativo ? `0 0 12px ${cat.cor}66` : undefined,
              }}
            >
              {cat.emoji}
            </div>
            <span
              className={`text-[10px] font-bold ${ativo ? 'text-white' : 'text-muted-foreground'}`}
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
