'use client'

import { useState, useEffect, FormEvent } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pencil, Trash2, CheckSquare } from 'lucide-react'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function MarketplacesPage() {
  const [lojas, setLojas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selecionados, setSelecionados] = useState<string[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [nome, setNome] = useState('')
  const [slug, setSlug] = useState('')
  const [dominios, setDominios] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    carregarLojas()
  }, [])

  async function carregarLojas() {
    const { data } = await supabase.from('marketplaces').select('*').order('nome')
    if (data) setLojas(data)
    setLoading(false)
  }

  function toggleSelecionarTodos() {
    if (selecionados.length === lojas.length) setSelecionados([])
    else setSelecionados(lojas.map(l => l.id))
  }

  function toggleSelecionar(id: string) {
    if (selecionados.includes(id)) setSelecionados(selecionados.filter(s => s !== id))
    else setSelecionados([...selecionados, id])
  }

  async function acaoEmMassa(acao: 'ativar' | 'pausar' | 'excluir') {
    if (selecionados.length === 0) return
    
    if (acao === 'excluir') {
      const confirmou = confirm(`ATENÇÃO: Você está prestes a excluir ${selecionados.length} marketplace(s). Tem certeza?`)
      if (!confirmou) return
      
      await fetch('/api/marketplaces', { method: 'POST', body: JSON.stringify({ action: 'delete_many', ids: selecionados }) })
      setLojas(lojas.filter(l => !selecionados.includes(l.id)))
    } else {
      const statusAtivo = acao === 'ativar'
      await fetch('/api/marketplaces', { method: 'POST', body: JSON.stringify({ action: 'update_many', payload: { ativo: statusAtivo }, ids: selecionados }) })
      setLojas(lojas.map(l => selecionados.includes(l.id) ? { ...l, ativo: statusAtivo } : l))
    }
    setSelecionados([]) 
  }

  function handleNomeChange(val: string) {
    setNome(val)
    if (!editandoId) {
      setSlug(val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, ''))
    }
  }

  function abrirFormularioNova() {
    setEditandoId(null); setNome(''); setSlug(''); setDominios('')
    setShowForm(true)
  }

  function abrirFormularioEdicao(loja: any) {
    setEditandoId(loja.id); setNome(loja.nome); setSlug(loja.slug); setDominios(loja.dominios || '')
    setShowForm(true)
  }

  async function handleSalvar(e: FormEvent) {
    e.preventDefault()
    setSalvando(true)
    
    const payload = { nome: nome.trim(), slug: slug.trim(), dominios: dominios.trim(), cor: '#A1A1AA' }

    if (editandoId) {
      await fetch('/api/marketplaces', { method: 'POST', body: JSON.stringify({ action: 'update', id: editandoId, payload }) })
      setLojas(lojas.map(l => l.id === editandoId ? { ...l, ...payload } : l))
    } else {
      const res = await fetch('/api/marketplaces', { method: 'POST', body: JSON.stringify({ action: 'create', payload: { ...payload, ativo: true } }) })
      const { data } = await res.json()
      if (data) setLojas([...lojas, data[0]].sort((a, b) => a.nome.localeCompare(b.nome)))
    }

    setShowForm(false)
    setSalvando(false)
  }

  async function toggleStatusIndividual(id: string, statusAtual: boolean) {
    setLojas(lojas.map(l => l.id === id ? { ...l, ativo: !statusAtual } : l)) 
    await fetch('/api/marketplaces', { method: 'POST', body: JSON.stringify({ action: 'update', id, payload: { ativo: !statusAtual } }) })
  }

  if (loading) return <div className="text-white p-8">Carregando marketplaces...</div>

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Marketplaces 🛒</h1>
          <p className="text-muted-foreground text-sm">Gerencie lojas afiliadas, edite domínios e altere os status.</p>
        </div>
        <Button onClick={showForm ? () => setShowForm(false) : abrirFormularioNova} className="bg-[#22C55E] text-black font-bold hover:bg-[#22C55E]/80">
          {showForm ? 'Cancelar' : '+ Novo Marketplace'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSalvar} className="bg-[#1A1A24] border border-primary/30 p-5 rounded-xl flex flex-col gap-4 shadow-[0_0_20px_rgba(34,197,94,0.1)] relative">
          <div className="absolute top-0 right-0 bg-primary text-black text-[10px] font-black px-3 py-1 rounded-bl-lg rounded-tr-xl uppercase tracking-widest">
            {editandoId ? 'Modo de Edição' : 'Nova Loja'}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Nome da Loja *</Label>
              <Input required value={nome} onChange={e => handleNomeChange(e.target.value)} placeholder="Ex: Amazon" className="bg-[#0F0F13] border-[#2A2A35] h-10" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Slug (Identificador) *</Label>
              <Input required value={slug} onChange={e => setSlug(e.target.value.toLowerCase())} placeholder="Ex: amazon" className="bg-[#0F0F13] border-[#2A2A35] h-10" disabled={!!editandoId} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Padrões de Link (Domínios) *</Label>
              <Input required value={dominios} onChange={e => setDominios(e.target.value)} placeholder="Ex: amazon.com.br, amzn.to" className="bg-[#0F0F13] border-[#2A2A35] h-10" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={salvando} className="bg-[#22C55E] text-black font-bold h-10 px-6">
              {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      )}

      {selecionados.length > 0 && (
        <div className="bg-primary/20 border border-primary/50 text-white px-4 py-3 rounded-xl flex items-center justify-between shadow-lg backdrop-blur-md sticky top-4 z-10 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <CheckSquare className="text-primary" size={20} />
            <span className="font-bold text-sm">{selecionados.length} selecionados</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => acaoEmMassa('ativar')} className="bg-[#22C55E] text-black font-bold text-xs hover:bg-[#22C55E]/80">Ativar</Button>
            <Button size="sm" onClick={() => acaoEmMassa('pausar')} className="bg-orange-500 text-white font-bold text-xs hover:bg-orange-600">Pausar</Button>
            <Button size="sm" onClick={() => acaoEmMassa('excluir')} className="bg-red-500 text-white font-bold text-xs hover:bg-red-600 flex items-center gap-1">
              <Trash2 size={14} /> Excluir
            </Button>
          </div>
        </div>
      )}

      <div className="bg-[#1A1A24] border border-[#2A2A35] rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-[#0F0F13] text-gray-400">
            <tr>
              <th className="px-4 py-4 w-12">
                <input type="checkbox" checked={selecionados.length === lojas.length && lojas.length > 0} onChange={toggleSelecionarTodos} className="w-4 h-4 rounded border-[#2A2A35] bg-[#1A1A24] text-primary" />
              </th>
              <th className="px-4 py-4">Loja</th>
              <th className="px-4 py-4">Padrões de Link</th>
              <th className="px-4 py-4 text-center">Status</th>
              <th className="px-4 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {lojas.map(loja => {
              const selecionado = selecionados.includes(loja.id);
              return (
                <tr key={loja.id} className={`border-b border-[#2A2A35] transition-colors ${selecionado ? 'bg-primary/5' : 'hover:bg-white/5'}`}>
                  <td className="px-4 py-4">
                    <input type="checkbox" checked={selecionado} onChange={() => toggleSelecionar(loja.id)} className="w-4 h-4 rounded border-[#2A2A35] bg-[#1A1A24] text-primary" />
                  </td>
                  <td className="px-4 py-4 font-bold text-white">{loja.nome}</td>
                  <td className="px-4 py-4 font-mono text-xs text-gray-400">{loja.dominios || '—'}</td>
                  <td className="px-4 py-4 text-center">
                    <button 
                      onClick={() => toggleStatusIndividual(loja.id, loja.ativo)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${loja.ativo ? 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30' : 'bg-orange-500/10 text-orange-500 border border-orange-500/30'}`}
                    >
                      {loja.ativo ? 'ATIVO' : 'PAUSADO'}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => abrirFormularioEdicao(loja)} className="text-gray-400 hover:text-primary hover:bg-primary/10 h-8 px-2">
                      <Pencil size={16} />
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}