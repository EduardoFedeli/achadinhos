import { getCategorias } from '@/lib/produtos'
import CategoriesPanel from '@/components/admin/CategoriesPanel'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export default async function CategoriasPage() {
  // 1. Busca as categorias básicas
  const categoriasBase = await getCategorias()
  
  // 2. Conecta no Supabase usando a SERVICE_ROLE_KEY
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 3. CORREÇÃO CRÍTICA: Pedir uma coluna que não existe quebra a query inteira.
  // Selecionamos estritamente a coluna nova que vimos que existe (categoriaSlugs).
  // Também extraímos o 'error' para não silenciar falhas do banco.
  const { data: produtos, error } = await supabase
    .from('produtos')
    .select('categoriaSlugs')

  // Se o Supabase rejeitar a query, isso vai gritar no seu terminal
  if (error) {
    console.error("🚨 ERRO SUPABASE NA CONTAGEM DAS CATEGORIAS:", error.message)
  }

  // 4. Faz a matemática da contagem blindada
  const categoriasComContagem = categoriasBase.map(cat => {
    // Usamos (produtos || []) para garantir que não quebre o filter se a query falhar
    const contagem = (produtos || []).filter(p => {
      let slugsArray: string[] = [];
      
      // Checa o formato (Array nativo do Postgres)
      if (Array.isArray(p.categoriaSlugs)) {
        slugsArray = p.categoriaSlugs;
      } else if (typeof p.categoriaSlugs === 'string') {
        try { slugsArray = JSON.parse(p.categoriaSlugs); } catch (e) {}
      }

      // Valida se o slug da categoria atual está dentro do array de categorias deste produto
      return slugsArray.includes(cat.slug);
    }).length;

    return {
      ...cat,
      quantidade: contagem
    }
  })

  // 5. Manda para o componente visual
  return (
    <div>
      <CategoriesPanel categorias={categoriasComContagem} />
    </div>
  )
}