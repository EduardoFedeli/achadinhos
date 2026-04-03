import { getCategorias } from '@/lib/produtos'
import ProductsTable from '@/components/admin/ProductsTable'

export default function ProdutosPage() {
  const categorias = getCategorias()

  const produtos = categorias.flatMap(cat =>
    cat.produtos.map(p => ({
      ...p,
      categoriaSlug: cat.slug,
      categoriaNome: cat.nome,
    }))
  )

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Produtos ({produtos.length})</h1>
      <ProductsTable produtos={produtos} categorias={categorias} />
    </div>
  )
}
