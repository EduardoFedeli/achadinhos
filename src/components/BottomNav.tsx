'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ITENS = [
  { href: '/', label: 'Início', emoji: '🏠' },
  { href: '/sobre', label: 'Sobre', emoji: 'ℹ️' },
  { href: '/pets', label: 'Pets', emoji: '🐾' },
  { href: '/games', label: 'Games', emoji: '🎮' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 flex justify-around border-t border-card-border bg-surface pb-4 pt-2.5">
      {ITENS.map(item => {
        const ativo = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 text-[9px] font-semibold ${
              ativo ? 'text-brand' : 'text-muted-foreground'
            }`}
          >
            <span className="text-xl">{item.emoji}</span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
