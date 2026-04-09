'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  AlertCircle, TrendingDown, TrendingUp, Minus,
  Search, Trash2, Save, RefreshCw, Radar,
  CheckCircle2, PackageSearch
} from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type StatusRadar = 'aguardando' | 'farejando' | 'sucesso' | 'igual' | 'erro'

interface ProdutoRadar {
  id: string
  nome: string
  loja: string
  link_afiliado: string
  preco_banco: number
  updatedAt?: string
  preco_novo: number | null
  status: StatusRadar
}

/** Delay aleatório entre 2s e 5s para evitar Rate Limit e Bloqueios */
function sleepAleatorio() {
  const ms = Math.floor(Math.random() * 3000) + 2000
  return new Promise(resolve => setTimeout(resolve, ms))
}

function formatarPreco(valor: number) {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`
}

function tempoDesdeAtualizacao(dateStr?: string): string {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (dias === 0) return 'Atualizado hoje'
  if (dias === 1) return 'Atualizado há 1 dia'
  return `Atualizado há ${dias} dias`
}

export default function RadarPage() {
  const [marketplaces, setMarketplaces] = useState<any[]>([])
  const [filtroLoja, setFiltroLoja] = useState('')
  const [resultados, setResultados] = useState<ProdutoRadar[]>([])
  const [varrendo, setVarrendo] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [varreduraConcluida, setVarreduraConcluida] = useState(false)
  const [mostrarSoAlteracoes, setMostrarSoAlteracoes] = useState(false)

  useEffect(() => {
    // 👇 ALTERAÇÃO 1: O menu dropdown agora SÓ mostra marketplaces que permitem o scraper
    supabase
      .from('marketplaces')
      .select('slug, nome')
      .eq('ativo', true)
      .eq('scraper_ativo', true) 
      .then(({ data }) => { if (data) setMarketplaces(data) })
  }, [])

  function atualizarLinha(id: string, updates: Partial<ProdutoRadar>) {
    setResultados(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }

  const rasparProduto = useCallback(async (prod: ProdutoRadar) => {
    atualizarLinha(prod.id, { status: 'farejando' })

    try {
      const res = await fetch('/api/scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: prod.link_afiliado }),
      })

      const data = await res.json()

      if (res.ok && data.preco && data.preco > 0) {
        if (data.preco !== prod.preco_banco) {
          atualizarLinha(prod.id, { preco_novo: data.preco, status: 'sucesso' })
        } else {
          atualizarLinha(prod.id, { preco_novo: data.preco, status: 'igual' })
        }
      } else {
        atualizarLinha(prod.id, { status: 'erro' })
      }
    } catch {
      atualizarLinha(prod.id, { status: 'erro' })
    }
  }, [])

  async function iniciarVarredura() {
    setVarrendo(true)
    setVarreduraConcluida(false)
    setResultados([])
    setMostrarSoAlteracoes(false)

    // 👇 ALTERAÇÃO 2: Puxa primeiro a lista de lojas permitidas do banco
    const { data: mktsPermitidos } = await supabase
      .from('marketplaces')
      .select('slug')
      .eq('scraper_ativo', true)

    if (!mktsPermitidos || mktsPermitidos.length === 0) {
      alert('Nenhum marketplace permite varredura automática no momento.')
      setVarrendo(false)
      return
    }
    
    // Transforma num array de strings (ex: ['amazon', 'magalu'])
    const slugsPermitidos = mktsPermitidos.map(m => m.slug)

    // 👇 ALTERAÇÃO 3: Filtra os produtos exigindo que a lojaOrigem esteja na lista de permitidos
    let query = supabase
      .from('produtos')
      .select('id, nome, lojaOrigem, linkAfiliado, preco, createdAt')
      .in('lojaOrigem', slugsPermitidos) 
    
    if (filtroLoja) query = query.eq('lojaOrigem', filtroLoja)

    const { data: prods, error } = await query

    if (error) {
      console.error('[RADAR DB ERROR]', error)
      alert(`Erro no banco de dados: ${error.message}\nVerifique o console.`)
      setVarrendo(false)
      return
    }

    if (!prods || prods.length === 0) {
      alert('Nenhum produto automático encontrado no banco para esta seleção.')
      setVarrendo(false)
      return
    }

    const listaInicial: ProdutoRadar[] = prods.map(p => ({
      id: p.id,
      nome: p.nome,
      loja: p.lojaOrigem || 'Desconhecida',
      link_afiliado: p.linkAfiliado || '',
      preco_banco: p.preco,
      updatedAt: p.createdAt, 
      preco_novo: null,
      status: 'aguardando',
    }))

    setResultados(listaInicial)

    for (const prod of listaInicial) {
      await rasparProduto(prod)
      await sleepAleatorio()
    }

    setVarrendo(false)
    setVarreduraConcluida(true)
  }

  async function salvarTodos() {
    const paraSalvar = resultados.filter(
      p => p.status === 'sucesso' && p.preco_novo !== null && p.preco_novo !== p.preco_banco
    )
    if (paraSalvar.length === 0) return

    setSalvando(true)
    const payload = paraSalvar.map(p => ({ id: p.id, preco: p.preco_novo }))

    try {
      const res = await fetch('/api/radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_prices', payload }),
      })

      if (res.ok) {
        setResultados(prev =>
          prev.map(p => {
            if (paraSalvar.some(s => s.id === p.id)) {
              return { ...p, preco_banco: p.preco_novo as number, preco_novo: null, status: 'igual' }
            }
            return p
          })
        )
      } else {
        alert('Erro ao salvar no banco de dados.')
      }
    } catch {
      alert('Falha de comunicação ao salvar.')
    } finally {
      setSalvando(false)
    }
  }

  async function excluirProduto(id: string, nome: string) {
    if (!confirm(`Deseja excluir permanentemente "${nome}"?`)) return

    const res = await fetch('/api/radar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_product', id }),
    })

    if (res.ok) {
      setResultados(prev => prev.filter(p => p.id !== id))
    } else {
      alert('Erro ao excluir o produto.')
    }
  }

  const qtdSucesso = resultados.filter(p => p.status === 'sucesso').length
  const qtdErro = resultados.filter(p => p.status === 'erro').length
  const qtdIgual = resultados.filter(p => p.status === 'igual').length
  const qtdFarejando = resultados.filter(p => p.status === 'farejando' || p.status === 'aguardando').length

  const resultadosFiltrados = mostrarSoAlteracoes
    ? resultados.filter(p => p.status === 'sucesso' || p.status === 'erro' || p.status === 'farejando')
    : resultados

  const varreduraTerminou = varreduraConcluida && !varrendo
  const tudoIgualSemErro = varreduraTerminou && qtdSucesso === 0 && qtdErro === 0

  function renderCelulaNovo(prod: ProdutoRadar) {
    if (prod.status === 'aguardando') return <span className="text-gray-600 text-xs">—</span>

    if (prod.status === 'farejando') {
      return (
        <span className="text-primary animate-pulse text-xs font-bold tracking-wider">
          Farejando...
        </span>
      )
    }

    if (prod.status === 'erro') {
      return (
        <span className="text-red-400 text-xs flex items-center justify-end gap-1.5">
          <AlertCircle size={12} /> Erro/Indisponível
        </span>
      )
    }

    if (prod.status === 'igual') {
      return <span className="text-gray-500 text-xs">= Sem mudança</span>
    }

    const subiu = prod.preco_novo! > prod.preco_banco
    const desceu = prod.preco_novo! < prod.preco_banco
    const variacaoPct = Math.round(Math.abs((prod.preco_novo! - prod.preco_banco) / prod.preco_banco) * 100)
    const ehOportunidade = desceu && variacaoPct >= 5

    return (
      <div className="flex items-center justify-end gap-2">
        {ehOportunidade && (
          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 tracking-widest whitespace-nowrap">
            -{variacaoPct}% OFF
          </span>
        )}
        <span className={`flex items-center gap-1.5 font-black text-sm ${subiu ? 'text-red-400' : desceu ? 'text-[#22C55E]' : 'text-gray-400'}`}>
          {subiu ? <TrendingUp size={14} /> : desceu ? <TrendingDown size={14} /> : <Minus size={14} />}
          {formatarPreco(prod.preco_novo!)}
        </span>
      </div>
    )
  }

  function getRowStyle(prod: ProdutoRadar): string {
    const base = 'border-b border-[#2A2A35] transition-all duration-300'
    if (prod.status === 'farejando') return `${base} bg-primary/5`
    if (prod.status === 'sucesso') {
      const desceu = prod.preco_novo! < prod.preco_banco
      const subiu = prod.preco_novo! > prod.preco_banco
      if (desceu) return `${base} bg-[#22C55E]/5 shadow-[inset_3px_0_0_#22C55E] hover:bg-[#22C55E]/10`
      if (subiu) return `${base} bg-red-500/5 shadow-[inset_3px_0_0_rgba(239,68,68,0.5)] hover:bg-red-500/10`
    }
    if (prod.status === 'erro') return `${base} hover:bg-red-500/5`
    return `${base} hover:bg-white/3`
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-20">

      {/* HEADER */}
      <div className="bg-[#1A1A24] p-5 sm:p-6 rounded-2xl border border-[#2A2A35] shadow-lg">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Radar size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Radar Automático</h1>
            <p className="text-muted-foreground text-xs mt-0.5">
              Selecione o alvo e inicie a varredura. Exibindo apenas marketplaces configurados com Scraper Ativo.
            </p>
          </div>
        </div>

        {/* CONTROLES */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-[#0F0F13] p-3 rounded-xl border border-[#2A2A35] mt-4">
          <select
            aria-label="Filtro de loja"
            value={filtroLoja}
            onChange={e => setFiltroLoja(e.target.value)}
            className="h-11 rounded-lg border border-[#2A2A35] bg-[#1A1A24] px-4 text-sm text-white font-bold focus:outline-none focus:ring-1 focus:ring-primary uppercase w-full sm:w-60"
            disabled={varrendo}
          >
            <option value="">Todas as Lojas Ativas</option>
            {marketplaces.map(mk => (
              <option key={mk.slug} value={mk.slug}>{mk.nome.toUpperCase()}</option>
            ))}
          </select>

          <Button
            onClick={iniciarVarredura}
            disabled={varrendo}
            className="h-11 bg-primary text-black font-black text-sm hover:bg-primary/80 flex-1 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
          >
            <Search size={16} className={varrendo ? 'animate-pulse' : ''} />
            {varrendo ? `Varrendo... (${qtdFarejando} restantes)` : 'Iniciar Varredura'}
          </Button>
        </div>

        {/* BARRA DE PROGRESSO */}
        {(varrendo || varreduraConcluida) && resultados.length > 0 && (
          <div className="mt-3 space-y-1.5">
            <div className="w-full bg-[#0F0F13] rounded-full h-1.5 border border-[#2A2A35] overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 w-[var(--radar-progress)]"
                style={{ '--radar-progress': `${((resultados.length - qtdFarejando) / resultados.length) * 100}%` } as React.CSSProperties}
              />
            </div>
            <div className="flex gap-4 text-[11px] font-bold">
              <span className="text-[#22C55E]">{qtdSucesso} alterados</span>
              <span className="text-gray-500">{qtdIgual} iguais</span>
              <span className="text-red-400">{qtdErro} erros</span>
            </div>
          </div>
        )}
      </div>

      {/* EMPTY STATE: nenhuma varredura ainda */}
      {resultados.length === 0 && !varrendo && !varreduraConcluida && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-[#1A1A24] border border-[#2A2A35] flex items-center justify-center">
            <PackageSearch size={28} className="text-gray-600" />
          </div>
          <p className="text-gray-500 text-sm font-bold">Nenhuma varredura iniciada.</p>
          <p className="text-gray-600 text-xs">Selecione uma loja (ou todas) e clique em &quot;Iniciar Varredura&quot;.</p>
        </div>
      )}

      {/* EMPTY STATE: varredura concluída sem mudanças */}
      {tudoIgualSemErro && resultadosFiltrados.every(p => p.status === 'igual') && (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center">
            <CheckCircle2 size={28} className="text-[#22C55E]" />
          </div>
          <p className="text-white font-black text-lg">Tudo em ordem!</p>
          <p className="text-gray-500 text-sm">Nenhuma alteração de preço detectada nesta varredura.</p>
        </div>
      )}

      {/* RESULTADOS */}
      {resultados.length > 0 && (
        <div className="space-y-3">

          {/* TOOLBAR DOS RESULTADOS */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-white">
                Resultados
              </h2>
              <span className="text-xs text-gray-500 bg-[#0F0F13] border border-[#2A2A35] px-2 py-0.5 rounded-full font-bold">
                {resultadosFiltrados.length} de {resultados.length}
              </span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Toggle: mostrar só alterações */}
              <div className="flex items-center gap-2 bg-[#0F0F13] border border-[#2A2A35] rounded-lg px-3 py-2">
                <Switch
                  id="filtro-alteracoes"
                  checked={mostrarSoAlteracoes}
                  onCheckedChange={setMostrarSoAlteracoes}
                  className="scale-75 origin-left"
                />
                <Label htmlFor="filtro-alteracoes" className="text-xs font-bold cursor-pointer select-none whitespace-nowrap">
                  Só alterações
                </Label>
              </div>

              {/* Botão de salvar com contador */}
              {qtdSucesso > 0 && (
                <Button
                  onClick={salvarTodos}
                  disabled={salvando || varrendo}
                  className="h-9 bg-blue-600 text-white font-bold hover:bg-blue-700 flex items-center gap-2 text-sm"
                >
                  <Save size={14} />
                  {salvando ? 'Salvando...' : `Salvar ${qtdSucesso} preço${qtdSucesso > 1 ? 's' : ''}`}
                </Button>
              )}
            </div>
          </div>

          {/* TABELA */}
          {resultadosFiltrados.length > 0 && (
            <div className="bg-[#1A1A24] border border-[#2A2A35] rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto pb-4">
  <table className="w-full text-sm text-left text-gray-300 min-w-[600px] sm:min-w-full">
    <thead className="text-[10px] uppercase bg-[#0F0F13] text-gray-500 border-b border-[#2A2A35] font-black tracking-widest">
      <tr>
        <th className="px-4 sm:px-5 py-3.5 w-1/2 sm:w-auto">Produto</th>
        <th className="px-2 sm:px-4 py-3.5 text-center w-12 sm:w-16 hidden sm:table-cell">Status</th>
        <th className="px-3 sm:px-5 py-3.5 text-right">Cadastrado</th>
        <th className="px-3 sm:px-5 py-3.5 text-right bg-primary/5">Atual</th>
        <th className="px-2 sm:px-4 py-3.5 text-center w-16 sm:w-20">Ações</th>
      </tr>
    </thead>
    <tbody>
      {resultadosFiltrados.map(prod => (
        <tr key={prod.id} className={getRowStyle(prod)}>
          {/* NOME + LOJA */}
          <td className="px-4 sm:px-5 py-3.5">
            <div className="flex flex-col min-w-[150px] max-w-[200px] sm:max-w-sm gap-1">
              <a
                href={prod.link_afiliado}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-white hover:text-primary truncate text-sm leading-tight"
                title={prod.nome}
              >
                {prod.nome}
              </a>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider w-fit bg-[#0F0F13] px-2 py-0.5 rounded border border-[#2A2A35]">
                  {prod.loja}
                </span>
                {/* Status indicator moved here for Mobile */}
                <span className="sm:hidden flex items-center">
                  {prod.status === 'farejando' && <span className="w-2 h-2 rounded-full bg-primary animate-ping" />}
                  {prod.status === 'sucesso' && <span className="w-2 h-2 rounded-full bg-[#22C55E]" />}
                  {prod.status === 'erro' && <span className="w-2 h-2 rounded-full bg-red-500" />}
                </span>
              </div>
            </div>
          </td>

          {/* INDICADOR STATUS DESKTOP */}
          <td className="px-2 sm:px-4 py-3.5 text-center hidden sm:table-cell">
            {prod.status === 'aguardando' && <span className="w-2 h-2 rounded-full bg-gray-600 inline-block" />}
            {prod.status === 'farejando' && <span className="w-2 h-2 rounded-full bg-primary animate-ping inline-block" />}
            {prod.status === 'sucesso' && <span className="w-2 h-2 rounded-full bg-[#22C55E] inline-block shadow-[0_0_8px_rgba(34,197,94,0.8)]" />}
            {prod.status === 'igual' && <span className="w-2 h-2 rounded-full bg-gray-500 inline-block" />}
            {prod.status === 'erro' && <span className="w-2 h-2 rounded-full bg-red-500 inline-block shadow-[0_0_8px_rgba(239,68,68,0.7)]" />}
          </td>

          {/* PREÇO BANCO */}
          <td className="px-3 sm:px-5 py-3.5 text-right align-middle">
            <div className="flex flex-col items-end justify-center">
              <span className="font-mono text-gray-400 text-xs sm:text-sm">{formatarPreco(prod.preco_banco)}</span>
              {prod.updatedAt && (
                <span className="text-[9px] sm:text-[10px] text-gray-600 mt-0.5 whitespace-nowrap">
                  {tempoDesdeAtualizacao(prod.updatedAt)}
                </span>
              )}
            </div>
          </td>

          {/* PREÇO NOVO */}
          <td className="px-3 sm:px-5 py-3.5 text-right bg-primary/5 align-middle">
            {renderCelulaNovo(prod)}
          </td>

          {/* AÇÕES */}
<td className="px-2 sm:px-4 py-3.5 align-middle">
  <div className="flex items-center justify-center gap-1">
    {prod.status === 'erro' && (
      <button 
        type="button" 
        onClick={() => rasparProduto(prod)} 
        title="Tentar extrair preço novamente"
        aria-label={`Tentar novamente: ${prod.nome}`}
        className="text-gray-500 hover:text-primary hover:bg-primary/10 p-1.5 rounded-lg transition-colors"
      >
        <RefreshCw size={14} aria-hidden="true" />
      </button>
    )}
              <button 
                type="button" 
                onClick={() => excluirProduto(prod.id, prod.nome)} 
                title="Excluir produto do banco"
                aria-label={`Excluir produto: ${prod.nome}`}
                className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors"
              >
                <Trash2 size={14} aria-hidden="true" />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
            </div>
          )}

          {/* EMPTY STATE quando filtro de alterações está ativo e não tem nada */}
          {resultadosFiltrados.length === 0 && mostrarSoAlteracoes && (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
              <CheckCircle2 size={28} className="text-[#22C55E]" />
              <p className="text-gray-400 font-bold text-sm">Nenhuma alteração detectada até agora.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}