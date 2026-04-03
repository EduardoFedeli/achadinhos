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

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

export default function CategoryForm({ categoria, onSave, onCancel }: CategoryFormProps) {
  const isEdit = !!categoria
  
  // Estados do formulário
  const [nome, setNome] = useState(categoria?.nome ?? '')
  const [slug, setSlug] = useState(categoria?.slug ?? '')
  const [emoji, setEmoji] = useState(categoria?.emoji ?? '')
  const [cor, setCor] = useState(categoria?.cor ?? '#22C55E')
  const [iconeUrl, setIconeUrl] = useState(categoria?.iconeUrl ?? '')
  const [descricao, setDescricao] = useState(categoria?.descricao ?? '')
  const [loading, setLoading] = useState(false)

  // Função para mudar o nome (e o slug apenas se for criação nova)
  function handleNomeChange(v: string) {
    setNome(v)
    if (!isEdit) {
      setSlug(toSlug(v))
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    // O corpo da requisição agora inclui o iconeUrl
    const body = { 
      nome, 
      slug, 
      emoji, 
      cor, 
      iconeUrl, 
      descricao 
    }
    
    const url = isEdit ? `/api/categorias/${categoria!.slug}` : '/api/categorias'
    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      onSave()
    } else {
      const err = await res.json() as { error?: string }
      alert(err.error ?? 'Erro ao salvar categoria.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-foreground">
      {/* NOME DA CATEGORIA */}
      <div className="space-y-1.5">
        <Label htmlFor="nome">Nome da Categoria</Label>
        <Input 
          id="nome"
          value={nome} 
          onChange={e => handleNomeChange(e.target.value)} 
          placeholder="Ex: Eletro"
          required 
          className="bg-background border-input focus-visible:ring-primary"
        />
      </div>

      {/* SLUG (TRAVADO NA EDIÇÃO) */}
      <div className="space-y-1.5 opacity-80">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input
          id="slug"
          value={slug}
          onChange={e => setSlug(toSlug(e.target.value))}
          required
          disabled={isEdit} // Desativado na edição para proteger links
          className={isEdit ? 'bg-muted cursor-not-allowed border-dashed' : 'bg-background'}
        />
        {isEdit && (
          <p className="text-[10px] text-muted-foreground">
            O slug não pode ser editado para evitar links quebrados no site.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* EMOJI */}
        <div className="space-y-1.5">
          <Label htmlFor="emoji">Emoji de Fallback</Label>
          <Input 
            id="emoji"
            value={emoji} 
            onChange={e => setEmoji(e.target.value)} 
            placeholder="🐾" 
            required 
            className="bg-background border-input"
          />
        </div>

        {/* COR ACCENT */}
        <div className="space-y-1.5">
          <Label>Cor de Identidade</Label>
          <div className="flex gap-2">
            <input
              type="color"
              value={cor}
              onChange={e => setCor(e.target.value)}
              className="h-10 w-12 cursor-pointer rounded border border-input bg-background p-1"
            />
            <Input 
              value={cor} 
              onChange={e => setCor(e.target.value)} 
              placeholder="#22C55E" 
              className="bg-background border-input"
            />
          </div>
        </div>
      </div>

      {/* URL DO ÍCONE IA */}
      <div className="space-y-1.5 border-t border-border pt-4">
        <Label htmlFor="iconeUrl">URL do Ícone Personalizado (IA)</Label>
        <div className="flex gap-3 items-center">
          <Input 
            id="iconeUrl"
            value={iconeUrl} 
            onChange={e => setIconeUrl(e.target.value)} 
            placeholder="https://imgur.com/seu-icone.png"
            className="bg-background border-input flex-1"
          />
          {iconeUrl && (
            <div className="h-10 w-10 rounded-md border border-border bg-[#1A1A24] p-1.5 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={iconeUrl} alt="Preview" className="h-full w-full object-contain" />
            </div>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground italic">
          Gere um Flat Icon em fundo transparente e cole a URL aqui.
        </p>
      </div>

      {/* DESCRIÇÃO */}
      <div className="space-y-1.5">
        <Label htmlFor="descricao">Descrição (SEO)</Label>
        <Input 
          id="descricao"
          value={descricao} 
          onChange={e => setDescricao(e.target.value)} 
          placeholder="Os melhores eletros em oferta"
          required 
          className="bg-background border-input"
        />
      </div>

      {/* AÇÕES */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border mt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={loading} className="min-w-[100px]">
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </form>
  )
}