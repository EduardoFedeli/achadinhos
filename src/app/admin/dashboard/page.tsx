import { createClient } from '@supabase/supabase-js'
import { getCategorias } from '@/lib/produtos'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const categorias = getCategorias()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const { data: produtos } = await supabase.from('produtos').select('id, precoOriginal, preco')
  
  const totalProdutos = produtos?.length || 0
  const emOferta = produtos?.filter(p => p.precoOriginal && p.precoOriginal > p.preco).length || 0

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-card p-6 rounded-2xl border border-border">
        <p className="text-muted-foreground text-sm">Categorias</p>
        <h3 className="text-4xl font-black">{categorias.length}</h3>
      </div>
      <div className="bg-card p-6 rounded-2xl border border-border">
        <p className="text-muted-foreground text-sm">Produtos Únicos</p>
        <h3 className="text-4xl font-black">{totalProdutos}</h3>
      </div>
      <div className="bg-card p-6 rounded-2xl border border-border">
        <p className="text-muted-foreground text-sm">Em oferta</p>
        <h3 className="text-4xl font-black">{emOferta}</h3>
      </div>
    </div>
  )
}