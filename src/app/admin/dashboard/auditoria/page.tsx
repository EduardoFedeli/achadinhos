'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { AlertTriangle, RefreshCcw, Trash2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AuditoriaPage() {
  const [produtosVencidos, setProdutosVencidos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tempoRenovacao, setTempoRenovacao] = useState<Record<string, number>>({})

  useEffect(() => {
    carregarVencidos()
  }, [])

  async function carregarVencidos() {
    setLoading(true)
    const { data } = await supabase.from('produtos').select('*')
    
    if (data) {
      const hoje = new Date().getTime()
      
      const vencidos = data.filter(p => {
        if (!p.createdAt) return true
        const diffTime = hoje - new Date(p.createdAt).getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        return diffDays >= 90
      })

      vencidos.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      setProdutosVencidos(vencidos)
    }
    setLoading(false)
  }

  // 👇 NOVA LÓGICA DE RENOVAÇÃO (Chama a API segura)
  async function handleRenovar(id: string) {
    const mesesDeSobrevida = tempoRenovacao[id] || 3
    const dataFicticia = new Date()
    const diasParaVoltarNoTempo = 90 - (mesesDeSobrevida * 30) 
    
    dataFicticia.setDate(dataFicticia.getDate() - diasParaVoltarNoTempo)
    const novaData = dataFicticia.toISOString()

    const res = await fetch('/api/auditoria', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'renovar', id, novaData })
    })

    if (res.ok) {
      setProdutosVencidos(prev => prev.filter(p => p.id !== id))
    } else {
      alert('Erro ao renovar o produto.')
    }
  }

  // 👇 NOVA LÓGICA DE EXCLUSÃO (Chama a API segura)
  async function handleExcluir(id: string) {
    if(!confirm('Tem certeza? Isso vai apagar o produto do site para sempre!')) return;
    
    const res = await fetch('/api/auditoria', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'excluir', id })
    })

    if (res.ok) {
      setProdutosVencidos(prev => prev.filter(p => p.id !== id))
    } else {
      alert('Erro ao excluir o produto.')
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <AlertTriangle className="text-[#FF3838] w-8 h-8" />
            Auditoria de Validade
          </h1>
          <p className="text-[#8E8E9F] mt-1 font-medium">
            Produtos inativos ou cadastrados há mais de 90 dias.
          </p>
        </div>
        <div className="bg-[#1A1A24] px-4 py-2 rounded-lg border border-[#2A2A35]">
          <span className="text-[#8E8E9F] text-sm font-bold uppercase">A Revisar: </span>
          <span className="text-[#FF3838] font-black text-xl ml-2">{produtosVencidos.length}</span>
        </div>
      </header>

      {loading ? (
        <div className="text-center py-20 text-[#8E8E9F] font-bold animate-pulse">Varrendo banco de dados...</div>
      ) : produtosVencidos.length === 0 ? (
        <div className="bg-[#1A1A24]/40 border border-[#22C55E]/30 rounded-2xl p-12 text-center">
          <p className="text-4xl mb-4">🎉</p>
          <h3 className="text-xl font-black text-white mb-2">Tudo em dia!</h3>
          <p className="text-[#8E8E9F]">Nenhum produto passou da validade de 90 dias.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {produtosVencidos.map(p => {
            const diasVencidos = p.createdAt 
              ? Math.floor((new Date().getTime() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24))
              : 'N/A'
            
            return (
              <div key={p.id} className="bg-[#1A1A24] border border-[#FF3838]/30 rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#FF3838]" />
                
                <div className="flex gap-4 items-start">
                  <img src={p.imagem} alt="" className="w-16 h-16 rounded-lg object-cover border border-[#2A2A35] shrink-0 bg-white" />
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight">{p.nome}</h3>
                    <p className="text-xs text-[#8E8E9F] mt-1 font-medium">
                      Cadastrado há {diasVencidos} dias
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-[#2A2A35]">
                  <Button 
                    // 👇 CORREÇÃO: Pega tanto linkAfiliado quanto link_afiliado para garantir que não falha
                    onClick={() => window.open(p.linkAfiliado || p.link_afiliado, '_blank')}
                    variant="ghost" 
                    className="w-full h-8 text-[11px] text-[#3B82F6] hover:bg-[#3B82F6]/10 hover:text-[#3B82F6] border border-[#3B82F6]/20"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" /> Testar Link da Loja
                  </Button>
                  
                  <div className="flex gap-2">
                    <select 
                      aria-label="Tempo de renovação"
                      className="bg-[#0F0F13] text-[#8E8E9F] text-[11px] font-bold border border-[#2A2A35] rounded-lg px-2 w-28 h-8 outline-none focus:border-[#22C55E]"
                      value={tempoRenovacao[p.id] || 3}
                      onChange={e => setTempoRenovacao({...tempoRenovacao, [p.id]: Number(e.target.value)})}
                    >
                      <option value={1}>+ 1 Mês</option>
                      <option value={2}>+ 2 Meses</option>
                      <option value={3}>Total (3 Meses)</option>
                    </select>

                    <Button 
                      onClick={() => handleRenovar(p.id)}
                      className="flex-1 h-8 text-[11px] bg-[#22C55E]/10 text-[#22C55E] hover:bg-[#22C55E]/20"
                    >
                      <RefreshCcw className="w-3 h-3 mr-1" /> Renovar
                    </Button>

                    <Button 
                      onClick={() => handleExcluir(p.id)}
                      className="w-10 h-8 px-0 text-[11px] bg-[#FF3838]/10 text-[#FF3838] hover:bg-[#FF3838]/20 shrink-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}