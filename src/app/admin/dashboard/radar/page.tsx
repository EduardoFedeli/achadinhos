'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { formatarPreco } from '@/lib/produtos'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function RadarPage() {
  const [produtos, setProdutos] = useState<any[]>([])
  const [analisados, setAnalisados] = useState<any[]>([])
  const [varrendo, setVarrendo] = useState(false)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    supabase.from('produtos').select('*').order('createdAt', { ascending: false }).then(({ data }) => {
      // Pega só os da Amazon
      setProdutos((data || []).filter(p => p.linkAfiliado?.includes('amazon') || p.linkAfiliado?.includes('amzn.to') || p.link_afiliado?.includes('amazon') || p.link_afiliado?.includes('amzn.to')))
    })
  }, [])

  async function iniciarVarredura() {
    setVarrendo(true)
    setAnalisados([])
    const resultados = []

    for (const p of produtos) {
      const link = p.linkAfiliado || p.link_afiliado
      try {
        const res = await fetch('/api/scraper', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: link })
        })
        const novo = await res.json()
        
        if (res.ok && novo.preco) {
          const diff = novo.preco - p.preco
          resultados.push({ ...p, precoNovo: novo.preco, precoOriginalNovo: novo.preco_original, diff })
        }
      } catch (e) {}
      
      setAnalisados([...resultados])
      // Pausa de 1.5s para a Amazon não bloquear o seu robô
      await new Promise(r => setTimeout(r, 1500)) 
    }
    setVarrendo(false)
  }

  async function salvarAlteracoes() {
    setSalvando(true)
    const mudaram = analisados.filter(p => p.diff !== 0) // Salva só o que mudou de preço
    
    for (const p of mudaram) {
      const descCalc = p.precoOriginalNovo && p.precoNovo 
        ? Math.round((1 - (p.precoNovo / p.precoOriginalNovo)) * 100) 
        : p.desconto_pct

      await fetch('/api/produtos/sync', {
        method: 'POST',
        body: JSON.stringify({ id: p.id, preco: p.precoNovo, precoOriginal: p.precoOriginalNovo, desconto_pct: descCalc })
      })
    }
    alert('Preços Sincronizados com Sucesso!')
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Radar T-Hex 🦖</h1>
          <p className="text-muted-foreground">Sincronização em massa de preços da Amazon.</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={iniciarVarredura} disabled={varrendo || salvando} className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
            {varrendo ? `Varrendo... (${analisados.length}/${produtos.length})` : '1. Iniciar Varredura'}
          </Button>
          <Button onClick={salvarAlteracoes} disabled={varrendo || salvando || analisados.length === 0} className="bg-[#22C55E] hover:bg-[#22C55E]/80 text-black font-bold">
            {salvando ? 'Salvando...' : '2. Salvar Alterações'}
          </Button>
        </div>
      </div>

      <div className="bg-[#1A1A24] border border-[#2A2A35] rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-[#0F0F13] text-gray-400">
            <tr>
              <th className="px-6 py-4">Produto</th>
              <th className="px-6 py-4 text-center">Preço Atual (Site)</th>
              <th className="px-6 py-4 text-center">Novo Preço (Amazon)</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {analisados.map(p => (
              <tr key={p.id} className="border-b border-[#2A2A35]">
                <td className="px-6 py-4 font-bold">{p.nome}</td>
                <td className="px-6 py-4 text-center">{formatarPreco(p.preco)}</td>
                <td className="px-6 py-4 text-center font-bold text-white">{formatarPreco(p.precoNovo)}</td>
                <td className="px-6 py-4 text-center">
                  {p.diff < 0 ? <span className="text-[#22C55E]">⬇️ Caiu</span> : 
                   p.diff > 0 ? <span className="text-red-500">⬆️ Subiu</span> : 
                   <span className="text-gray-500">Igual</span>}
                </td>
              </tr>
            ))}
            {analisados.length === 0 && !varrendo && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Clique em Iniciar Varredura para buscar os preços.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}