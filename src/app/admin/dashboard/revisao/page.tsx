'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ExternalLink, Save, CheckCircle2, Bot, Search, PackageSearch, Flame } from 'lucide-react'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface ProdutoRevisao {
  id: string
  nome: string
  linkAfiliado: string
  preco: number
  precoOriginal: number | null
  lojaOrigem: string
  novoPreco?: string 
  novoPrecoOriginal?: string
  salvando?: boolean
}

export default function RevisaoManualPage() {
  const [marketplaces, setMarketplaces] = useState<any[]>([])
  const [filtroLoja, setFiltroLoja] = useState('')
  const [filtroCurva, setFiltroCurva] = useState<'todas' | 'curva_a'>('todas')
  const [produtos, setProdutos] = useState<ProdutoRevisao[]>([])
  const [buscando, setBuscando] = useState(false)
  const [buscaRealizada, setBuscaRealizada] = useState(false)

  useEffect(() => {
    supabase
      .from('marketplaces')
      .select('slug, nome')
      .eq('ativo', true)
      .eq('scraper_ativo', false)
      .then(({ data }) => { if (data) setMarketplaces(data) })
  }, [])

  async function buscarProdutos() {
    if (!filtroLoja) return alert('Selecione uma loja para revisar.')
    
    setBuscando(true)
    setBuscaRealizada(false)

    let query = supabase
      .from('produtos')
      .select('id, nome, linkAfiliado, preco, precoOriginal, lojaOrigem')
      .eq('lojaOrigem', filtroLoja)

    // FILTRO ESTRATÉGICO: Curva A pega apenas produtos que estão em Destaque na Home Page
    if (filtroCurva === 'curva_a') {
      query = query.eq('destaque', true)
    }

    // Ordena pelos mais velhos primeiro, para garantir giro do inventário
    query = query.order('createdAt', { ascending: true })

    const { data: prods, error } = await query

    if (error) {
      console.error('[RADAR MANUAL ERROR]', error)
      alert(`Erro ao buscar: ${error.message}`)
    } else if (prods) {
      setProdutos(prods.map(p => ({ 
        ...p, 
        novoPreco: p.preco ? p.preco.toString() : '',
        novoPrecoOriginal: p.precoOriginal ? p.precoOriginal.toString() : ''
      })))
    }
    
    setBuscando(false)
    setBuscaRealizada(true)
  }

  function handlePriceChange(id: string, field: 'novoPreco' | 'novoPrecoOriginal', value: string) {
    setProdutos(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  async function salvarPreco(id: string) {
    const prod = produtos.find(p => p.id === id)
    if (!prod || !prod.novoPreco) return

    const precoNum = parseFloat(prod.novoPreco.replace(',', '.'))
    const precoOrigNum = prod.novoPrecoOriginal ? parseFloat(prod.novoPrecoOriginal.replace(',', '.')) : null

    if (isNaN(precoNum)) return alert('O Preço Atual é inválido.')
    if (precoOrigNum && precoOrigNum <= precoNum) return alert('O Preço Original deve ser maior que o Preço Atual.')

    let desconto_pct = null
    if (precoOrigNum && precoOrigNum > precoNum) {
      desconto_pct = Math.round((1 - precoNum / precoOrigNum) * 100)
    }

    setProdutos(prev => prev.map(p => p.id === id ? { ...p, salvando: true } : p))

    // CORREÇÃO: Chama a nossa nova API blindada no backend ao invés de atualizar no frontend
    try {
      const res = await fetch('/api/revisao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id, 
          preco: precoNum, 
          precoOriginal: precoOrigNum, 
          desconto_pct 
        })
      })

      if (res.ok) {
        setProdutos(prev => prev.filter(p => p.id !== id))
      } else {
        const errorData = await res.json()
        alert(`Erro ao salvar no banco: ${errorData.error}`)
        setProdutos(prev => prev.map(p => p.id === id ? { ...p, salvando: false } : p))
      }
    } catch (error) {
      alert('Falha de comunicação ao salvar.')
      setProdutos(prev => prev.map(p => p.id === id ? { ...p, salvando: false } : p))
    }
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-20">
      
      {/* HEADER & CONTROLES */}
      <div className="bg-[#1A1A24] p-5 sm:p-6 rounded-2xl border border-[#2A2A35] shadow-lg">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Bot size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Fila de Revisão Manual</h1>
            <p className="text-muted-foreground text-xs mt-0.5">
              Selecione um marketplace bloqueado e o nível de prioridade para atualizar o estoque.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center bg-[#0F0F13] p-3 rounded-xl border border-[#2A2A35] mt-4">
          
          {/* Filtro de Loja */}
          <select
            aria-label="Filtro de loja manual"
            value={filtroLoja}
            onChange={e => setFiltroLoja(e.target.value)}
            className="h-11 rounded-lg border border-[#2A2A35] bg-[#1A1A24] px-4 text-sm text-white font-bold focus:outline-none focus:ring-1 focus:ring-primary uppercase w-full md:w-64"
            disabled={buscando}
          >
            <option value="">Selecione a Loja...</option>
            {marketplaces.map(mk => (
              <option key={mk.slug} value={mk.slug}>{mk.nome.toUpperCase()}</option>
            ))}
          </select>

          {/* Filtro de Curva (Prioridade) */}
          <select
            aria-label="Filtro de Prioridade (Curva)"
            value={filtroCurva}
            onChange={e => setFiltroCurva(e.target.value as 'todas' | 'curva_a')}
            className={`h-11 rounded-lg border px-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-56 transition-colors ${
              filtroCurva === 'curva_a' 
                ? 'bg-[#F97316]/10 border-[#F97316]/50 text-[#F97316]' 
                : 'bg-[#1A1A24] border-[#2A2A35] text-white'
            }`}
            disabled={buscando}
          >
            <option value="todas">Todas as Curvas (Geral)</option>
            <option value="curva_a">🔥 Curva A (Só Destaques)</option>
          </select>

          <Button
            onClick={buscarProdutos}
            disabled={buscando || !filtroLoja}
            className="h-11 bg-primary text-black font-black text-sm hover:bg-primary/80 flex-1 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
          >
            <Search size={16} className={buscando ? 'animate-pulse' : ''} />
            {buscando ? 'Buscando...' : 'Buscar Fila'}
          </Button>
        </div>
      </div>

      {/* EMPTY STATES */}
      {!buscaRealizada && !buscando && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-[#1A1A24] border border-[#2A2A35] flex items-center justify-center">
            <PackageSearch size={28} className="text-gray-600" />
          </div>
          <p className="text-gray-500 text-sm font-bold">Nenhuma fila carregada.</p>
          <p className="text-gray-600 text-xs">Escolha um marketplace e a prioridade para começar a revisão.</p>
        </div>
      )}

      {buscaRealizada && produtos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <CheckCircle2 size={48} className="text-[#22C55E]" />
          <p className="text-white font-black text-xl">Fila Limpa!</p>
          <p className="text-gray-500 text-sm">Não há produtos pendentes para esta seleção.</p>
        </div>
      )}

      {/* TABELA DE OPERAÇÃO MANUAL */}
      {produtos.length > 0 && (
        <div className="bg-[#1A1A24] border border-[#2A2A35] rounded-xl overflow-x-auto shadow-lg">
          <div className="p-4 border-b border-[#2A2A35] bg-[#0F0F13] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-black text-white uppercase tracking-widest">
                Lote: <span className="text-primary">{filtroLoja}</span>
              </h2>
              {filtroCurva === 'curva_a' && (
                <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-[#F97316]/20 text-[#F97316] px-2 py-0.5 rounded border border-[#F97316]/30">
                  <Flame size={12} /> Alta Prioridade
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500 font-bold bg-[#1A1A24] px-2 py-1 rounded border border-[#2A2A35]">
              {produtos.length} pendentes
            </span>
          </div>
          
          <table className="w-full text-sm text-left text-gray-300 min-w-[900px]">
            <thead className="text-[10px] uppercase bg-[#0F0F13] text-gray-500 font-black tracking-widest border-b border-[#2A2A35]">
              <tr>
                <th className="px-5 py-4">Produto</th>
                <th className="px-5 py-4 text-right">Banco Atual</th>
                <th className="px-5 py-4 text-center">Auditoria</th>
                <th className="px-5 py-4 w-32">Novo Preço (R$)</th>
                <th className="px-5 py-4 w-32">Preço Orig. (R$)</th>
                <th className="px-5 py-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map(prod => (
                <tr key={prod.id} className="border-b border-[#2A2A35] hover:bg-white/5 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-bold text-white text-xs line-clamp-2 max-w-md" title={prod.nome}>{prod.nome}</p>
                  </td>
                  
                  <td className="px-5 py-3 text-right font-mono">
                    <div className="flex flex-col items-end">
                      <span className="text-[#22C55E] font-bold text-xs">R$ {prod.preco.toFixed(2)}</span>
                      {prod.precoOriginal && (
                        <span className="text-[#8E8E9F] text-[10px] line-through">R$ {prod.precoOriginal.toFixed(2)}</span>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-3 text-center">
                    <a 
                      href={prod.linkAfiliado} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6]/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
                    >
                      Abrir Link <ExternalLink size={12} />
                    </a>
                  </td>

                  <td className="px-5 py-3">
                    <Input 
                      type="number" 
                      step="0.01"
                      value={prod.novoPreco}
                      onChange={e => handlePriceChange(prod.id, 'novoPreco', e.target.value)}
                      className="w-full h-8 bg-[#0F0F13] border-[#2A2A35] text-primary font-bold focus:border-primary"
                    />
                  </td>

                  <td className="px-5 py-3">
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="Opcional"
                      value={prod.novoPrecoOriginal}
                      onChange={e => handlePriceChange(prod.id, 'novoPrecoOriginal', e.target.value)}
                      className="w-full h-8 bg-[#0F0F13] border-[#2A2A35] text-[#8E8E9F]"
                    />
                  </td>

                  <td className="px-5 py-3 text-right">
                    <Button 
                      onClick={() => salvarPreco(prod.id)}
                      disabled={prod.salvando}
                      size="sm"
                      className="h-8 bg-[#22C55E] text-black font-black text-xs hover:bg-[#22C55E]/80 disabled:opacity-50"
                    >
                      {prod.salvando ? '...' : <><Save size={14} className="mr-1" /> Salvar</>}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}