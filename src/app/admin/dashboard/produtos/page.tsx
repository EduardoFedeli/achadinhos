import { getCategorias } from "@/lib/produtos";
import ProductsTable from "@/components/admin/ProductsTable";
import { createClient } from "@supabase/supabase-js";

// CRÍTICO: Diz para o Next.js NUNCA fazer cache dessa página, para você sempre ver os produtos novos na hora.
export const dynamic = "force-dynamic";

export default async function ProdutosPage() {
  // 1. Continua puxando as categorias do JSON (para manter as cores e emojis)
  const categorias = await getCategorias();

  // 2. Conecta no Supabase direto pelo servidor
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 3. Busca os produtos reais do banco de dados
  const { data: produtosSupabase, error } = await supabase
    .from("produtos")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Erro ao buscar produtos:", error);
  }

  // 4. Faz o "De/Para" dos dados do Supabase para o formato que a sua tabela já conhece
  const produtos = (produtosSupabase || []).map((p) => {
    // Pega a primeira categoria do array (já que agora o banco suporta múltiplas)
    const slugPrincipal =
      p.categoriaSlugs && p.categoriaSlugs.length > 0
        ? p.categoriaSlugs[0]
        : "";
    const categoriaInfo = categorias.find((c) => c.slug === slugPrincipal);

    return {
      ...p,
      categoriaSlug: slugPrincipal,
      categoriaNome: categoriaInfo ? categoriaInfo.nome : "Sem Categoria",
    };
  });

  return (
    <div>
      <ProductsTable produtos={produtos} categorias={categorias} />
    </div>
  );
}
