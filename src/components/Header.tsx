'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useMemo, useRef, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { formatarPreco } from '@/lib/produtos'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const removeAcentos = (str: string) => {
  if (!str) return ""
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export default function Header() {
  const [busca, setBusca] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [todosProdutos, setTodosProdutos] = useState<any[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.from('produtos').select('*').then(({ data, error }) => {
      if (error) console.error("Erro ao carregar produtos:", error)
      else if (data) setTodosProdutos(data)
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

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1A1A24]/90 backdrop-blur-md border-b border-[#2A2A35] transition-colors duration-500">
      <div className="mx-auto flex h-20 w-full max-w-[1600px] items-center justify-between px-3 md:px-8 gap-3 md:gap-4">
        
        <Link href="/" className="flex items-center gap-2 md:gap-3 shrink-0 transition-transform hover:scale-105 group">
          <div className="relative w-10 h-10 sm:w-14 sm:h-14 drop-shadow-md">
            <Image src="/assets/mascot/icone3.png" alt="Logo" fill className="object-contain" />
          </div>
          <span className="hidden lg:block text-2xl font-black text-white uppercase tracking-tighter">
            <span style={{ color: 'var(--brand-color, #22C55E)' }} className="transition-colors duration-500">T-HEX</span> INDICA
          </span>
        </Link>

        <div className="flex-1 max-w-xl relative" ref={searchRef}>
          <div className="relative group">
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Buscar ofertas..."
              className="w-full h-10 md:h-11 rounded-full bg-[#0F0F13] border border-[#2A2A35] pl-4 md:pl-5 pr-10 md:pr-12 text-xs md:text-sm text-white focus:outline-none transition-all duration-300"
              style={{
                borderColor: isFocused ? 'var(--brand-color, #22C55E)' : '#2A2A35'
              }}
            />
            <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="md:w-[18px] md:h-[18px]"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>

          {isFocused && busca.trim().length >= 2 && (
            <div className="absolute top-12 md:top-14 left-0 right-0 bg-[#1A1A24] border border-[#2A2A35] rounded-2xl shadow-2xl overflow-hidden z-50">
              {resultadosBusca.length > 0 ? (
                <ul>
                  {resultadosBusca.map((prod) => {
                    const imgUrl = prod.imagem_url || prod.imagemUrl || prod.imagem || ''
                    const linkAfiliado = prod.link_afiliado || prod.linkAfiliado || '#'

                    return (
                      <li key={prod.id}>
                        <a href={linkAfiliado} target="_blank" rel="noreferrer" className="flex items-center gap-3 md:gap-4 p-3 hover:bg-[#2A2A35] border-b border-[#2A2A35]/50 last:border-0 group/item">
                          {imgUrl && (
                            <img src={imgUrl} alt={prod.nome} className="h-8 w-8 md:h-10 md:w-10 rounded bg-white object-contain shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="text-xs md:text-sm font-bold text-white truncate">{prod.nome}</p>
                            <p className="text-[10px] md:text-xs font-black transition-colors" style={{ color: 'var(--brand-color, #22C55E)' }}>{formatarPreco(prod.preco)}</p>
                          </div>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="p-4 text-center text-xs text-gray-500 font-bold uppercase tracking-widest">
                  Nenhum achadinho encontrado
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* CORREÇÃO UX MOBILE: Removido o hidden, ajustado padding e text-size no mobile */}
          <Link 
            href="/explorar" 
            className="flex px-3 md:px-5 h-9 md:h-10 items-center rounded-full bg-white/5 text-white font-bold text-[10px] md:text-xs uppercase transition-all hover:text-[#0F0F13] whitespace-nowrap"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--brand-color').trim() || '#22C55E'
              e.currentTarget.style.color = '#0F0F13'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
              e.currentTarget.style.color = 'white'
            }}
          >
            Explorar
          </Link>
          <Link href="/sobre" className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full hover:bg-white/5 text-[#A1A1AA] transition-colors shrink-0"
             onMouseEnter={(e) => e.currentTarget.style.color = getComputedStyle(document.documentElement).getPropertyValue('--brand-color').trim() || '#22C55E'}
             onMouseLeave={(e) => e.currentTarget.style.color = '#A1A1AA'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-[22px] md:h-[22px]"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          </Link>
        </div>
      </div>
    </header>
  )
}