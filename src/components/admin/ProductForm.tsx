'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { Produto, Categoria, Loja } from '@/types'

const LOJAS: Loja[] = ['amazon', 'shopee', 'magalu', 'mercadolivre', 'americanas', 'casasbahia', 'centauro', 'aliexpress']

interface ProductFormProps {
  categorias: Categoria[]
  produto?: Produto & { categoriaSlug: string }
  onSave: () => void
  onCancel: () => void
}

export default function ProductForm({ categorias, produto, onSave, onCancel }: ProductFormProps) {
  const isEdit = !!produto
  const [nome, setNome] = useState(produto?.nome ?? '')
  const [categoriaSlug, setCategoriaSlug] = useState(produto?.categoriaSlug ?? categorias[0]?.slug ?? '')
  const [preco, setPreco] = useState(produto?.preco?.toString() ?? '')
  const [precoOriginal, setPrecoOriginal] = useState(produto?.preco_original?.toString() ?? '')
  const [desconto, setDesconto] = useState(produto?.desconto_pct?.toString() ?? '')
  const [imagem, setImagem] = useState(produto?.imagem ?? '')
  const [linkAfiliado, setLinkAfiliado] = useState(produto?.link_afiliado ?? '')
  const [loja, setLoja] = useState<Loja>(produto?.loja ?? 'amazon')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(produto?.tags ?? [])
  const [destaque, setDestaque] = useState(produto?.destaque ?? false)
  const [novo, setNovo] = useState(produto?.novo ?? false)
  const [loading, setLoading] = useState(false)

  function handlePrecoOriginalChange(v: string) {
    setPrecoOriginal(v)
    const orig = parseFloat(v)
    const atual = parseFloat(preco)
    if (!isNaN(orig) && !isNaN(atual) && orig > 0) {
      setDesconto(String(Math.round((1 - atual / orig) * 100)))
    }
  }

  function addTag(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter(t => t !== tag))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    const novoProduto: Produto = {
      id: produto?.id ?? `${categoriaSlug}-${Date.now()}`,
      nome,
      preco: parseFloat(preco),
      preco_original: precoOriginal ? parseFloat(precoOriginal) : undefined,
      desconto_pct: desconto ? parseInt(desconto) : undefined,
      imagem: imagem || null,
      link_afiliado: linkAfiliado,
      loja,
      tags: tags.length > 0 ? tags : undefined,
      destaque,
      novo,
    }

    const url = isEdit ? `/api/produtos/${produto!.id}` : '/api/produtos'
    const method = isEdit ? 'PUT' : 'POST'
    const body = isEdit ? novoProduto : { categoriaSlug, produto: novoProduto }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      onSave()
    } else {
      alert('Erro ao salvar produto.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Nome</Label>
          <Input value={nome} onChange={e => setNome(e.target.value)} required />
        </div>
        <div>
          <Label>Categoria</Label>
          <select
            value={categoriaSlug}
            onChange={e => setCategoriaSlug(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            required
          >
            {categorias.map(c => (
              <option key={c.slug} value={c.slug}>{c.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Loja</Label>
          <select
            value={loja}
            onChange={e => setLoja(e.target.value as Loja)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            {LOJAS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <Label>Preço atual (R$)</Label>
          <Input type="number" step="0.01" value={preco} onChange={e => setPreco(e.target.value)} required />
        </div>
        <div>
          <Label>Preço original (R$)</Label>
          <Input type="number" step="0.01" value={precoOriginal} onChange={e => handlePrecoOriginalChange(e.target.value)} />
        </div>
        <div>
          <Label>Desconto %</Label>
          <Input type="number" value={desconto} onChange={e => setDesconto(e.target.value)} />
        </div>
        <div className="col-span-2">
          <Label>URL da imagem</Label>
          <div className="flex gap-2">
            <Input value={imagem} onChange={e => setImagem(e.target.value)} placeholder="https://..." />
            {imagem && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagem} alt="" className="h-10 w-10 rounded object-cover shrink-0" />
            )}
          </div>
        </div>
        <div className="col-span-2">
          <Label>Link afiliado</Label>
          <Input value={linkAfiliado} onChange={e => setLinkAfiliado(e.target.value)} placeholder="https://amzn.to/..." required />
        </div>
        <div className="col-span-2">
          <Label>Tags (Enter para adicionar)</Label>
          <Input
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={addTag}
            placeholder="cachorro, gato..."
          />
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.map(tag => (
              <button key={tag} type="button" onClick={() => removeTag(tag)} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs hover:bg-red-100">
                {tag} ✕
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="destaque" checked={destaque} onCheckedChange={setDestaque} />
          <Label htmlFor="destaque">Destaque</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="novo" checked={novo} onCheckedChange={setNovo} />
          <Label htmlFor="novo">Novo</Label>
        </div>
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  )
}
