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

export default function ProductForm({ categorias, produto, onSave, onCancel }: ProductFormProps) {
  const isEdit = !!produto
  const [nome, setNome] = useState(produto?.nome ?? '')
  
  const initialCategories = produto?.categoriaSlugs?.length 
    ? produto.categoriaSlugs 
    : (produto?.categoriaSlug ? [produto.categoriaSlug] : [categorias[0]?.slug ?? ''])
  
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

  // Calcula desconto automaticamente e trava números absurdos
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
      alert('Erro ao salvar produto.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-foreground pb-4">
      
      {/* BLOCO 1: Informações Básicas */}
      <div className="bg-[#1A1A24]/40 p-5 rounded-2xl border border-[#2A2A35] space-y-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#A1A1AA] mb-4">1. Informações Básicas</h3>
        
        <div className="space-y-1.5">
          <Label>Nome do Produto <span className="text-primary font-bold">*</span></Label>
          <Input 
            value={nome} 
            onChange={e => setNome(e.target.value)} 
            required 
            placeholder="Ex: Mouse Gamer Logitech G203"
            className="bg-[#0F0F13] border-[#2A2A35] focus-visible:ring-primary h-11"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Categorias <span className="text-primary font-bold">*</span></Label>
          <div className="flex flex-wrap gap-2">
            {categorias.map(c => {
              const isSelected = selectedCategorias.includes(c.slug)
              return (
                <Badge
                  key={c.slug}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => toggleCategoria(c.slug)}
                  className={`cursor-pointer px-3 py-1.5 text-sm select-none transition-colors ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-transparent' 
                      : 'bg-[#0F0F13] border-[#2A2A35] text-muted-foreground hover:border-primary/50 hover:text-foreground'
                  }`}
                >
                  {c.emoji} {c.nome}
                </Badge>
              )
            })}
          </div>
        </div>
      </div>

      {/* BLOCO 2: Preço e Loja */}
      <div className="bg-[#1A1A24]/40 p-5 rounded-2xl border border-[#2A2A35] space-y-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#A1A1AA] mb-4">2. Venda & Preço</h3>
        
        <div className="space-y-1.5">
          <Label>Loja Origem <span className="text-primary font-bold">*</span></Label>
          <select
            value={loja}
            onChange={e => setLoja(e.target.value as Loja)}
            className="flex h-11 w-full items-center justify-between rounded-xl border border-[#2A2A35] bg-[#0F0F13] px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
          >
            {LOJAS.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Preço de Oferta (R$) <span className="text-primary font-bold">*</span></Label>
            <Input 
              type="number" step="0.01" value={preco} 
              onChange={e => handlePrecoAtualChange(e.target.value)} 
              required placeholder="0.00"
              className="bg-[#0F0F13] border-[#2A2A35] h-11 text-primary font-bold"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Preço Cheio/Original (R$)</Label>
            <Input 
              type="number" step="0.01" value={precoOriginal} 
              onChange={e => handlePrecoOriginalChange(e.target.value)} 
              placeholder="Opcional"
              className="bg-[#0F0F13] border-[#2A2A35] h-11"
            />
          </div>
        </div>
        {desconto && (
          <p className="text-xs font-bold text-primary bg-primary/10 w-fit px-2 py-1 rounded-md">
            Desconto calculado: {desconto}% OFF
          </p>
        )}
      </div>

      {/* BLOCO 3: Mídia e Link */}
      <div className="bg-[#1A1A24]/40 p-5 rounded-2xl border border-[#2A2A35] space-y-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#A1A1AA] mb-4">3. Mídia e Redirecionamento</h3>
        
        <div className="space-y-1.5">
          <Label>URL da Imagem <span className="text-primary font-bold">*</span></Label>
          <div className="flex gap-3 items-center">
            <Input 
              value={imagem} onChange={e => setImagem(e.target.value)} required
              placeholder="https://..." className="bg-[#0F0F13] border-[#2A2A35] flex-1 h-11"
            />
            {imagem && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagem.trim()} alt="" className="h-11 w-11 rounded-lg object-cover border border-[#2A2A35] shrink-0" />
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Link de Afiliado <span className="text-primary font-bold">*</span></Label>
          <Input 
            value={linkAfiliado} onChange={e => setLinkAfiliado(e.target.value)} required
            placeholder="https://amzn.to/..." className="bg-[#0F0F13] border-[#2A2A35] h-11"
          />
        </div>
      </div>

      {/* BLOCO 4: Descoberta (Tags) */}
      <div className="bg-[#1A1A24]/40 p-5 rounded-2xl border border-primary/30 relative space-y-5">
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-black px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase tracking-widest">
          Atenção
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4">4. Tags de Descoberta</h3>
        
        <div className="space-y-1.5">
          <Label>Adicionar Tag (Aperte Enter)</Label>
          <Input
            value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
            placeholder="Ex: acessorios, feminino..." className="bg-[#0F0F13] border-[#2A2A35] h-11"
          />
          <p className="text-[11px] text-muted-foreground mt-1 bg-[#0F0F13] p-2 rounded-lg border border-[#2A2A35]">
            ⚠️ <strong className="text-white">REGRA DE OURO:</strong> Cadastre <strong>SEMPRE NO SINGULAR</strong> (Ex: Ração, Gato, Livro). <br/>
            Só use plural se for a forma correta da palavra (Ex: Tênis, Óculos, Games).
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map(tag => (
              <button 
                key={tag} type="button" onClick={() => removeTag(tag)} 
                className="flex items-center gap-2 rounded-full bg-secondary border border-border px-3 py-1.5 text-xs font-bold text-secondary-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
              >
                {tag} ✕
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* BLOCO 5: Flags e Auditoria */}
      <div className="bg-[#1A1A24]/40 p-5 rounded-2xl border border-[#2A2A35] space-y-5">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#A1A1AA] mb-4">5. Flags & Auditoria</h3>
        
        <div className="space-y-1.5">
          <Label>Data de Cadastro</Label>
          <Input 
            type="date" value={dataCadastro} onChange={e => setDataCadastro(e.target.value)}
            className="bg-[#0F0F13] border-[#2A2A35] max-w-[200px] h-11"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1 flex items-center gap-3 bg-[#0F0F13] p-4 rounded-xl border border-[#2A2A35]">
            <Switch id="destaque" checked={destaque} onCheckedChange={setDestaque} />
            <Label htmlFor="destaque" className="cursor-pointer font-bold">Vitrine (★)</Label>
          </div>
          <div className="flex-1 flex items-center gap-3 bg-[#0F0F13] p-4 rounded-xl border border-[#2A2A35]">
            <Switch id="novo" checked={novo} onCheckedChange={setNovo} />
            <Label htmlFor="novo" className="cursor-pointer font-bold">Novo (Cyan)</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2A35]">
        <Button type="button" variant="ghost" onClick={onCancel} className="h-12 px-6 rounded-xl">Cancelar</Button>
        <Button type="submit" disabled={loading} className="h-12 px-8 rounded-xl font-black text-sm">
          {loading ? 'Salvando...' : 'Salvar Produto'}
        </Button>
      </div>
    </form>
  )
}