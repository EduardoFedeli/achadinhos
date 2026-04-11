/**
 * DASHBOARD ADMINISTRATIVO - T-HEX INDICA
 * Focado em métricas de conversão e saúde do catálogo.
 */

import { createClient } from "@supabase/supabase-js";
import { getCategorias } from "@/lib/produtos";
import { 
  Package, Tags, TrendingDown, Star, 
  Activity, Trophy, LineChart 
} from "lucide-react";
import AnalyticsChart from "@/components/admin/AnalyticsChart";

// Força a revalidação dos dados a cada acesso no Admin
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Inicialização do cliente Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // -------------------------------------------------------------------------
  // 1. DATA FETCHING (Busca de Dados)
  // -------------------------------------------------------------------------
  const [
    { data: categorias }, 
    { data: produtos }, 
    { data: clicksData }
  ] = await Promise.all([
    supabase.from("categorias").select("*"),
    supabase.from("produtos").select("*").order("createdAt", { ascending: false }),
    supabase.from("clicks_produtos").select("categoria_slug, created_at")
  ]);

  // -------------------------------------------------------------------------
  // 2. PROCESSAMENTO DE MÉTRICAS (Business Logic)
  // -------------------------------------------------------------------------
  const totalProdutos = produtos?.length || 0;
  const totalClicks = clicksData?.length || 0;
  const emOferta = produtos?.filter(p => p.precoOriginal && p.precoOriginal > p.preco).length || 0;
  const ultimosProdutos = produtos?.slice(0, 5) || [];

  // Lógica de Gráfico: Agrupamento por data (últimos 7 dias)
  const ultimos7Dias = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const chartData = ultimos7Dias.map(date => ({
    data: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
    cliques: (clicksData || []).filter(c => c.created_at.startsWith(date)).length
  }));

  // Lógica de Ranking: Top 5 Categorias
  const clicksPorCategoria = (clicksData || []).reduce((acc: Record<string, number>, curr) => {
    acc[curr.categoria_slug] = (acc[curr.categoria_slug] || 0) + 1;
    return acc;
  }, {});

  const topCategorias = Object.entries(clicksPorCategoria)
    .map(([slug, count]) => {
      const cat = (categorias || []).find(c => c.slug === slug);
      return { 
        nome: cat?.nome || slug, 
        emoji: cat?.emoji || '📦', 
        cor: cat?.cor || '#F97316', 
        count: count as number,
        percent: totalClicks > 0 ? ((count as number) / totalClicks) * 100 : 0
      };
    })
    .sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Administração T-Hex</h1>
        <p className="text-[#8E8E9F] mt-1 font-medium">Performance e tendências em tempo real.</p>
      </header>

      {/* KPI CARDS - Visão Macro */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Produtos" value={totalProdutos} icon={<Package className="text-[#F97316] w-5 h-5"/>} color="orange" />
        <StatCard title="Categorias" value={categorias?.length || 0} icon={<Tags className="text-[#7C3AED] w-5 h-5"/>} color="purple" />
        <StatCard title="Em Oferta" value={emOferta} icon={<TrendingDown className="text-[#22C55E] w-5 h-5"/>} color="green" />
        <StatCard title="Cliques Totais" value={totalClicks} icon={<Activity className="text-[#3B82F6] w-5 h-5"/>} color="blue" />
      </section>

      {/* ÁREA ANALÍTICA - Comportamento do Usuário */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <article className="lg:col-span-2 bg-[#1A1A24] p-6 rounded-[24px] border border-[#2A2A35]">
          <div className="flex items-center gap-2 mb-6 text-white font-bold text-xl">
            <LineChart className="w-5 h-5 text-[#3B82F6]" />
            <h2>Evolução de Cliques</h2>
          </div>
          <AnalyticsChart data={chartData} />
        </article>

        <article className="bg-[#1A1A24] p-6 rounded-[24px] border border-[#2A2A35]">
          <div className="flex items-center gap-2 mb-6 text-white font-bold text-xl">
            <Trophy className="w-5 h-5 text-[#EAB308]" />
            <h2>Top Categorias</h2>
          </div>
          <div className="space-y-5">
            {topCategorias.map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white">{cat.emoji} {cat.nome}</span>
                  <span className="text-[#8E8E9F]">{cat.count} clicks</span>
                </div>
                <div className="h-1.5 w-full bg-[#2A2A35] rounded-full overflow-hidden">
                  <div className="h-full transition-all duration-700" style={{ width: `${cat.percent}%`, backgroundColor: cat.cor }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      {/* FEED DE ATIVIDADE - Gestão de Conteúdo */}
      <footer className="bg-[#1A1A24] p-6 rounded-[24px] border border-[#2A2A35]">
        <div className="flex items-center gap-2 text-white font-bold text-xl mb-6">
          <Activity className="w-5 h-5" />
          <h2>Últimos Cadastros</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {ultimosProdutos.map(p => (
            <div key={p.id} className="bg-[#1E1E2E] p-4 rounded-xl border border-[#2A2A35] text-center group hover:border-[#F97316]/30 transition-all">
              <p className="text-xs font-bold text-white truncate mb-2">{p.nome}</p>
              <p className="text-sm font-black text-[#22C55E]">R$ {p.preco.toFixed(2).replace('.', ',')}</p>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

/**
 * COMPONENTE INTERNO: StatCard
 * Organiza os cards de métricas com suporte a cores temáticas.
 */
function StatCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
  const themes: Record<string, string> = {
    orange: 'hover:border-[#F97316]/50',
    purple: 'hover:border-[#7C3AED]/50',
    green: 'hover:border-[#22C55E]/50',
    blue: 'hover:border-[#3B82F6]/50',
  };
  return (
    <div className={`bg-[#1A1A24] p-6 rounded-2xl border border-[#2A2A35] transition-all duration-300 ${themes[color]}`}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-[#8E8E9F] text-sm font-bold uppercase tracking-tight">{title}</p>
        {icon}
      </div>
      <h3 className="text-4xl font-black text-white">{value}</h3>
    </div>
  );
}