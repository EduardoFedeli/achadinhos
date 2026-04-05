import { getCategorias } from '@/lib/produtos'
import CategoriesPanel from '@/components/admin/CategoriesPanel'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export default async function CategoriasPage() {
  // 1. Busca as categorias básicas (emotes, nomes, slugs)
  const categoriasBase = await getCategorias()
  
  // 2. Conecta no Supabase usando a SERVICE_ROLE_KEY (Chave Mestre)
  // Isso garante que leremos TODOS os produtos para a contagem, pulando RLS.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // A chave secreta e segura do servidor
  )

  // 3. Busca apenas as colunas de categoria dos produtos
  const { data: produtos } = await supabase.from('produtos').select('categoriaSlugs')

  // 4. Faz a matemática da contagem (robusta contra formatos de array/texto)
  const categoriasComContagem = categoriasBase.map(cat => {
    const contagem = produtos?.filter(p => {
      if (!p.categoriaSlugs) return false;
      
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

  // 5. Manda para o componente visual novo
  return (
    <div>
      <CategoriesPanel categorias={categoriasComContagem} />
    </div>
  )
}