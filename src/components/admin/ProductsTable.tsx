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
import { Edit2, Trash2, Plus, Clock, RefreshCw, X, ChevronLeft, ChevronRight } from 'lucide-react'
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
  
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isProcessingBulk, setIsProcessingBulk] = useState(false)
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 10
  
  const router = useRouter()

  const isProdutoAntigo = (createdAt?: string) => {
    if (!createdAt) return true
    const dataCriacao = new Date(createdAt).getTime()
    const hoje = new Date().getTime()
    const diffDias = Math.ceil(Math.abs(hoje - dataCriacao) / (1000 * 60 * 60 * 24))
    return diffDias > 90
  }

  const produtosUnicos = Array.from(new Map(produtos.map(p => [p.id, p])).values())

  const filtered = produtosUnicos.filter(p => {
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase())
    const matchCat = !filtroCategoria || p.categoriaSlug === filtroCategoria
    const matchIdade = mostrarApenasAntigos ? isProdutoAntigo(p.createdAt) : true
    return matchBusca && matchCat && matchIdade
  })

  const totalPaginas = Math.ceil(filtered.length / itensPorPagina)
  const paginatedProdutos = filtered.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina)

  const handleBusca = (valor: string) => {
    setBusca(valor)
    setPaginaAtual(1)
  }
  const handleFiltroCategoria = (valor: string) => {
    setFiltroCategoria(valor)
    setPaginaAtual(1)
  }

  const paginatedIds = paginatedProdutos.map(p => p.id)
  const isAllSelected = paginatedIds.length > 0 && paginatedIds.every(id => selectedIds.includes(id))

  function toggleSelectAll() {
    if (isAllSelected) {
      setSelectedIds(selectedIds.filter(id => !paginatedIds.includes(id)))
    } else {
      const newIds = new Set([...selectedIds, ...paginatedIds])
      setSelectedIds(Array.from(newIds))
    }
  }

  function toggleSelectOne(id: string) {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  async function handleBulkAction(action: 'delete' | 'renew') {
    if (action === 'delete' && !confirm(`Tem certeza que deseja excluir ${selectedIds.length} produtos?`)) return
    
    setIsProcessingBulk(true)
    const res = await fetch('/api/produtos/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds, action })
    })

    if (res.ok) {
      setSelectedIds([])
      router.refresh()
    } else {
      alert('Erro ao processar ação em massa.')
    }
    setIsProcessingBulk(false)
  }

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
    <div className="space-y-4 relative">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Produtos ({produtosUnicos.length})</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex flex-col sm:flex-row flex-1 w-full lg:w-auto gap-3">
          <Input 
            placeholder="Buscar produto..." 
            value={busca} 
            onChange={e => handleBusca(e.target.value)}
            className="w-full sm:max-w-[240px] bg-background border-input text-foreground focus-visible:ring-primary" 
          />
          <select
            value={filtroCategoria}
            onChange={e => handleFiltroCategoria(e.target.value)}
            className="h-10 w-full sm:w-auto rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todas as categorias</option>
            {categorias.map(c => <option key={c.slug} value={c.slug}>{c.nome}</option>)}
          </select>
          
          <div className="flex items-center gap-2 px-1 sm:px-3 h-10">
            <Switch 
              id="filtro-antigos" 
              checked={mostrarApenasAntigos} 
              onCheckedChange={setMostrarApenasAntigos} 
            />
            <Label htmlFor="filtro-antigos" className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
              Limpa (+90 dias)
            </Label>
          </div>
        </div>
        
        <Button onClick={() => setAdicionando(true)} className="w-full lg:w-auto gap-2">
          <Plus size={16} /> Adicionar Produto
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto pb-14">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-border bg-background accent-primary cursor-pointer"
                  />
                </TableHead>
                <TableHead className="w-16 text-muted-foreground">Img</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Nome</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Categoria</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Preço</TableHead>
                <TableHead className="font-semibold text-muted-foreground">Desconto</TableHead>
                <TableHead className="text-center font-semibold text-muted-foreground">Status</TableHead>
                <TableHead className="text-right font-semibold text-muted-foreground">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProdutos.map(p => {
                const antigo = isProdutoAntigo(p.createdAt)
                const isSelected = selectedIds.includes(p.id)
                
                return (
                  <TableRow key={p.id} className={`border-border transition-colors group ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/50'}`}>
                    <TableCell className="text-center">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleSelectOne(p.id)}
                        className="w-4 h-4 rounded border-border bg-background accent-primary cursor-pointer"
                      />
                    </TableCell>
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
                        {p.categoriaNome} {p.categoriaSlug !== p.categoriaSlug ? '+ Outras' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-foreground">{formatarPreco(p.preco)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.desconto_pct ? `${p.desconto_pct}%` : '—'}</TableCell>
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
              
              {paginatedProdutos.length === 0 && (
                <TableRow className="hover:bg-transparent border-border">
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    Nenhum produto encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/10">
            <div className="text-sm text-muted-foreground hidden sm:block">
              Mostrando <span className="font-medium text-foreground">{(paginaAtual - 1) * itensPorPagina + 1}</span> até <span className="font-medium text-foreground">{Math.min(paginaAtual * itensPorPagina, filtered.length)}</span> de <span className="font-medium text-foreground">{filtered.length}</span> produtos
            </div>
            <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <Button variant="outline" size="sm" onClick={() => setPaginaAtual(p => Math.max(1, p - 1))} disabled={paginaAtual === 1} className="border-border hover:bg-accent text-foreground">
                <ChevronLeft size={16} /> Anterior
              </Button>
              <div className="flex items-center px-2 text-sm font-medium text-foreground sm:hidden">
                {paginaAtual} / {totalPaginas}
              </div>
              <Button variant="outline" size="sm" onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))} disabled={paginaAtual === totalPaginas} className="border-border hover:bg-accent text-foreground">
                Próxima <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-card border border-border shadow-2xl shadow-black/50 rounded-full px-6 py-3 flex items-center gap-4 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <Badge variant="secondary" className="text-sm px-3 py-1 bg-secondary text-foreground rounded-full">{selectedIds.length} selecionados</Badge>
          <div className="h-6 w-px bg-border"></div>
          <Button size="sm" variant="outline" onClick={() => handleBulkAction('renew')} disabled={isProcessingBulk} className="border-border hover:bg-primary/10 hover:text-primary gap-2">
            <RefreshCw size={14} className={isProcessingBulk ? "animate-spin" : ""} /> Renovar Datas
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')} disabled={isProcessingBulk} className="gap-2">
            <Trash2 size={14} /> Excluir
          </Button>
          <div className="h-6 w-px bg-border ml-2"></div>
          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground" onClick={() => setSelectedIds([])}><X size={16} /></Button>
        </div>
      )}

      <Dialog open={!!editando} onOpenChange={() => setEditando(null)}>
        {/* CORREÇÃO: p-4 ou sm:p-6 (era p-8) diminui o respiro interno para caber na tela */}
        <DialogContent className="sm:max-w-[1000px] w-[95vw] max-h-[95vh] overflow-y-auto bg-[#0F0F13] border-[#2A2A35] text-foreground p-4 sm:p-6">
          <DialogHeader><DialogTitle className="text-xl font-black mb-2">Editar produto</DialogTitle></DialogHeader>
          {editando && <ProductForm categorias={categorias} produto={editando} onSave={handleSaved} onCancel={() => setEditando(null)} />}
        </DialogContent>
      </Dialog>

      <Dialog open={adicionando} onOpenChange={setAdicionando}>
        {/* CORREÇÃO: p-4 ou sm:p-6 (era p-8) diminui o respiro interno para caber na tela */}
        <DialogContent className="sm:max-w-[1000px] w-[95vw] max-h-[95vh] overflow-y-auto bg-[#0F0F13] border-[#2A2A35] text-foreground p-4 sm:p-6">
          <DialogHeader><DialogTitle className="text-xl font-black mb-2">Adicionar produto</DialogTitle></DialogHeader>
          <ProductForm categorias={categorias} onSave={handleSaved} onCancel={() => setAdicionando(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}