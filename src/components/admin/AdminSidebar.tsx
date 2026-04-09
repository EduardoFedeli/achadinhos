'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, FolderTree, Radar, Store, AlertTriangle, Beaker, Bot } from 'lucide-react'
import AdminLogoutButton from '@/components/admin/AdminLogoutButton'

export default function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Produtos', href: '/admin/dashboard/produtos', icon: Package },
    { name: 'Categorias', href: '/admin/dashboard/categorias', icon: FolderTree },
    { name: 'Marketplaces', href: '/admin/dashboard/marketplaces', icon: Store },
    { name: 'Laboratório', href: '/admin/dashboard/laboratorio', icon: Beaker },
    { name: 'Radar Automático', href: '/admin/dashboard/radar', icon: Radar },
    { name: 'Fila de Revisão', href: '/admin/dashboard/revisao', icon: Bot },
    { name: 'Auditoria (+90d)', href: '/admin/dashboard/auditoria', icon: AlertTriangle },
  ]

  return (
    <aside className="sticky top-0 h-screen hidden md:flex w-64 shrink-0 flex-col bg-card border-r border-border px-4 py-6">
      {/* Brand: T-Hex Indica */}
      <Link href="/" className="mb-8 text-2xl font-black text-foreground tracking-tight flex items-center gap-1">
        <span className="text-primary font-bold">T-Hex</span> Indica
      </Link>

      <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="flex flex-col gap-4 mt-auto border-t border-border pt-4">
        <AdminLogoutButton />
      </div>
    </aside>
  )
}