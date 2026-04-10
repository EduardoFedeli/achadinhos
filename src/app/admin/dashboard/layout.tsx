import AdminSidebar from '@/components/admin/AdminSidebar'
import SupabaseProgressBar from '@/components/admin/SupabaseProgressBar'
import { Toaster } from "@/components/ui/sonner"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0F0F13] text-foreground transition-colors duration-200">
      <AdminSidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0F0F13]">
        
        {/* TOP BAR: Indicador de Storage do Supabase Dinâmico */}
        <header className="flex-none border-b border-[#2A2A35] bg-[#1A1A24] px-4 sm:px-8 py-4 flex justify-between items-center z-10">
          <h1 className="text-xl font-bold text-white hidden sm:block">
            Dashboard <span className="font-light text-muted-foreground">T-Hex</span>
          </h1>
          
          {/* Aqui chamamos o componente inteligente que criamos */}
          <SupabaseProgressBar />
        </header>

        {/* ÁREA DE CONTEÚDO */}
        <div className="flex-1 overflow-auto p-4 sm:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </div>
      </main>
      
      {/* Container global de notificações Sonner */}
      <Toaster theme="dark" richColors position="bottom-right" />
    </div>
  )
}