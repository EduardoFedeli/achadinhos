'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import CategoryForm from './CategoryForm'
import type { Categoria } from '@/types'

interface CategoriesPanelProps {
  categorias: Categoria[]
}

export default function CategoriesPanel({ categorias }: CategoriesPanelProps) {
  const [editando, setEditando] = useState<Categoria | null>(null)
  const [adicionando, setAdicionando] = useState(false)
  const router = useRouter()

  function handleSaved() {
    setEditando(null)
    setAdicionando(false)
    router.refresh()
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Categorias ({categorias.length})</h2>
        <Button onClick={() => setAdicionando(true)}>+ Nova categoria</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categorias.map(cat => (
          <div key={cat.slug} className="rounded-2xl bg-card border border-border p-5 transition-colors hover:border-border/80 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-xl shrink-0"
                style={{ backgroundColor: `${cat.cor}22`, border: `1px solid ${cat.cor}55` }}
              >
                {cat.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground truncate">{cat.nome}</p>
                <p className="text-xs text-muted-foreground truncate">/{cat.slug}</p>
              </div>
              <div
                className="h-3 w-3 rounded-full border border-border/50 shrink-0"
                style={{ backgroundColor: cat.cor }}
                title={cat.cor}
              />
            </div>
            
            <p className="text-xs text-muted-foreground mb-4 flex-1">{cat?.produtos?.length || 0} produtos cadastrados</p>
            
            <div className="grid grid-cols-2 gap-3 mt-auto pt-2 border-t border-border/50">
              <Button size="sm" variant="secondary" onClick={() => setEditando(cat)} className="w-full text-foreground">
                Editar
              </Button>
              <Button size="sm" variant="outline" asChild className="w-full border-border hover:bg-accent text-foreground">
                <Link href={`/${cat.slug}`} target="_blank">
                  Ver site →
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!editando} onOpenChange={() => setEditando(null)}>
        <DialogContent className="max-w-lg bg-[#0F0F13] border-[#2A2A35] text-foreground p-6">
          <DialogHeader><DialogTitle className="text-xl font-black">Editar categoria</DialogTitle></DialogHeader>
          {editando && <CategoryForm categoria={editando} onSave={handleSaved} onCancel={() => setEditando(null)} />}
        </DialogContent>
      </Dialog>

      <Dialog open={adicionando} onOpenChange={setAdicionando}>
        <DialogContent className="max-w-lg bg-[#0F0F13] border-[#2A2A35] text-foreground p-6">
          <DialogHeader><DialogTitle className="text-xl font-black">Nova categoria</DialogTitle></DialogHeader>
          <CategoryForm onSave={handleSaved} onCancel={() => setAdicionando(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}