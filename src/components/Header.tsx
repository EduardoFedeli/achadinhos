import Link from 'next/link'
import { getCategorias } from '@/lib/produtos'

export default function Header() {
  const categorias = getCategorias()

  return (
    <header className="sticky top-0 z-20 bg-surface border-b border-card-border">
      {/* Row 1: logo + icons */}
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-2xl font-black tracking-tight">
          <span className="font-light text-white">acha</span>
          <span className="font-bold text-white">dinhos</span>
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Buscar"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg"
          >
            🔍
          </button>
          <button
            type="button"
            aria-label="Notificações"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg"
          >
            🔔
          </button>
        </div>
      </div>
      {/* Row 2: category chips — horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none">
        {categorias.map(cat => (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/20"
          >
            <span>{cat.emoji}</span>
            <span>{cat.nome}</span>
          </Link>
        ))}
      </div>
    </header>
  )
}
