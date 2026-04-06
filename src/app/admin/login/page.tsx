'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authenticateUser } from './actions'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(false)

    // Chama a Server Action
    const result = await authenticateUser(password)

    if (result.success) {
      router.push('/admin/dashboard')
      router.refresh() // Força o Next.js a atualizar a árvore de permissões
    } else {
      setError(true)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F13] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1A1A24] border border-[#2A2A35] p-8 rounded-[32px] shadow-2xl">
        <h1 className="text-2xl font-black text-white mb-2 text-center uppercase tracking-tighter">Acesso Restrito</h1>
        <p className="text-[#8E8E9F] text-sm text-center mb-8">Painel Administrativo T-Hex Indica</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              type="password" 
              placeholder="Senha de acesso"
              className={`w-full bg-[#0F0F13] border ${error ? 'border-[#FF3838]' : 'border-[#2A2A35]'} rounded-xl px-4 py-4 text-white focus:border-[#F97316] outline-none transition-all`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            {error && (
              <p className="text-[#FF3838] text-xs font-bold mt-2 ml-1 uppercase">Senha incorreta. Tente novamente.</p>
            )}
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#F97316] text-[#0F0F13] font-black py-4 rounded-xl hover:brightness-110 transition-all uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Autenticando...' : 'Entrar no Painel'}
          </button>
        </form>
      </div>
    </div>
  )
}