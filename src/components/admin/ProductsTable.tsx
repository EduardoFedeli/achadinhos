'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Edit2, Trash2, Plus, Clock } from 'lucide-react'
import ProductForm from './ProductForm'
import type { Produto, Categoria } from '@/types'
import { formatarPreco } from '@/lib/produtos'

interface ProdutoComCategoria extends Produto {
  categoriaSlug: string
  categoriaNome: string
}

interface ProductsTableProps {
  produtos: ProdutoComCategoria[]
  categorias: Categoria[]
}

export default function ProductsTable({ produtos, categorias }: ProductsTableProps) {
  const [busca, setBusca] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [mostrarApenasAntigos, setMostrarApenasAntigos] = useState(false)
  const [editando, setEditando] = useState<ProdutoComCategoria | null>(null)
  const [adicionando, setAdicionando] = useState(false)
  const router = useRouter()

  // Função para verificar se o produto tem +90 dias ou não tem data registrada
  const isProdutoAntigo = (createdAt?: string) => {
    if (!createdAt) return true // Produtos legados sem data são considerados antigos
    const dataCriacao = new Date(createdAt).getTime()
    const hoje = new Date().getTime()
    const diffDias = Math.ceil(Math.abs(hoje - dataCriacao) / (1000 * 60 * 60 * 24))
    return diffDias > 90
  }

  const filtered = produtos.filter(p => {
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase())
    const matchCat = !filtroCategoria || p.categoriaSlug === filtroCategoria
    const matchIdade = mostrarApenasAntigos ? isProdutoAntigo(p.createdAt) : true
    
    return matchBusca && matchCat && matchIdade
  })

  async function handleDelete(id: string) {
    if (!confirm('Remover produto definitivamente?')) return
    await fetch(`/api/produtos/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  function handleSaved() {
    setEditando(null)
    setAdicionando(false)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {/* Header e Título transferidos para dentro do componente para garantir o text-foreground */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Produtos ({produtos.length})</h2>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row flex-1 w-full lg:w-auto gap-3">
          <Input 
            placeholder="Buscar produto..." 
            value={busca} 
            onChange={e => setBusca(e.target.value)} 
            className="w-full sm:max-w-[240px] bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary" 
          />
          <select
            value={filtroCategoria}
            onChange={e => setFiltroCategoria(e.target.value)}
            className="h-10 w-full sm:w-auto rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Todas as categorias</option>
            {categorias.map(c => <option key={c.slug} value={c.slug}>{c.nome}</option>)}
          </select>
          
          {/* Toggle de Auditoria */}
          <div className="flex items-center gap-2 px-1 sm:px-3 h-10">
            <Switch 
              id="filtro-antigos" 
              checked={mostrarApenasAntigos} 
              onCheckedChange={setMostrarApenasAntigos} 
            />
            <Label htmlFor="filtro-antigos" className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
              Limpa (+90 dias)
            </Label>
          </div>
        </div>
        
        <Button onClick={() => setAdicionando(true)} className="w-full lg:w-auto gap-2">
          <Plus size={16} /> Adicionar Produto
        </Button>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-16 text-muted-foreground">Img</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Nome</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Categoria</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Preço</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Desconto</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Loja</TableHead>
                <TableHead className="text-center font-semibold text-muted-foreground">Status</TableHead>
                <TableHead className="text-right font-semibold text-muted-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => {
                const antigo = isProdutoAntigo(p.createdAt)
                return (
                  <TableRow key={p.id} className="border-border hover:bg-muted/50 transition-colors group">
                    <TableCell>
                      {p.imagem ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.imagem} alt="" className="h-10 w-10 rounded-md object-cover border border-border" />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-xl border border-border">
                          {categorias.find(c => c.slug === p.categoriaSlug)?.emoji ?? '?'}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px] text-sm text-foreground">
                      <p className="truncate font-medium">{p.nome}</p>
                      {antigo && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-destructive mt-1 font-semibold">
                          <Clock size={10} /> +90 DIAS
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-secondary text-secondary-foreground font-normal">
                        {p.categoriaNome}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-foreground">{formatarPreco(p.preco)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.desconto_pct ? `${p.desconto_pct}%` : '—'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground capitalize">{p.loja}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-1 justify-center">
                        {p.destaque && <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30 border-transparent text-xs">Dest.</Badge>}
                        {p.novo && <Badge variant="outline" className="border-border text-foreground text-xs">Novo</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" onClick={() => setEditando(p)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Edit2 size={16} />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              
              {filtered.length === 0 && (
                <TableRow className="hover:bg-transparent border-border">
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    Nenhum produto encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!editando} onOpenChange={() => setEditando(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border text-foreground">
          <DialogHeader><DialogTitle>Editar produto</DialogTitle></DialogHeader>
          {editando && <ProductForm categorias={categorias} produto={editando} onSave={handleSaved} onCancel={() => setEditando(null)} />}
        </DialogContent>
      </Dialog>

      <Dialog open={adicionando} onOpenChange={setAdicionando}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border text-foreground">
          <DialogHeader><DialogTitle>Adicionar produto</DialogTitle></DialogHeader>
          <ProductForm categorias={categorias} onSave={handleSaved} onCancel={() => setAdicionando(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}