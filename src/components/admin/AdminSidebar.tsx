'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Moon, Sun, LayoutDashboard, Package, FolderTree } from 'lucide-react'
import AdminLogoutButton from '@/components/admin/AdminLogoutButton'
import { Button } from '@/components/ui/button'

export default function AdminSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Produtos', href: '/admin/dashboard/produtos', icon: Package },
    { name: 'Categorias', href: '/admin/dashboard/categorias', icon: FolderTree },
  ]

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col bg-card border-r border-border px-4 py-6 transition-colors duration-200">
      {/* Brand: T-Hex Indica */}
      <Link href="/" className="mb-8 text-2xl font-black text-foreground tracking-tight flex items-center gap-1">
        <span className="text-primary font-bold">T</span>-Hex Indica
      </Link>

      <nav className="flex flex-col gap-2 flex-1">
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
        <div className="flex items-center justify-between px-2">
          <span className="text-sm text-muted-foreground font-medium">Tema</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Alternar tema</span>
          </Button>
        </div>
        <AdminLogoutButton />
      </div>
    </aside>
  )
}