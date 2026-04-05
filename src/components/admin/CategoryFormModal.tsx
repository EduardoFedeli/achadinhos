'use client'

import { useState, useEffect, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Categoria } from '@/types'

// Adicionando o tipo novo
interface CategoriaComImagem extends Categoria {
  imagem_url?: string;
}

interface CategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  category?: CategoriaComImagem
}

export default function CategoryFormModal({ isOpen, onClose, category }: CategoryFormModalProps) {
  const isEdit = !!category
  const [nome, setNome] = useState('')
  const [slug, setSlug] = useState('')
  const [emoji, setEmoji] = useState('')
  const [cor, setCor] = useState('#22C55E')
  const [descricao, setDescricao] = useState('')
  const [imagemUrl, setImagemUrl] = useState('') // NOVO ESTADO
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setNome(category?.nome ?? '')
      setSlug(category?.slug ?? '')
      setEmoji(category?.emoji ?? '')
      setCor(category?.cor ?? '#22C55E')
      setDescricao(category?.descricao ?? '')
      setImagemUrl(category?.imagem_url ?? '')
    }
  }, [isOpen, category])

  function handleNameChange(val: string) {
    setNome(val)
    if (!isEdit) {
      setSlug(val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''))
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    // Impede de colocar link inteiro no Slug
    if (slug.includes('http')) {
      alert("O Slug não pode ser um link! Use apenas letras minúsculas e hífens. Ex: casa-inteligente")
      setLoading(false)
      return
    }

    const payload = { nome, slug, emoji, cor, descricao, imagem_url: imagemUrl }
    // O encodeURIComponent transforma as barras e pontos em texto seguro para a URL não quebrar
    const url = isEdit ? `/api/categorias/${encodeURIComponent(category.slug)}` : '/api/categorias'
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        window.location.reload()
      } else {
        const data = await res.json()
        alert(`Erro ao salvar: ${data.error}`)
      }
    } catch (error) {
      alert('Erro de comunicação.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0F0F13] border border-[#2A2A35] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-[#2A2A35]">
          <h2 className="text-xl font-black text-white">{isEdit ? 'Editar categoria' : 'Nova categoria'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Nome da Categoria</Label>
            <Input required value={nome} onChange={e => handleNameChange(e.target.value)} className="bg-[#1A1A24] border-[#2A2A35] h-10" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Slug (Caminho do Site)</Label>
            <Input required value={slug} onChange={e => setSlug(e.target.value.toLowerCase())} placeholder="ex: moda-feminina" className="bg-[#1A1A24] border-[#2A2A35] h-10" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Link da Imagem Personalizada (Imgur)</Label>
            <div className="flex gap-2 items-center">
               <Input value={imagemUrl} onChange={e => setImagemUrl(e.target.value)} placeholder="https://i.imgur.com/..." className="bg-[#1A1A24] border-[#2A2A35] h-10 flex-1" />
               {imagemUrl && <img src={imagemUrl} alt="Preview" className="w-10 h-10 rounded border border-[#2A2A35] object-contain bg-[#1A1A24]" />}
            </div>
            <p className="text-[10px] text-gray-500">Se preenchido, ele substitui o Emoji em todo o site.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Emoji (Alternativa)</Label>
              <Input value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="Ex: 👗" className="bg-[#1A1A24] border-[#2A2A35] h-10" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Cor (Hex)</Label>
              <div className="flex gap-2">
                <Input type="color" value={cor} onChange={e => setCor(e.target.value)} className="w-10 h-10 p-1 bg-[#1A1A24] cursor-pointer" />
                <Input value={cor} onChange={e => setCor(e.target.value)} className="bg-[#1A1A24] border-[#2A2A35] h-10 flex-1 font-mono text-xs uppercase" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-[#2A2A35]">
            <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-[#2A2A35] text-white h-9">Cancelar</Button>
            <Button type="submit" disabled={loading} className="bg-[#22C55E] text-black font-bold hover:bg-[#22C55E]/80 h-9">
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}