'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function AdminLogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout} className="w-full">
      Sair
    </Button>
  )
}
