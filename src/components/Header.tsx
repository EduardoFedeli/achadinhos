'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import data from '@/data/produtos.json'

export default function Header() {
  const pathname = usePathname()
  
  // Extrai a categoria da URL (ex: de "/pets" pega "pets")
  const slug = pathname?.split('/')[1]
  const categoriaAtual = data.categorias.find(c => c.slug === slug)
  
  // Define a cor: Se estiver numa categoria, usa a cor dela. Se não (ex: Home), usa o verde principal.
  const brandColor = categoriaAtual?.cor || '#22C55E'

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1A1A24]/90 backdrop-blur-md border-b border-[#2A2A35]">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 md:px-8">
        
        {/* LOGO DINÂMICO (Ícone + Texto) */}
        <Link href="/" className="flex items-center gap-3 shrink-0 transition-transform hover:scale-105">
          {/* Emblema (Cabeça do Mascote) */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 drop-shadow-md">
            {/* ATENÇÃO: Ajuste para o nome exato do seu arquivo na pasta public */}
            <Image 
              src="/assets/mascot/Icone3.png" 
              alt="T-Hex" 
              fill 
              sizes="86px"
              className="object-contain" 
            />
          </div>
          
          {/* Texto Tipográfico (Oculto no mobile apertado, visível do sm em diante) */}
          <span className="hidden sm:block text-2xl font-black tracking-tight text-white uppercase">
            <span style={{ color: brandColor }} className="transition-colors duration-500">
              T-HEX
            </span>{' '}
            INDICA
          </span>
        </Link>

        {/* BARRA DE BUSCA */}
        <div className="flex-1 max-w-2xl px-4 md:px-8">
          <div className="relative flex w-full items-center group">
            <input
              type="text"
              placeholder="Buscar ofertas, produtos, categorias..."
              className="w-full h-11 rounded-full bg-[#0F0F13] border border-[#2A2A35] pl-5 pr-12 py-2 text-sm text-white placeholder-[#A1A1AA] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E] transition-all"
            />
            <div className="absolute right-4 text-[#A1A1AA] group-focus-within:text-[#22C55E] transition-colors pointer-events-none">
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
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/5 text-[#A1A1AA] hover:text-[#22C55E] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </Link>
          
          <button className="md:hidden flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/5 text-white hover:text-[#22C55E]">
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