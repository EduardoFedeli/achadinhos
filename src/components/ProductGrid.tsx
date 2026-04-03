// src/components/ProductGrid.tsx
import ProductCard from './ProductCard'
import type { Produto, Categoria } from '@/types'

interface ProductGridProps {
  produtos: Produto[]
  categorias: Categoria[]
}

export default function ProductGrid({ produtos, categorias }: ProductGridProps) {
  const catPorIdProduto = new Map<string, Categoria>()
  for (const cat of categorias) {
    for (const p of cat.produtos) {
      catPorIdProduto.set(p.id, cat)
    }
  }

  return (
    // Removidas as classes scrollbar-thin, scrollbar-thumb, etc.
    // Adicionado scrollbar-hide (precisa do plugin tailwind-scrollbar-hide ou CSS customizado)
    <div className="flex gap-3 md:gap-4 px-4 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {produtos.map(produto => {
        const categoria = catPorIdProduto.get(produto.id) ?? categorias[0]
        return (
          <div key={produto.id} className="min-w-[160px] md:min-w-[220px] shrink-0 snap-start">
            <ProductCard produto={produto} categoria={categoria} />
          </div>
        )
      })}
    </div>
  )
}