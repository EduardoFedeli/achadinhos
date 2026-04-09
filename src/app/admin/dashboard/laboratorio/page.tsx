'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Beaker, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from 'lucide-react'

type StatusTeste = 'idle' | 'loading' | 'aprovado' | 'parcial' | 'critico'

export default function LaboratorioPage() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<StatusTeste>('idle')
  const [resultado, setResultado] = useState<any>(null)

  async function testarLink() {
    if (!url) return alert('Insira um link para testar.')
    
    setStatus('loading')
    setResultado(null)

    try {
      const res = await fetch('/api/scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      const data = await res.json()

      if (res.ok) {
        setResultado(data)
        if (data.preco && data.preco > 0) {
          setStatus('aprovado') // Pegou tudo
        } else if (data.nome || data.imagem) {
          setStatus('parcial') // Pegou nome/img, mas bloqueou preço
        } else {
          setStatus('critico') // Falha total
        }
      } else {
        setStatus('critico')
        setResultado({ error: data.error || 'Erro na API.' })
      }
    } catch (err) {
      setStatus('critico')
      setResultado({ error: 'Falha de rede ou timeout.' })
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Beaker className="text-primary" size={28} /> Laboratório de Links
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Teste URLs de afiliados antes de cadastrar um marketplace para verificar a saúde da extração.
        </p>
      </div>

      <div className="bg-[#1A1A24] border border-[#2A2A35] p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input 
            value={url} 
            onChange={e => setUrl(e.target.value)} 
            placeholder="Cole o link do produto aqui (Ex: https://meli.la/...)" 
            className="h-12 bg-[#0F0F13] border-[#2A2A35] text-sm"
          />
          <Button 
            onClick={testarLink} 
            disabled={status === 'loading'}
            className="h-12 px-8 bg-primary text-black font-black hover:bg-primary/80 shrink-0"
          >
            {status === 'loading' ? 'Analisando...' : 'Iniciar Teste'} <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>

      {status !== 'idle' && status !== 'loading' && (
        <div className={`p-6 rounded-2xl border ${
          status === 'aprovado' ? 'bg-[#22C55E]/10 border-[#22C55E]/30' : 
          status === 'parcial' ? 'bg-[#F97316]/10 border-[#F97316]/30' : 
          'bg-red-500/10 border-red-500/30'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            {status === 'aprovado' && <CheckCircle2 className="text-[#22C55E]" size={24} />}
            {status === 'parcial' && <AlertTriangle className="text-[#F97316]" size={24} />}
            {status === 'critico' && <XCircle className="text-red-500" size={24} />}
            <h2 className={`text-xl font-black ${
              status === 'aprovado' ? 'text-[#22C55E]' : 
              status === 'parcial' ? 'text-[#F97316]' : 'text-red-500'
            }`}>
              {status === 'aprovado' && 'Aprovado para Radar 100% Automático'}
              {status === 'parcial' && 'Extração Parcial (Requer Revisão Manual)'}
              {status === 'critico' && 'Bloqueio Crítico Detectado'}
            </h2>
          </div>

          <p className="text-sm text-gray-300 mb-6">
            {status === 'aprovado' && 'O robô conseguiu furar as barreiras e trazer Nome, Imagem e Preços. Pode cadastrar o marketplace com a flag "Permite Scraper" ativada.'}
            {status === 'parcial' && 'O robô pegou os metadados (Nome/Imagem) para facilitar seu cadastro, mas o e-commerce blindou o preço. Este marketplace deve ser cadastrado com a flag "Permite Scraper" DESATIVADA.'}
            {status === 'critico' && 'Nem mesmo o disfarce de rede social funcionou. Verifique se o link não está quebrado ou expirado.'}
          </p>

          {resultado && (
            <div className="bg-[#0F0F13] border border-[#2A2A35] rounded-xl p-4 font-mono text-xs text-gray-400 overflow-x-auto">
              <pre>{JSON.stringify(resultado, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}