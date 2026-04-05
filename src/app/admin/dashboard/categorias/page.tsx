import { getCategorias } from '@/lib/produtos'
import CategoriesPanel from '@/components/admin/CategoriesPanel'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export default async function CategoriasPage() {
  const categoriasBase = await getCategorias()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const { data: produtos } = await supabase.from('produtos').select('categoriaSlugs')

  const categorias = categoriasBase.map(cat => {
    const contagem = produtos?.filter(p => {
      if (!p.categoriaSlugs) return false;
      
      // Converte o formato do banco para um Array que o JavaScript entende perfeitamente
      let slugsArray = [];
      if (Array.isArray(p.categoriaSlugs)) {
        slugsArray = p.categoriaSlugs;
      } else if (typeof p.categoriaSlugs === 'string') {
        try { slugsArray = JSON.parse(p.categoriaSlugs); } catch (e) {}
      }

      return slugsArray.includes(cat.slug);
    }).length || 0;

    return {
      ...cat,
      quantidade: contagem
    }
  })

  return (
    <div>
      <CategoriesPanel categorias={categorias} />
    </div>
  )
}