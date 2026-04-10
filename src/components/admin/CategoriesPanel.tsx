'use client'

import { useState } from 'react'
import { PlusCircle, Pencil, ExternalLink, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Categoria } from '@/types'
import CategoryFormModal from './CategoryFormModal'

interface CategoriaComQuantidade extends Categoria {
  quantidade: number
  imagem_url?: string
}

interface CategoriesPanelProps {
  categorias: CategoriaComQuantidade[]
}

export default function CategoriesPanel({ categorias }: CategoriesPanelProps) {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Categoria | undefined>()

  const categoriasFiltradas = categorias.filter(cat =>
    cat.nome.toLowerCase().includes(search.toLowerCase()) ||
    cat.slug.toLowerCase().includes(search.toLowerCase())
  )

  function handleOpenCreate() {
    setEditingCategory(undefined)
    setIsModalOpen(true)
  }

  function handleOpenEdit(cat: Categoria) {
    setEditingCategory(cat)
    setIsModalOpen(true)
  }

  // Gera as classes dinâmicas para as cores sem usar style inline
  const dynamicStyles = categoriasFiltradas.map(cat => `
    .cat-card-${cat.slug}:hover { border-color: ${cat.cor}; box-shadow: 0 0 20px ${cat.cor}30; }
    .cat-line-${cat.slug} { background-color: ${cat.cor}; }
    .group:hover .cat-text-${cat.slug} { color: ${cat.cor}; }
    .cat-badge-${cat.slug} { background-color: ${cat.cor}15; color: ${cat.cor}; border: 1px solid ${cat.cor}30; }
  `).join('\n')

  return (
    <div className="flex flex-col gap-5 h-full">
      <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />

      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#1A1A24] p-5 rounded-xl border border-[#2A2A35]">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Categorias ({categorias.length})</h1>
          <p className="text-muted-foreground text-sm">Gerencie os nichos dos produtos.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <Input 
              placeholder="Buscar categoria..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 bg-[#0F0F13] border-[#2A2A35] h-10 text-sm rounded-lg w-full focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
          <Button onClick={handleOpenCreate} className="bg-[#22C55E] text-black font-bold h-10 px-4 rounded-lg text-sm hover:bg-[#22C55E]/80 flex items-center gap-2 shrink-0">
            <PlusCircle size={16} />
            <span className="hidden sm:inline">Nova Categoria</span>
          </Button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categoriasFiltradas.map(cat => (
          <div 
            key={cat.slug} 
            className={`cat-card-${cat.slug} group relative bg-[#1A1A24] border border-[#2A2A35] rounded-xl p-4 pl-5 flex flex-col gap-4 transition-all duration-300`}
          >
            {/* Linha colorida lateral */}
            <div className={`cat-line-${cat.slug} absolute left-0 top-4 bottom-4 w-1.5 rounded-r-md`} />

            {/* Topo do Card */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center justify-center text-2xl shrink-0 w-10 h-10 bg-[#0F0F13] rounded-lg border border-[#2A2A35] overflow-hidden">
                  {cat.imagem_url ? (
                    <img src={cat.imagem_url} alt={cat.nome} className="w-full h-full object-contain p-1" />
                  ) : (
                    cat.emoji || '📁'
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className={`cat-text-${cat.slug} text-base font-bold text-white truncate leading-tight transition-colors`}>{cat.nome}</h3>
                  <p className="text-xs text-gray-500 truncate mt-0.5">/{cat.slug}</p>
                </div>
              </div>
              
              {/* Badge de Contagem */}
              <span 
                className={`cat-badge-${cat.slug} px-2.5 py-1 rounded-full text-xs font-black shrink-0`}
                title="Produtos Vinculados"
              >
                {cat.quantidade}
              </span>
            </div>

            {/* Ações */}
            <div className="grid grid-cols-2 gap-2 mt-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleOpenEdit(cat)}
                className="border-[#2A2A35] bg-[#0F0F13] hover:bg-[#2A2A35] hover:text-white rounded-lg h-8 gap-2 text-xs font-semibold transition-colors"
              >
                <Pencil size={14} />
                Editar
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                asChild
                className="bg-[#0F0F13] border border-transparent hover:border-[#2A2A35] hover:bg-white/5 hover:text-white rounded-lg h-8 gap-2 text-xs font-semibold transition-colors"
              >
                <a href={`/${cat.slug}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={14} />
                  Ver site
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {categoriasFiltradas.length === 0 && (
        <div className="text-center py-16 bg-[#1A1A24] rounded-xl border border-[#2A2A35]">
          <span className="text-4xl">🦖</span>
          <p className="mt-4 text-sm text-gray-500">Nenhuma categoria encontrada.</p>
        </div>
      )}

      <CategoryFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        category={editingCategory} 
      />
    </div>
  )
}