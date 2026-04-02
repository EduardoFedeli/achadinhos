import { getCategorias, getProdutosOferta } from '@/lib/produtos'

export default function DashboardPage() {
  const categorias = getCategorias()
  const totalProdutos = categorias.reduce((acc, c) => acc + c.produtos.length, 0)
  const emOferta = getProdutosOferta().length

  const stats = [
    { label: 'Categorias', value: categorias.length, emoji: '📂' },
    { label: 'Produtos', value: totalProdutos, emoji: '📦' },
    { label: 'Em oferta', value: emOferta, emoji: '💰' },
  ]

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl bg-white border border-gray-200 p-5">
            <p className="text-3xl">{s.emoji}</p>
            <p className="mt-2 text-3xl font-black text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
