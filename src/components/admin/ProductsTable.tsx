'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Edit2, Trash2, Plus, X, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import ProductForm from './ProductForm'
import type { Produto, Categoria } from '@/types'
import { formatarPreco } from '@/lib/produtos'

// Substitua o bloco da interface ProdutoComCategoria (linhas 15 a 21) por este:
interface ProdutoComCategoria extends Omit<Produto, 'loja' | 'lojaOrigem'> {
  categoriaSlug: string
  categoriaSlugs?: string[] 
  categoriaNome: string
  lojaOrigem?: string | null
  loja?: string | null
}

interface ProductsTableProps {
  produtos: ProdutoComCategoria[]
  categorias: Categoria[]
}

export default function ProductsTable({ produtos, categorias }: ProductsTableProps) {
  // Estados "Rascunho"
  const [inputBusca, setInputBusca] = useState('')
  const [inputCat, setInputCat] = useState('')
  const [inputStatus, setInputStatus] = useState('')
  const [inputLoja, setInputLoja] = useState('') // Novo Rascunho

  // Estados Oficiais 
  const [busca, setBusca] = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('') 
  const [filtroLoja, setFiltroLoja] = useState('') // Novo Filtro Oficial

  const [editando, setEditando] = useState<ProdutoComCategoria | null>(null)
  const [adicionando, setAdicionando] = useState(false)
  
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isProcessingBulk, setIsProcessingBulk] = useState(false)
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState(10)
  
  const router = useRouter()
  const produtosUnicos = Array.from(new Map(produtos.map(p => [p.id, p])).values())

  // Derivar lojas únicas dinamicamente a partir dos produtos já carregados
  
  const lojasDisponiveis = useMemo(() => {
    const lojas = new Set<string>();
    produtosUnicos.forEach(p => {
      const lojaNome = p.lojaOrigem || p.loja;
      if (lojaNome) lojas.add(lojaNome.toLowerCase());
    });
    return Array.from(lojas).sort();
  }, [produtosUnicos]);

  const aplicarFiltros = () => {
    setBusca(inputBusca)
    setFiltroCategoria(inputCat)
    setFiltroStatus(inputStatus)
    setFiltroLoja(inputLoja) // Aplica o filtro de loja
    setPaginaAtual(1)
  }

  const filtered = produtosUnicos.filter(p => {
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase())
    const matchCat = !filtroCategoria || 
                     p.categoriaSlug === filtroCategoria || 
                     (p.categoriaSlugs && p.categoriaSlugs.includes(filtroCategoria))
    const matchStatus = 
      filtroStatus === '' ? true :
      filtroStatus === 'destaque' ? p.destaque :
      filtroStatus === 'novo' ? p.novo : true
    
    // Novo Matcher de Loja
    const pLoja = (p.lojaOrigem || p.loja || '').toLowerCase();
    const matchLoja = !filtroLoja || pLoja === filtroLoja.toLowerCase()

    return matchBusca && matchCat && matchStatus && matchLoja
  })

  const totalPaginas = Math.ceil(filtered.length / itensPorPagina)
  const paginatedProdutos = filtered.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina)
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

  async function handleBulkAction(action: 'delete') {
    if (action === 'delete' && !confirm(`Tem certeza que deseja excluir ${selectedIds.length} produtos permanentemente?`)) return
    
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
    <div className="space-y-4">
      {/* HEADER & FILTROS */}
      <div className="flex flex-col xl:flex-row justify-between gap-4 bg-[#1A1A24] p-3 rounded-xl border border-[#2A2A35]">
        
        <div className="flex flex-wrap md:flex-nowrap items-center gap-2 flex-1">
          <h2 className="text-lg font-black text-white mr-2 whitespace-nowrap">Produtos <span className="text-[#8E8E9F] text-sm font-medium">({produtosUnicos.length})</span></h2>
          
          <Input 
            placeholder="Buscar..." 
            value={inputBusca} 
            onChange={e => setInputBusca(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && aplicarFiltros()}
            className="w-full md:w-40 h-8 text-xs bg-[#0F0F13] border-[#2A2A35]" 
          />
          
          <select
            aria-label="Filtrar por categoria"
            value={inputCat}
            onChange={e => setInputCat(e.target.value)}
            className="h-8 w-full md:w-32 rounded-md border border-[#2A2A35] bg-[#0F0F13] px-2 text-xs text-[#8E8E9F] outline-none"
          >
            <option value="">Todas Categorias</option>
            {categorias.map(c => <option key={c.slug} value={c.slug}>{c.nome}</option>)}
          </select>

          {/* 👇 NOVO: Select de Lojas Derivadas */}
          <select
            aria-label="Filtrar por loja"
            value={inputLoja}
            onChange={e => setInputLoja(e.target.value)}
            className="h-8 w-full md:w-32 rounded-md border border-[#2A2A35] bg-[#0F0F13] px-2 text-xs text-[#8E8E9F] outline-none uppercase"
          >
            <option value="">Todas Lojas</option>
            {lojasDisponiveis.map(loja => (
              <option key={loja} value={loja}>{loja}</option>
            ))}
          </select>

          <select
            aria-label="Filtrar por status"
            value={inputStatus}
            onChange={e => setInputStatus(e.target.value)}
            className="h-8 w-full md:w-28 rounded-md border border-[#2A2A35] bg-[#0F0F13] px-2 text-xs text-[#8E8E9F] outline-none"
          >
            <option value="">Todos Status</option>
            <option value="destaque">Destaques</option>
            <option value="novo">Novos</option>
          </select>

          <Button onClick={aplicarFiltros} className="h-8 px-3 text-xs bg-[#3B82F6] hover:bg-[#3B82F6]/80 text-white w-full md:w-auto shrink-0">
            <Filter size={12} className="mr-1" /> Aplicar
          </Button>
        </div>

        <Button onClick={() => setAdicionando(true)} className="h-8 px-4 text-xs bg-[#22C55E] hover:bg-[#22C55E]/80 text-[#0F0F13] font-bold shrink-0 w-full xl:w-auto">
          <Plus size={14} className="mr-1" /> Adicionar
        </Button>
      </div>

      {/* TABELA */}
      <div className="rounded-xl border border-[#2A2A35] bg-[#1A1A24] overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#0F0F13]/50">
              <TableRow className="border-[#2A2A35]">
                <TableHead className="w-10 text-center py-3 px-2">
                  <input 
                    type="checkbox" checked={isAllSelected} onChange={toggleSelectAll}
                    aria-label="Selecionar todos os produtos desta página"
                    className="w-3 h-3 rounded border-[#2A2A35] bg-[#0F0F13] accent-[#22C55E] cursor-pointer"
                  />
                </TableHead>
                <TableHead className="w-12 py-3 px-2 text-xs font-semibold text-[#8E8E9F]">Img</TableHead>
                <TableHead className="py-3 px-2 text-xs font-semibold text-[#8E8E9F]">Nome do Produto</TableHead>
                <TableHead className="py-3 px-2 text-xs font-semibold text-[#8E8E9F]">Categoria</TableHead>
                <TableHead className="py-3 px-2 text-xs font-semibold text-[#8E8E9F]">Loja</TableHead>
                <TableHead className="py-3 px-2 text-xs font-semibold text-[#8E8E9F]">Preço</TableHead>
                <TableHead className="text-center py-3 px-2 text-xs font-semibold text-[#8E8E9F]">Status</TableHead>
                <TableHead className="text-right py-3 px-2 text-xs font-semibold text-[#8E8E9F] pr-4">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProdutos.map(p => {
                const isSelected = selectedIds.includes(p.id)
                const categoriasCount = p.categoriaSlugs?.length || 1;
                const lojaDisplay = p.lojaOrigem || p.loja || '—';
                
                return (
                  <TableRow key={p.id} className={`border-[#2A2A35] transition-all group ${isSelected ? 'bg-[#22C55E]/10' : 'hover:bg-[#0F0F13]/40'}`}>
                    <TableCell className="text-center py-3 px-2">
                      <input 
                        type="checkbox" checked={isSelected} onChange={() => toggleSelectOne(p.id)}
                        aria-label={`Selecionar produto ${p.nome}`}
                        className="w-3 h-3 rounded border-[#2A2A35] bg-[#0F0F13] accent-[#22C55E] cursor-pointer"
                      />
                    </TableCell>
                    <TableCell className="py-3 px-2">
                      {p.imagem ? (
                        <img src={p.imagem} alt="" className="h-8 w-8 rounded object-cover border border-[#2A2A35] bg-white" />
                      ) : (
                        <div className="h-8 w-8 rounded bg-[#0F0F13] flex items-center justify-center text-xs border border-[#2A2A35]">
                          {categorias.find(c => c.slug === p.categoriaSlug)?.emoji ?? '?'}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-3 px-2">
                      <p className="text-xs font-bold text-white line-clamp-1 max-w-[200px]">{p.nome}</p>
                    </TableCell>
                    <TableCell className="py-3 px-2">
                      <Badge variant="outline" className="border-[#2A2A35] text-[#8E8E9F] bg-[#0F0F13] text-[10px] py-0 h-5">
                        {p.categoriaNome} {categoriasCount > 1 ? `+${categoriasCount - 1}` : ''}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="py-3 px-2">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-[#0F0F13] px-2 py-0.5 rounded border border-[#2A2A35]">
                         {lojaDisplay}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-2 text-xs font-black text-[#22C55E]">
                      {formatarPreco(p.preco)}
                      {p.desconto_pct && <span className="ml-1 text-[9px] text-[#8E8E9F] font-normal line-through">(-{p.desconto_pct}%)</span>}
                    </TableCell>
                    <TableCell className="text-center py-3 px-2">
                      <div className="flex gap-1 justify-center">
                        {p.destaque && <span className="bg-[#F97316]/20 text-[#F97316] text-[9px] font-bold px-1.5 py-0.5 rounded">Dest</span>}
                        {p.novo && <span className="bg-[#3B82F6]/20 text-[#3B82F6] text-[9px] font-bold px-1.5 py-0.5 rounded">Novo</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-3 px-2 pr-4">
                      <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" onClick={() => setEditando(p)} aria-label="Editar" className="h-6 w-6 text-[#8E8E9F] hover:text-white hover:bg-[#2A2A35]">
                          <Edit2 size={12} aria-hidden="true" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)} aria-label="Excluir" className="h-6 w-6 text-[#8E8E9F] hover:text-[#FF3838] hover:bg-[#FF3838]/10">
                          <Trash2 size={12} aria-hidden="true" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {paginatedProdutos.length === 0 && (
                <TableRow className="border-[#2A2A35]">
                  <TableCell colSpan={8} className="h-24 text-center text-xs text-[#8E8E9F]">Nenhum produto encontrado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* PAGINAÇÃO COM SELETOR DE ITENS */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-3 py-3 border-t border-[#2A2A35] bg-[#0F0F13] gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
              <div className="text-[11px] text-[#8E8E9F]">
                Exibindo <span className="font-bold text-white">{(paginaAtual - 1) * itensPorPagina + 1}</span> - <span className="font-bold text-white">{Math.min(paginaAtual * itensPorPagina, filtered.length)}</span> de <span className="font-bold text-white">{filtered.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#8E8E9F]">Por página:</span>
                <select
                  aria-label="Linhas por página"
                  value={itensPorPagina}
                  onChange={(e) => {
                    setItensPorPagina(Number(e.target.value))
                    setPaginaAtual(1)
                  }}
                  className="bg-[#1A1A24] text-white font-bold text-[11px] border border-[#2A2A35] rounded px-1.5 py-1 outline-none focus:border-[#3B82F6] cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={40}>40</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {totalPaginas > 1 && (
              <div className="flex gap-1 w-full sm:w-auto justify-between sm:justify-end">
                <Button variant="ghost" size="sm" onClick={() => setPaginaAtual(p => Math.max(1, p - 1))} disabled={paginaAtual === 1} className="h-6 text-[11px] text-[#8E8E9F] hover:text-white">
                  <ChevronLeft size={12} className="mr-1" /> Ant
                </Button>
                <div className="flex items-center px-2 text-[11px] font-bold text-white sm:hidden">{paginaAtual} / {totalPaginas}</div>
                <Button variant="ghost" size="sm" onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))} disabled={paginaAtual === totalPaginas} className="h-6 text-[11px] text-[#8E8E9F] hover:text-white">
                  Próx <ChevronRight size={12} className="ml-1" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* POPUP DE AÇÃO EM MASSA */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0F0F13] border border-[#FF3838]/50 shadow-[0_0_20px_rgba(255,56,56,0.2)] rounded-full px-4 py-2 flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5">
          <span className="text-[11px] font-black text-white px-2">{selectedIds.length} Itens</span>
          <div className="h-4 w-px bg-[#2A2A35]"></div>
          <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')} disabled={isProcessingBulk} className="h-7 text-[11px] px-3 font-bold bg-[#FF3838] hover:bg-[#FF3838]/80 text-white">
            <Trash2 size={12} aria-hidden="true" className={`mr-1 ${isProcessingBulk ? "animate-pulse" : ""}`} /> 
            {isProcessingBulk ? "Apagando..." : "Excluir Definitivo"}
          </Button>
          <div className="h-4 w-px bg-[#2A2A35]"></div>
          <button type="button" aria-label="Limpar seleção" className="text-[#8E8E9F] hover:text-white transition-colors" onClick={() => setSelectedIds([])}><X size={14} aria-hidden="true" /></button>
        </div>
      )}

      {/* MODAIS */}
      <Dialog open={!!editando} onOpenChange={() => setEditando(null)}>
        <DialogContent className="sm:max-w-[1000px] w-[95vw] max-h-[95vh] overflow-y-auto bg-[#0F0F13] border-[#2A2A35] text-foreground p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-black mb-2 text-white">Editar produto</DialogTitle>
            <DialogDescription className="hidden">Formulário de edição de produto</DialogDescription>
          </DialogHeader>
          {editando && <ProductForm categorias={categorias} produto={editando as any} onSave={handleSaved} onCancel={() => setEditando(null)} />}
        </DialogContent>
      </Dialog>

      <Dialog open={adicionando} onOpenChange={setAdicionando}>
        <DialogContent className="sm:max-w-[1000px] w-[95vw] max-h-[95vh] overflow-y-auto bg-[#0F0F13] border-[#2A2A35] text-foreground p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-black mb-2 text-white">Adicionar produto</DialogTitle>
            <DialogDescription className="hidden">Formulário de adição de produto</DialogDescription>
          </DialogHeader>
          <ProductForm categorias={categorias} onSave={handleSaved} onCancel={() => setAdicionando(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}