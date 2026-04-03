'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
  const [editando, setEditando] = useState<ProdutoComCategoria | null>(null)
  const [adicionando, setAdicionando] = useState(false)
  const router = useRouter()

  const filtered = produtos.filter(p => {
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase())
    const matchCat = !filtroCategoria || p.categoriaSlug === filtroCategoria
    return matchBusca && matchCat
  })

  async function handleDelete(id: string) {
    if (!confirm('Remover produto?')) return
    await fetch(`/api/produtos/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  function handleSaved() {
    setEditando(null)
    setAdicionando(false)
    router.refresh()
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <Input placeholder="Buscar produto..." value={busca} onChange={e => setBusca(e.target.value)} className="max-w-xs" />
        <select
          value={filtroCategoria}
          onChange={e => setFiltroCategoria(e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">Todas as categorias</option>
          {categorias.map(c => <option key={c.slug} value={c.slug}>{c.nome}</option>)}
        </select>
        <Button onClick={() => setAdicionando(true)}>+ Adicionar produto</Button>
      </div>

      <div className="rounded-xl border bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Img</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Desc.</TableHead>
              <TableHead>Loja</TableHead>
              <TableHead>Dest.</TableHead>
              <TableHead>Novo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(p => (
              <TableRow key={p.id}>
                <TableCell>
                  {p.imagem
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={p.imagem} alt="" className="h-8 w-8 rounded object-cover" />
                    : <span className="text-lg">{categorias.find(c => c.slug === p.categoriaSlug)?.emoji ?? '?'}</span>
                  }
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-sm font-medium">{p.nome}</TableCell>
                <TableCell className="text-sm">{p.categoriaNome}</TableCell>
                <TableCell className="text-sm">{formatarPreco(p.preco)}</TableCell>
                <TableCell className="text-sm">{p.desconto_pct ? `${p.desconto_pct}%` : '—'}</TableCell>
                <TableCell className="text-sm">{p.loja}</TableCell>
                <TableCell>{p.destaque ? '✓' : '—'}</TableCell>
                <TableCell>{p.novo ? '✓' : '—'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="outline" onClick={() => setEditando(p)}>Editar</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>Remover</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editando} onOpenChange={() => setEditando(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Editar produto</DialogTitle></DialogHeader>
          {editando && <ProductForm categorias={categorias} produto={editando} onSave={handleSaved} onCancel={() => setEditando(null)} />}
        </DialogContent>
      </Dialog>

      <Dialog open={adicionando} onOpenChange={setAdicionando}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Adicionar produto</DialogTitle></DialogHeader>
          <ProductForm categorias={categorias} onSave={handleSaved} onCancel={() => setAdicionando(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
