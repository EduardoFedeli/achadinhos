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
    <div className="grid grid-cols-2 gap-3 px-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-4 lg:gap-5">
      {produtos.map(produto => {
        const categoria = catPorIdProduto.get(produto.id) ?? categorias[0]
        return (
          <ProductCard key={produto.id} produto={produto} categoria={categoria} />
        )
      })}
    </div>
  )
}
