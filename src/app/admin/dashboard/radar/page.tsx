'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { AlertCircle, TrendingDown, TrendingUp, Minus, Search, Trash2, Save } from 'lucide-react'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface ProdutoRadar {
  id: string
  nome: string
  loja: string
  link_afiliado: string
  preco_banco: number
  preco_novo: number | null
  status: 'aguardando' | 'farejando' | 'sucesso' | 'erro'
}

export default function RadarPage() {
  const [marketplaces, setMarketplaces] = useState<any[]>([])
  const [filtroLoja, setFiltroLoja] = useState('')
  
  const [resultados, setResultados] = useState<ProdutoRadar[]>([])
  const [varrendo, setVarrendo] = useState(false)
  const [salvando, setSalvando] = useState(false)

  // Carrega apenas o dropdown de lojas ao abrir a tela
  useEffect(() => {
    supabase.from('marketplaces').select('slug, nome').eq('ativo', true).then(({ data }) => {
      if (data) setMarketplaces(data)
    })
  }, [])

  // --- PASSO 1: INICIAR A VARREDURA ---
  async function iniciarVarredura() {
    setVarrendo(true)
    setResultados([]) // Limpa a tela para a nova busca

    // 1. Busca os produtos no banco de acordo com a loja escolhida
    let query = supabase.from('produtos').select('id, nome, loja, link_afiliado, preco')
    if (filtroLoja) query = query.eq('loja', filtroLoja)
    
    const { data: prods } = await query

    if (!prods || prods.length === 0) {
      alert("Nenhum produto encontrado para esta seleção.")
      setVarrendo(false)
      return
    }

    // 2. Coloca os produtos na tela com status 'aguardando'
    const listaInicial: ProdutoRadar[] = prods.map(p => ({
      id: p.id, nome: p.nome, loja: p.loja, link_afiliado: p.link_afiliado,
      preco_banco: p.preco, preco_novo: null, status: 'aguardando'
    }))
    setResultados(listaInicial)

    // 3. O Robô começa a trabalhar um por um (para não travar a Amazon)
    for (const prod of listaInicial) {
      atualizarLinha(prod.id, { status: 'farejando' })

      try {
        const res = await fetch('/api/scraper', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: prod.link_afiliado })
        })
        const data = await res.json()

        if (res.ok && data.preco) {
          atualizarLinha(prod.id, { preco_novo: data.preco, status: 'sucesso' })
        } else {
          atualizarLinha(prod.id, { status: 'erro' })
        }
      } catch (error) {
        atualizarLinha(prod.id, { status: 'erro' })
      }
    }
    
    setVarrendo(false)
  }

  function atualizarLinha(id: string, updates: Partial<ProdutoRadar>) {
    setResultados(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  // --- PASSO 2: SALVAR TODOS OS PREÇOS NOVOS ---
  async function salvarTodos() {
    // Filtra apenas os que deram sucesso e o preço NOVO é DIFERENTE do antigo
    const paraSalvar = resultados.filter(p => p.status === 'sucesso' && p.preco_novo !== null && p.preco_novo !== p.preco_banco)
    
    if (paraSalvar.length === 0) {
      alert("Não há novos preços diferentes para salvar.")
      return
    }

    setSalvando(true)
    const payload = paraSalvar.map(p => ({ id: p.id, preco: p.preco_novo }))

    const res = await fetch('/api/radar', {
      method: 'POST',
      body: JSON.stringify({ action: 'update_prices', payload })
    })

    if (res.ok) {
      // Atualiza a tela para mostrar que o preço do banco agora é o novo preço
      setResultados(prev => prev.map(p => {
        if (paraSalvar.some(salvo => salvo.id === p.id)) {
          return { ...p, preco_banco: p.preco_novo as number, status: 'aguardando' }
        }
        return p
      }))
      alert(`${paraSalvar.length} preços atualizados com sucesso! (A data de cadastro foi mantida intacta)`)
    } else {
      alert("Erro ao salvar no banco de dados.")
    }
    setSalvando(false)
  }

  // --- PASSO 3: EXCLUIR PRODUTO DIRETO DO RADAR ---
  async function excluirProduto(id: string, nome: string) {
    if (!confirm(`Deseja excluir permanentemente o produto "${nome}"?`)) return

    const res = await fetch('/api/radar', {
      method: 'POST',
      body: JSON.stringify({ action: 'delete_product', id })
    })

    if (res.ok) {
      setResultados(prev => prev.filter(p => p.id !== id))
    } else {
      alert("Erro ao excluir o produto.")
    }
  }

  // --- RENDERIZAÇÃO DA COR DO PREÇO ---
  const renderPrecoNovo = (prod: ProdutoRadar) => {
    if (prod.status === 'aguardando') return <span className="text-gray-600 text-xs">—</span>
    if (prod.status === 'farejando') return <span className="text-primary animate-pulse text-xs font-bold">Farejando...</span>
    if (prod.status === 'erro') return <span className="text-red-500 text-xs flex items-center justify-end gap-1"><AlertCircle size={12}/> Erro/Indisponível</span>

    const subiu = prod.preco_novo! > prod.preco_banco
    const desceu = prod.preco_novo! < prod.preco_banco

    return (
      <div className={`flex items-center justify-end gap-1.5 font-black text-sm ${subiu ? 'text-red-500' : desceu ? 'text-[#22C55E]' : 'text-gray-400'}`}>
        {subiu ? <TrendingUp size={14} /> : desceu ? <TrendingDown size={14} /> : <Minus size={14} />}
        R$ {prod.preco_novo!.toFixed(2).replace('.', ',')}
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-20">
      
      <div className="flex flex-col bg-[#1A1A24] p-6 rounded-2xl border border-[#2A2A35] shadow-lg gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🦖</span>
            <h1 className="text-3xl font-black text-white tracking-tight">Radar de Ofertas</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1">Selecione o alvo e inicie a varredura para identificar mudanças de preço.</p>
        </div>

        {/* CONTROLES DE VARREDURA */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-[#0F0F13] p-3 rounded-xl border border-[#2A2A35]">
          <select
            value={filtroLoja}
            onChange={e => setFiltroLoja(e.target.value)}
            className="h-12 rounded-lg border border-[#2A2A35] bg-[#1A1A24] px-4 text-sm text-white font-bold focus:outline-none uppercase w-full sm:w-64"
            disabled={varrendo}
          >
            <option value="">🚀 TODAS AS LOJAS</option>
            {marketplaces.map(mk => <option key={mk.slug} value={mk.slug}>{mk.nome.toUpperCase()}</option>)}
          </select>
          
          <Button 
            onClick={iniciarVarredura} 
            disabled={varrendo}
            className="h-12 bg-primary text-black font-black text-sm hover:bg-primary/80 flex-1 flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
          >
            <Search size={18} className={varrendo ? "animate-pulse" : ""} /> 
            {varrendo ? 'Varredura em andamento...' : 'Iniciar Varredura'}
          </Button>
        </div>
      </div>

      {/* RESULTADOS DA VARREDURA (Só aparece se tiver resultado) */}
      {resultados.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white">Resultados da Análise ({resultados.length})</h2>
            <Button 
              onClick={salvarTodos} 
              disabled={salvando || varrendo}
              className="bg-blue-600 text-white font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg"
            >
              <Save size={16} /> 
              {salvando ? 'Salvando...' : 'Atualizar Preços Modificados'}
            </Button>
          </div>

          <div className="bg-[#1A1A24] border border-[#2A2A35] rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-[10px] uppercase bg-[#0F0F13] text-gray-500 border-b border-[#2A2A35] font-black tracking-widest">
                  <tr>
                    <th className="px-5 py-4">Produto</th>
                    <th className="px-5 py-4 text-center">Status</th>
                    <th className="px-5 py-4 text-right">Preço Banco</th>
                    <th className="px-5 py-4 text-right bg-primary/5">Preço Loja</th>
                    <th className="px-5 py-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map(prod => (
                    <tr key={prod.id} className="border-b border-[#2A2A35] hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex flex-col min-w-0 max-w-sm">
                          <a href={prod.link_afiliado} target="_blank" rel="noreferrer" className="font-bold text-white hover:text-primary truncate">
                            {prod.nome}
                          </a>
                          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-1 w-fit bg-[#0F0F13] px-2 py-0.5 rounded border border-[#2A2A35]">
                            {prod.loja}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        {prod.status === 'aguardando' && <span className="w-2 h-2 rounded-full bg-gray-600 inline-block" title="Aguardando" />}
                        {prod.status === 'farejando' && <span className="w-2 h-2 rounded-full bg-primary animate-ping inline-block" title="Buscando" />}
                        {prod.status === 'sucesso' && <span className="w-2 h-2 rounded-full bg-[#22C55E] inline-block shadow-[0_0_10px_rgba(34,197,94,0.8)]" title="Sucesso" />}
                        {prod.status === 'erro' && <span className="w-2 h-2 rounded-full bg-red-500 inline-block shadow-[0_0_10px_rgba(239,68,68,0.8)]" title="Erro" />}
                      </td>
                      <td className="px-5 py-4 text-right font-mono text-gray-400 text-sm">
                        R$ {prod.preco_banco.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="px-5 py-4 text-right bg-primary/5">
                        {renderPrecoNovo(prod)}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button 
                          onClick={() => excluirProduto(prod.id, prod.nome)}
                          className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                          title="Excluir produto do banco de dados"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}