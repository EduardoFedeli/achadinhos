'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Categoria } from '@/types'

interface CategoryFormProps {
  categoria?: Categoria
  onSave: () => void
  onCancel: () => void
}

export default function CategoryForm({ categoria, onSave, onCancel }: CategoryFormProps) {
  const isEdit = !!categoria
  const [nome, setNome] = useState(categoria?.nome ?? '')
  const [slug, setSlug] = useState(categoria?.slug ?? '')
  const [emoji, setEmoji] = useState(categoria?.emoji ?? '')
  const [cor, setCor] = useState(categoria?.cor ?? '#22C55E')
  const [descricao, setDescricao] = useState(categoria?.descricao ?? '')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    const novaCategoria = {
      nome,
      slug,
      emoji,
      cor,
      descricao
    }

    const url = isEdit ? `/api/categorias/${categoria.slug}` : '/api/categorias'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novaCategoria),
    })

    if (res.ok) {
      onSave()
    } else {
      alert('Erro ao salvar categoria.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-foreground pt-2">
      <div className="space-y-1.5">
        <Label>Nome da Categoria</Label>
        <Input 
          value={nome} 
          onChange={e => setNome(e.target.value)} 
          required 
          placeholder="Ex: Moda"
          className="bg-[#0F0F13] border-[#2A2A35] h-10" 
        />
      </div>

      <div className="space-y-1.5">
        <Label>Slug (URL)</Label>
        <Input 
          value={slug} 
          onChange={e => setSlug(e.target.value)} 
          required 
          placeholder="ex: moda-feminina" 
          className="bg-[#0F0F13] border-[#2A2A35] h-10" 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Emoji</Label>
          <Input 
            value={emoji} 
            onChange={e => setEmoji(e.target.value)} 
            required 
            placeholder="Ex: 👗" 
            className="bg-[#0F0F13] border-[#2A2A35] h-10" 
          />
        </div>
        <div className="space-y-1.5">
          <Label>Cor (Hex)</Label>
          <div className="flex gap-2">
            <Input 
              type="color" 
              value={cor} 
              onChange={e => setCor(e.target.value)} 
              className="w-12 h-10 p-1 bg-[#0F0F13] border-[#2A2A35] cursor-pointer rounded-lg shrink-0" 
            />
            <Input 
              value={cor} 
              onChange={e => setCor(e.target.value)} 
              required 
              className="bg-[#0F0F13] border-[#2A2A35] flex-1 h-10 uppercase" 
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Descrição</Label>
        <Input 
          value={descricao} 
          onChange={e => setDescricao(e.target.value)} 
          placeholder="Breve descrição da categoria..." 
          className="bg-[#0F0F13] border-[#2A2A35] h-10" 
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-[#2A2A35]">
        <Button type="button" variant="ghost" onClick={onCancel} className="h-10 px-5">Cancelar</Button>
        <Button type="submit" disabled={loading} className="h-10 px-6 font-bold">
          {loading ? 'Salvando...' : 'Salvar Categoria'}
        </Button>
      </div>
    </form>
  )
}