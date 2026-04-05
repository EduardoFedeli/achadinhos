import { getCategorias } from '@/lib/produtos'
import CategoriesPanel from '@/components/admin/CategoriesPanel'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export default async function CategoriasPage() {
  const categoriasBase = await getCategorias() // O await que faltava!
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  // Busca todos os produtos para contar
  const { data: produtos } = await supabase.from('produtos').select('categoriaSlugs')

  // Adiciona a contagem real em cada categoria
  const categorias = categoriasBase.map(cat => ({
    ...cat,
    quantidade: produtos?.filter(p => p.categoriaSlugs?.includes(cat.slug)).length || 0
  }))

  return (
    <div>
      <CategoriesPanel categorias={categorias} />
    </div>
  )
}