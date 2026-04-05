'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useMemo, useRef, useEffect } from 'react'
import data from '@/data/produtos.json'
import { formatarPreco } from '@/lib/produtos'

// Função para remover acentos
const removeAcentos = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [busca, setBusca] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  const slug = pathname?.split('/')[1]
  const categoriaAtual = data.categorias.find(c => c.slug === slug)
  const brandColor = categoriaAtual?.cor || '#22C55E'

  // 1. Extrair e REMOVER DUPLICATAS de todos os produtos
  const todosProdutos = useMemo(() => {
    const all = data.categorias.flatMap(c => 
      // Adicionamos o 'as any[]' para o TypeScript ignorar o fato de estar vazio
      (c.produtos as any[]).map(p => ({ ...p, categoriaSlug: c.slug, categoriaCor: c.cor }))
    )
    
    // Filtro de unicidade: Mantém apenas 1 produto por ID
    const unicos = new Map()
    all.forEach(p => {
      if (!unicos.has(p.id)) {
        unicos.set(p.id, p)
      }
    })
    
    return Array.from(unicos.values())
  }, [])

  // 2. Filtrar produtos baseado no que o usuário digita (mínimo 2 letras)
  const resultadosBusca = useMemo(() => {
    if (busca.trim().length < 2) return []
    // Removemos os acentos do termo da busca
    const termo = removeAcentos(busca.toLowerCase())
    return todosProdutos
      .filter(p => {
        // Removemos acentos do nome e da loja antes de comparar
        const nomeSemAcento = removeAcentos(p.nome.toLowerCase());
        const lojaSemAcento = removeAcentos(p.loja.toLowerCase());
        return nomeSemAcento.includes(termo) || lojaSemAcento.includes(termo);
      })
      .slice(0, 5)
  }, [busca, todosProdutos])

  // 3. Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (busca.trim() && resultadosBusca.length > 0) {
      router.push(`/busca?q=${encodeURIComponent(busca)}`)
      setIsFocused(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1A1A24]/90 backdrop-blur-md border-b border-[#2A2A35]">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 md:px-8">
        
        {/* LOGO DINÂMICO */}
        <Link href="/" className="flex items-center gap-3 shrink-0 transition-transform hover:scale-105">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 drop-shadow-md">
            <Image src="/assets/mascot/icone3.png" alt="T-Hex" fill sizes="86px" className="object-contain" />
          </div>
          <span className="hidden sm:block text-2xl font-black tracking-tight text-white uppercase">
            <span style={{ color: brandColor }} className="transition-colors duration-500">T-HEX</span> INDICA
          </span>
        </Link>

        {/* BARRA DE BUSCA INTELIGENTE */}
        <div className="flex-1 max-w-2xl px-4 md:px-8 relative" ref={searchRef}>
          <form onSubmit={handleSearch} className="relative flex w-full items-center group">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Buscar ofertas, produtos..."
              className="w-full h-11 rounded-full bg-[#0F0F13] border border-[#2A2A35] pl-5 pr-12 py-2 text-sm text-white placeholder-[#A1A1AA] focus:border-[#22C55E] focus:outline-none focus:ring-1 focus:ring-[#22C55E] transition-all"
            />
            <button 
              type="submit" 
              className={`absolute right-4 transition-colors ${resultadosBusca.length > 0 ? 'text-[#22C55E] cursor-pointer' : 'text-[#A1A1AA] cursor-not-allowed opacity-50'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </form>

          {/* DROPDOWN DE PREVIEW */}
          {isFocused && busca.trim().length >= 2 && (
            <div className="absolute top-14 left-4 right-8 bg-[#1A1A24] border border-[#2A2A35] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.6)] overflow-hidden z-50">
              {resultadosBusca.length > 0 ? (
                <ul>
                  {resultadosBusca.map((prod) => (
                    <li key={prod.id}>
                      <a 
                        href={prod.link_afiliado} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-3 hover:bg-[#2A2A35] transition-colors border-b border-[#2A2A35]/50 last:border-0"
                        onClick={() => setIsFocused(false)}
                      >
                        <div className="relative h-12 w-12 rounded-lg bg-[#0F0F13] overflow-hidden shrink-0">
                          {prod.imagem && <Image src={prod.imagem} alt={prod.nome} fill className="object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{prod.nome}</p>
                          <p className="text-xs font-black" style={{ color: prod.categoriaCor }}>{formatarPreco(prod.preco)}</p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-sm text-[#A1A1AA]">
                  Nenhum achadinho encontrado para "<span className="text-white font-bold">{busca}</span>"
                </div>
              )}
            </div>
          )}
        </div>

        {/* ÍCONES DE AÇÃO */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Botão Explorar (Texto no Desktop, Bússola no Mobile) */}
          <Link href="/explorar" className="hidden md:flex items-center gap-2 px-4 h-10 rounded-full font-bold text-sm bg-white/5 text-white hover:bg-[#22C55E] hover:text-[#0F0F13] transition-all">
            Explorar
          </Link>
          <Link href="/explorar" className="md:hidden flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/5 text-[#A1A1AA] hover:text-[#22C55E] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
          </Link>

          <Link href="/sobre" className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/5 text-[#A1A1AA] hover:text-[#22C55E] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          </Link>
        </div>
      </div>
    </header>
  )
}