import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Progress } from '@/components/ui/progress'
import { Database } from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_token')?.value !== 'ok') {
    redirect('/admin')
  }

  // Valores mockados temporários até conectarmos a API do Supabase real
  const storageUsedMB = 12.5 
  const storageLimitMB = 500
  const storagePercentage = (storageUsedMB / storageLimitMB) * 100
  const isWarning = storagePercentage > 80

  return (
    <div className="flex min-h-screen bg-[#0F0F13] text-foreground transition-colors duration-200">
      <AdminSidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0F0F13]">
        
        {/* TOP BAR: Indicador de Storage do Supabase */}
        <header className="flex-none border-b border-[#2A2A35] bg-[#1A1A24] px-4 sm:px-8 py-4 flex justify-between items-center z-10">
          <h1 className="text-xl font-bold text-white hidden sm:block">
            Dashboard <span className="font-light text-muted-foreground">T-Hex</span>
          </h1>
          
          <div className="flex items-center gap-3 bg-[#0F0F13] border border-[#2A2A35] rounded-full px-4 py-2 w-full sm:w-80 justify-between ml-auto">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Database size={16} className={isWarning ? "text-red-500" : "text-emerald-500"} />
              <span className="hidden sm:inline font-medium">Supabase</span>
            </div>
            <div className="flex items-center gap-3 flex-1 sm:ml-2">
              <Progress 
                value={storagePercentage} 
                className={`h-2 flex-1 ${isWarning ? 'bg-red-500/20 [&>div]:bg-red-500' : 'bg-emerald-500/20 [&>div]:bg-emerald-500'}`}
              />
              <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                {storageUsedMB} / {storageLimitMB}MB
              </span>
            </div>
          </div>
        </header>

        {/* ÁREA DE CONTEÚDO */}
        <div className="flex-1 overflow-auto p-4 sm:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}