import type { Metadata } from "next";
import { getCategorias } from "@/lib/produtos";
import Header from "@/components/Header";
import CategoriaContent from "@/app/[categoria]/CategoriaContent";
import type { Categoria } from "@/types";
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Explorar Ofertas — T-Hex Indica",
  description:
    "Navegue por todos os achadinhos do T-Hex, filtre como quiser e encontre os melhores preços.",
};

export default async function ExplorarPage() {
  const categoriasReais = await getCategorias();
   
   // Conecta no banco e pega todos os produtos
   const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
   const { data: produtosRaw } = await supabase.from('produtos').select('*').order('createdAt', { ascending: false });
   
   const todosProdutosBrutos = produtosRaw || [];

  const unicos = new Map();
  todosProdutosBrutos.forEach((p) => {
    if (!unicos.has(p.id)) {
      unicos.set(p.id, p);
    }
  });
  const produtosUnicos = Array.from(unicos.values());

  // 2. Embaralhamos os produtos únicos para sempre parecer fresco
  const produtosMisturados = [...produtosUnicos].sort(
    () => Math.random() - 0.5,
  );

  // 3. Criamos uma categoria "Fantasma" apenas para alimentar o componente
  const categoriaExplorar: Categoria = {
    nome: "Explorar Tudo",
    slug: "explorar",
    emoji: "🌍",
    cor: "#22C55E", // Jade Green da marca
    descricao:
      "Todos os produtos. Use os filtros ao lado para caçar do seu jeito.",
    produtos: produtosMisturados,
  };

  return (
    <div className="min-h-screen bg-[#0F0F13] flex flex-col">
      <Header />
      <main className="w-full max-w-7xl mx-auto flex-1 px-4 md:px-8 mt-6">
        {/* Usamos o mesmíssimo componente de filtros que já construímos! */}
        <CategoriaContent
          cat={categoriaExplorar}
          todasCategorias={categoriasReais}
        />
      </main>
    </div>
  );
}
