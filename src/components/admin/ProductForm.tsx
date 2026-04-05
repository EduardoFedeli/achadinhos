'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import type { Produto, Categoria, Loja } from '@/types'

const LOJAS: Loja[] = ['amazon', 'shopee', 'magalu', 'mercadolivre', 'americanas', 'casasbahia', 'centauro', 'aliexpress']

interface ProdutoComCategoria extends Produto {
  categoriaSlug?: string
  categoriaSlugs?: string[]
}

interface ProductFormProps {
  categorias: Categoria[]
  produto?: ProdutoComCategoria
  onSave: () => void
  onCancel: () => void
}

export default function ProductForm({ categorias = [], produto, onSave, onCancel }: ProductFormProps) {
  const isEdit = !!produto
  const [nome, setNome] = useState(produto?.nome ?? '')
  
  const initialCategories = produto?.categoriaSlugs?.length 
    ? produto.categoriaSlugs 
    : (produto?.categoriaSlug ? [produto.categoriaSlug] : [categorias?.[0]?.slug ?? ''])
  
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>(initialCategories)
  
  const [preco, setPreco] = useState(produto?.preco?.toString() ?? '')
  const [precoOriginal, setPrecoOriginal] = useState(produto?.preco_original?.toString() ?? '')
  const [desconto, setDesconto] = useState(produto?.desconto_pct?.toString() ?? '')
  const [imagem, setImagem] = useState(produto?.imagem ?? '')
  const [linkAfiliado, setLinkAfiliado] = useState(produto?.link_afiliado ?? '')
  const [loja, setLoja] = useState<Loja>((produto?.loja as Loja) ?? 'amazon')
  
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(produto?.tags ?? [])

  const [destaque, setDestaque] = useState(produto?.destaque ?? false)
  const [novo, setNovo] = useState(produto?.novo ?? false)
  const [dataCadastro, setDataCadastro] = useState(
    produto?.createdAt 
      ? new Date(produto.createdAt).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0]
  )
  const [loading, setLoading] = useState(false)

  function handlePrecoOriginalChange(v: string) {
    setPrecoOriginal(v)
    const orig = parseFloat(v)
    const atual = parseFloat(preco)
    if (!isNaN(orig) && !isNaN(atual) && orig > atual) {
      setDesconto(String(Math.round((1 - atual / orig) * 100)))
    } else {
      setDesconto('')
    }
  }

  function handlePrecoAtualChange(v: string) {
    setPreco(v)
    const atual = parseFloat(v)
    const orig = parseFloat(precoOriginal)
    if (!isNaN(orig) && !isNaN(atual) && orig > atual) {
      setDesconto(String(Math.round((1 - atual / orig) * 100)))
    } else {
      setDesconto('')
    }
  }

  function formatarTag(str: string) {
    if (!str) return ''
    const trimStr = str.trim()
    return trimStr.charAt(0).toUpperCase() + trimStr.slice(1).toLowerCase()
  }

  function addTag(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const tagFormatada = formatarTag(tagInput)
      
      if (!tags.includes(tagFormatada)) {
        setTags([...tags, tagFormatada])
      }
      setTagInput('')
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter(t => t !== tag))
  }

  function toggleCategoria(slug: string) {
    setSelectedCategorias(prev => 
      prev.includes(slug) 
        ? prev.filter(s => s !== slug) 
        : [...prev, slug]
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const nomeLimpo = nome.trim().replace(/\s+/g, ' ')
    const linkLimpo = linkAfiliado.trim()
    const imagemLimpa = imagem.trim()
    const precoNum = parseFloat(preco)
    const precoOriginalNum = precoOriginal ? parseFloat(precoOriginal) : undefined

    if (selectedCategorias.length === 0) {
      alert('Selecione ao menos uma categoria.')
      return
    }

    if (precoOriginalNum && precoNum >= precoOriginalNum) {
      alert('O Preço Original deve ser MAIOR que o Preço Atual.')
      return
    }

    if (linkLimpo && !linkLimpo.startsWith('http')) {
      alert('O link de afiliado precisa começar com http:// ou https://')
      return
    }
    
    setLoading(true)

    const novoProduto: Produto = {
      id: produto?.id ?? `prod-${Date.now()}`,
      nome: nomeLimpo,
      preco: precoNum,
      preco_original: precoOriginalNum,
      desconto_pct: desconto ? parseInt(desconto) : undefined,
      imagem: imagemLimpa || '',
      link_afiliado: linkLimpo,
      loja,
      tags: tags.length > 0 ? tags : undefined,
      destaque,
      novo,
      createdAt: new Date(`${dataCadastro}T12:00:00Z`).toISOString(),
    }

    const url = isEdit ? `/api/produtos/${produto!.id}` : '/api/produtos'
    const method = isEdit ? 'PUT' : 'POST'
    
    const body = {
      produto: novoProduto,
      categoriaSlugs: selectedCategorias
    }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      onSave()
    } else {
      // Isso vai pegar o erro exato que o backend mandou e jogar na sua tela
      const erroData = await res.json()
      alert(`ERRO DO SUPABASE: ${JSON.stringify(erroData)}`)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-foreground pb-2">
      
      {/* GRID SIMPLIFICADO E PERFEITO: 1 coluna no mobile, 2 colunas no desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* BLOCO 1: Informações Básicas */}
        <div className="bg-[#1A1A24]/40 p-4 sm:p-5 rounded-xl border border-[#2A2A35] flex flex-col gap-3 h-full">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#A1A1AA] mb-1">1. Informações Básicas</h3>
          
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Nome do Produto <span className="text-primary">*</span></Label>
            <Input 
              value={nome} 
              onChange={e => setNome(e.target.value)} 
              required 
              placeholder="Ex: Mouse Gamer Logitech G203"
              className="bg-[#0F0F13] border-[#2A2A35] focus-visible:ring-primary h-9 text-sm rounded-lg"
            />
          </div>
          
          <div className="space-y-1.5 flex-1">
            <Label className="text-xs text-muted-foreground">Categorias <span className="text-primary">*</span></Label>
            <div className="flex flex-wrap gap-1.5">
              {categorias?.map(c => {
                const isSelected = selectedCategorias.includes(c.slug)
                return (
                    <Badge
                      key={c.slug}
                      variant="outline"
                      onClick={() => toggleCategoria(c.slug)}
                      style={{
                        backgroundColor: isSelected ? c.cor : 'transparent',
                        borderColor: isSelected ? c.cor : '#2A2A35',
                        color: isSelected ? '#fff' : '#A1A1AA'
                      }}
                      className={`cursor-pointer px-2 py-1 text-xs select-none transition-all rounded-md border ${
                        !isSelected ? 'hover:border-primary/50 hover:text-foreground bg-[#0F0F13]' : ''
                      }`}
                    >
                      {c.emoji} {c.nome}
                    </Badge>
                  )
              })}
            </div>
          </div>
        </div>

        {/* BLOCO 2: Venda & Preço */}
        <div className="bg-[#1A1A24]/40 p-4 sm:p-5 rounded-xl border border-[#2A2A35] flex flex-col gap-3 h-full">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#A1A1AA] mb-1">2. Venda & Preço</h3>
          
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Loja Origem <span className="text-primary">*</span></Label>
            <select
              value={loja}
              onChange={e => setLoja(e.target.value as Loja)}
              className="flex h-9 w-full items-center justify-between rounded-lg border border-[#2A2A35] bg-[#0F0F13] px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {LOJAS.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Preço (R$) <span className="text-primary">*</span></Label>
              <Input 
                type="number" step="0.01" value={preco} 
                onChange={e => handlePrecoAtualChange(e.target.value)} 
                required placeholder="0.00"
                className="bg-[#0F0F13] border-[#2A2A35] h-9 text-primary font-bold text-sm rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Preço Original (R$)</Label>
              <Input 
                type="number" step="0.01" value={precoOriginal} 
                onChange={e => handlePrecoOriginalChange(e.target.value)} 
                placeholder="Opcional"
                className="bg-[#0F0F13] border-[#2A2A35] h-9 text-sm rounded-lg"
              />
            </div>
          </div>
          {desconto && (
            <p className="text-[10px] font-bold text-primary bg-primary/10 w-fit px-1.5 py-0.5 rounded mt-auto">
              {desconto}% OFF
            </p>
          )}
        </div>

        {/* BLOCO 3: Tags */}
        <div className="bg-[#1A1A24]/40 p-4 sm:p-5 rounded-xl border border-primary/30 relative flex flex-col gap-3 h-full">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[9px] font-black px-2 py-0.5 rounded-bl-lg rounded-tr-xl uppercase tracking-widest">
            Atenção
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-white mb-1">3. Tags</h3>
          
          <div className="space-y-1.5 flex-1">
            <Label className="text-xs text-muted-foreground">Adicionar Tag (Enter)</Label>
            <Input
              value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
              placeholder="Ex: acessorios, feminino..." className="bg-[#0F0F13] border-[#2A2A35] h-9 text-sm rounded-lg"
            />
            <p className="text-[10px] text-muted-foreground mt-1 bg-[#0F0F13] p-1.5 rounded-md border border-[#2A2A35] leading-tight">
              ⚠️ Cadastre <strong>SEMPRE NO SINGULAR</strong>. Só use plural se a palavra exigir (Ex: Tênis).
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tags.map(tag => (
                <button 
                  key={tag} type="button" onClick={() => removeTag(tag)} 
                  className="flex items-center gap-1 rounded-md bg-secondary border border-border px-2 py-1 text-[11px] font-bold text-secondary-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                >
                  {tag} ✕
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* BLOCO 4: Mídia e Redirecionamento */}
        <div className="bg-[#1A1A24]/40 p-4 sm:p-5 rounded-xl border border-[#2A2A35] flex flex-col gap-3 h-full">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#A1A1AA] mb-1">4. Mídia e Redirecionamento</h3>
          
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">URL da Imagem <span className="text-primary">*</span></Label>
            <div className="flex gap-2 items-center">
              <Input 
                value={imagem} onChange={e => setImagem(e.target.value)} required
                placeholder="https://..." className="bg-[#0F0F13] border-[#2A2A35] flex-1 h-9 text-sm rounded-lg"
              />
              {imagem && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagem.trim()} alt="" className="h-9 w-9 rounded-md object-cover border border-[#2A2A35] shrink-0" />
              )}
            </div>
          </div>

          <div className="space-y-1 flex-1">
            <Label className="text-xs text-muted-foreground">Link de Afiliado <span className="text-primary">*</span></Label>
            <Input 
              value={linkAfiliado} onChange={e => setLinkAfiliado(e.target.value)} required
              placeholder="https://amzn.to/..." className="bg-[#0F0F13] border-[#2A2A35] h-9 text-sm rounded-lg"
            />
          </div>
        </div>

        {/* BLOCO 5: Auditoria & Flags (Ocupando a largura inteira) */}
        <div className="lg:col-span-2 bg-[#1A1A24]/40 p-4 sm:p-5 rounded-xl border border-[#2A2A35] flex flex-col gap-3 h-full">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#A1A1AA] mb-1">5. Auditoria & Flags</h3>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:items-end w-full">
            <div className="space-y-1 flex-1">
              <Label className="text-[11px] text-muted-foreground">Data Cadastro</Label>
              <Input 
                type="date" value={dataCadastro} onChange={e => setDataCadastro(e.target.value)}
                className="bg-[#0F0F13] border-[#2A2A35] h-9 w-full text-xs rounded-lg px-2"
              />
            </div>
            
            <div className="flex gap-4 flex-1">
              <div className="flex-1 flex items-center justify-center gap-2 bg-[#0F0F13] px-2 rounded-lg border border-[#2A2A35] h-9">
                <Switch id="destaque" checked={destaque} onCheckedChange={setDestaque} className="scale-75 origin-left" />
                <Label htmlFor="destaque" className="cursor-pointer font-bold text-[11px] select-none">Vitrine</Label>
              </div>
              <div className="flex-1 flex items-center justify-center gap-2 bg-[#0F0F13] px-2 rounded-lg border border-[#2A2A35] h-9">
                <Switch id="novo" checked={novo} onCheckedChange={setNovo} className="scale-75 origin-left" />
                <Label htmlFor="novo" className="cursor-pointer font-bold text-[11px] select-none">Novo</Label>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* RODAPÉ */}
      <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-[#2A2A35]">
        <Button type="button" variant="ghost" onClick={onCancel} className="h-9 px-5 rounded-lg text-sm">Cancelar</Button>
        <Button type="submit" disabled={loading} className="h-9 px-6 rounded-lg font-black text-sm">
          {loading ? 'Salvando...' : 'Salvar Produto'}
        </Button>
      </div>
    </form>
  )
}