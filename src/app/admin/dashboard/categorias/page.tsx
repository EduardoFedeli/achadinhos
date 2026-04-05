import { getCategorias } from '@/lib/produtos'
import CategoriesPanel from '@/components/admin/CategoriesPanel'
import { createClient } from '@supabase/supabase-js'

// ... (imports permanecem iguais)

export default async function CategoriasPage() {
  const categoriasBase = await getCategorias()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const { data: produtos } = await supabase.from('produtos').select('categoriaSlugs')

  const categorias = categoriasBase.map(cat => {
    // Filtra produtos que CONTÊM o slug da categoria atual no array de slugs
    const contagem = produtos?.filter(p => {
      if (!p.categoriaSlugs) return false;
      // Garante que estamos lidando com um array e remove espaços extras
      const slugs = Array.isArray(p.categoriaSlugs) ? p.categoriaSlugs : [];
      return slugs.includes(cat.slug);
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