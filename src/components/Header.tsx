import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#1A1A24]/90 backdrop-blur-md border-b border-[#2A2A35]">
      {/* CORREÇÃO UX/UI: w-full max-w-7xl e mx-auto adicionados.
        Garante o alinhamento perfeito do Logo com a linha esquerda do conteúdo principal.
      */}
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 md:px-8">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center text-white font-bold">
            T
          </div>
          <span className="text-xl font-black tracking-tight text-white hidden sm:block">
            T-Hex Indica
          </span>
        </Link>

        {/* BARRA DE BUSCA */}
        <div className="flex-1 max-w-2xl px-4 md:px-8">
          <div className="relative flex w-full items-center">
            <input
              type="text"
              placeholder="Buscar ofertas, produtos, categorias..."
              className="w-full h-10 rounded-full bg-[#0F0F13] border border-[#2A2A35] pl-4 pr-10 py-2 text-sm text-white placeholder-[#A1A1AA] focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
            />
            <div className="absolute right-3 text-[#A1A1AA] pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
        </div>

        {/* ÍCONES DE AÇÃO */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/sobre"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/5 text-[#A1A1AA] hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </Link>
          
          <button className="md:hidden flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/5 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}