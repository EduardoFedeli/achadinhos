import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AdminLogoutButton from '@/components/admin/AdminLogoutButton'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_token')?.value !== 'ok') {
    redirect('/admin')
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col bg-white border-r border-gray-200 px-4 py-6">
        <Link href="/" className="mb-6 text-xl font-black text-gray-900">
          <span className="font-light">acha</span>dinhos
        </Link>
        <nav className="flex flex-col gap-1 flex-1">
          <Link href="/admin/dashboard" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
            📊 Dashboard
          </Link>
          <Link href="/admin/dashboard/produtos" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
            📦 Produtos
          </Link>
          <Link href="/admin/dashboard/categorias" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
            📂 Categorias
          </Link>
        </nav>
        <AdminLogoutButton />
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}
