import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_token')?.value !== 'ok') {
    redirect('/admin')
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-8 bg-background">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  )
}