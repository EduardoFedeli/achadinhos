'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin/dashboard')
    } else {
      setError('Senha incorreta. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-page-bg px-4">
      <div className="w-full max-w-sm rounded-2xl bg-card-bg border border-card-border p-8">
        <h1 className="mb-1 text-2xl font-black text-white">
          <span className="font-light">T-Hex</span> Indica
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">Painel administrativo</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="password" className="text-white mb-1 block">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Digite a senha de acesso"
              className="bg-surface border-card-border text-white"
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <Button type="submit" disabled={loading} className="bg-brand text-white hover:bg-brand/90">
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  )
}
