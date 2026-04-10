'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useMemo, useRef, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { formatarPreco } from '@/lib/produtos'
import type { Categoria } from '@/types'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const removeAcentos = (str: string) => {
  if (!str) return ""
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

interface CategoriaComImagem extends Categoria {
  imagem_url?: string
}

export default function Header() {
  const [busca, setBusca] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [todosProdutos, setTodosProdutos] = useState<any[]>([])
  const [categoriasMenu, setCategoriasMenu] = useState<CategoriaComImagem[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.from('produtos').select('*').then(({ data, error }) => {
      if (error) console.error("Erro ao carregar produtos:", error)
      else if (data) setTodosProdutos(data)
    })

    supabase.from('categorias').select('*').then(({ data, error }) => {
      if (!error && data) {
        setCategoriasMenu(data.sort((a, b) => a.nome.localeCompare(b.nome)))
      }
    })
  }, [])

  useEffect(() => {
    const clickOut = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setIsFocused(false)
    }
    document.addEventListener("mousedown", clickOut)
    return () => document.removeEventListener("mousedown", clickOut)
  }, [])

  const resultadosBusca = useMemo(() => {
    if (busca.trim().length < 2) return []
    const termosDigitados = removeAcentos(busca).split(' ').filter(Boolean)
    return todosProdutos
      .filter(p => {
        const nomeNorm = removeAcentos(p.nome)
        const lojaNorm = removeAcentos(p.lojaOrigem || p.loja || '')
        const tagsNorm = Array.isArray(p.tags) ? p.tags.map((t: string) => removeAcentos(t)).join(' ') : ''
        const textoCompletoDoProduto = `${nomeNorm} ${lojaNorm} ${tagsNorm}`
        return termosDigitados.every(termo => textoCompletoDoProduto.includes(termo))
      })
      .slice(0, 6)
  }, [busca, todosProdutos])

  // Gerador de CSS dinâmico (Mata os avisos de inline styles)
  const dynamicStyles = `
    .nav-underline { background-color: var(--brand-color, #22C55E); }
    .search-border:focus-within { border-color: var(--brand-color, #22C55E) !important; }
    .btn-mobile-cat:hover { background-color: var(--brand-color, #22C55E) !important; color: #0F0F13 !important; border-color: transparent !important; }
    ${categoriasMenu.map(cat => `
      .cat-theme-${cat.slug} { --cat-color: ${cat.cor}; --cat-color-bg: ${cat.cor}15; }
    `).join('\n')}
  `

  const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Link href={href} className="relative py-2 text-[13px] font-bold text-[#A1A1AA] hover:text-white transition-colors uppercase tracking-wider group">
      {children}
      <span className="nav-underline absolute left-0 bottom-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full"></span>
    </Link>
  )

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1A1A24]/90 backdrop-blur-md border-b border-[#2A2A35] transition-colors duration-500">
      <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />
      
      <div className="mx-auto flex h-20 w-full max-w-[1600px] items-center justify-between px-4 md:px-8 gap-4 md:gap-8">
        
        <div className="shrink-0">
          <Link href="/" className="flex items-center gap-2 md:gap-3 transition-transform hover:scale-105 group">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 drop-shadow-md">
              <Image src="/assets/mascot/icone3.png" alt="T-Hex Mascote" fill sizes="(max-width: 768px) 100px, 150px" className="object-contain" />
            </div>
            <span className="hidden xl:block text-2xl font-black text-white uppercase tracking-tighter">
              {/* Uso direto da variável via Tailwind = Fim do erro! */}
              <span className="transition-colors duration-500 text-[var(--brand-color,#22C55E)]">T-HEX</span> INDICA
            </span>
          </Link>
        </div>

        <div className="flex-1 w-full max-w-3xl relative" ref={searchRef}>
          <div className="relative group w-full search-border border border-[#2A2A35] rounded-full bg-[#0F0F13] transition-all duration-300">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Buscar ofertas, lojas ou produtos..."
              className="w-full h-10 md:h-12 bg-transparent pl-5 pr-12 text-sm text-white focus:outline-none"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>

          {isFocused && busca.trim().length >= 2 && (
            <div className="absolute top-14 left-0 right-0 bg-[#1A1A24] border border-[#2A2A35] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {resultadosBusca.length > 0 ? (
                <ul>
                  {resultadosBusca.map((prod) => {
                    const imgUrl = prod.imagem_url || prod.imagemUrl || prod.imagem || ''
                    const linkAfiliado = prod.link_afiliado || prod.linkAfiliado || '#'
                    return (
                      <li key={prod.id}>
                        <a href={linkAfiliado} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-3 hover:bg-[#2A2A35] border-b border-[#2A2A35]/50 last:border-0 group/item">
                          {imgUrl && <img src={imgUrl} alt={prod.nome} className="h-10 w-10 rounded bg-white object-contain shrink-0" />}
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">{prod.nome}</p>
                            <p className="text-xs font-black transition-colors text-[var(--brand-color,#22C55E)]">{formatarPreco(prod.preco)}</p>
                          </div>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="p-4 text-center text-xs text-[#A1A1AA] font-bold uppercase tracking-widest">Nenhum achadinho encontrado</div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center shrink-0">
          <nav className="hidden lg:flex items-center gap-6">
            <NavLink href="/mais-vendidos">Mais Vendidos</NavLink>
            <NavLink href="/novidades">Novidades</NavLink>
            
            <div 
              className="relative h-20 flex items-center"
              onMouseEnter={() => setIsMenuOpen(true)}
              onMouseLeave={() => setIsMenuOpen(false)}
            >
              <button type="button" className="relative py-2 text-[13px] font-bold text-[#A1A1AA] hover:text-white transition-colors uppercase tracking-wider group flex items-center gap-1.5">
                Categorias
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-180 text-white' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
                <span className={`nav-underline absolute left-0 bottom-0 h-[2px] transition-all duration-300 ${isMenuOpen ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </button>

              {isMenuOpen && categoriasMenu.length > 0 && (
                <div className="absolute top-[70px] right-0 w-[560px] bg-[#1A1A24] border border-[#2A2A35] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-5 flex flex-col z-50 animate-in fade-in zoom-in-95 duration-200">
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {categoriasMenu.map(cat => (
                      <Link 
                        key={cat.slug} 
                        href={`/${cat.slug}`}
                        className={`cat-theme-${cat.slug} flex items-center gap-4 p-3 rounded-2xl hover:bg-[#2A2A35] transition-all duration-300 group/cat`}
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-[#2A2A35] group-hover/cat:border-transparent group-hover/cat:scale-110 transition-all bg-[var(--cat-color-bg)]">
                          {cat.imagem_url ? (
                            <img src={cat.imagem_url} alt={cat.nome} className="w-6 h-6 object-contain filter drop-shadow-md" />
                          ) : (
                            <span className="text-xl">{cat.emoji}</span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-white uppercase tracking-widest group-hover/cat:text-[var(--cat-color)] transition-colors">
                          {cat.nome}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#2A2A35] mt-2">
                    <Link href="/categorias" className="flex items-center justify-center w-full py-3 rounded-xl bg-[#22C55E]/10 text-[var(--brand-color,#22C55E)] text-[11px] font-black uppercase tracking-widest hover:bg-[var(--brand-color,#22C55E)] hover:text-[#0F0F13] transition-all">
                      Ver Todas as Categorias →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <NavLink href="/sobre">Sobre</NavLink>
            <NavLink href="/explorar">Explorar</NavLink>
          </nav>

          <Link 
            href="/categorias" 
            className="btn-mobile-cat flex lg:hidden px-4 md:px-6 h-10 items-center justify-center rounded-full bg-white/5 border border-[#2A2A35] text-white font-black text-[10px] md:text-xs uppercase transition-all active:scale-95 ml-2"
          >
            Categorias
          </Link>
        </div>

      </div>
    </header>
  )
}