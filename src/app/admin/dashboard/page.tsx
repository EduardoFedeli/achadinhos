import { createClient } from "@supabase/supabase-js";
import { getCategorias } from "@/lib/produtos";
import { Package, Tags, TrendingDown, Star, Activity, Trophy, ArrowRight, LineChart } from "lucide-react";
import Link from "next/link";
import AnalyticsChart from "@/components/admin/AnalyticsChart";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const categorias = await getCategorias();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  // 1. Fetch de Dados
  const { data: produtos } = await supabase.from("produtos").select("*").order("createdAt", { ascending: false });
  const { data: clicksData } = await supabase.from("clicks_produtos").select("categoria_slug, created_at");

  const totalProdutos = produtos?.length || 0;
  const emOferta = produtos?.filter((p) => p.precoOriginal && (p.precoOriginal > p.preco)).length || 0;
  const totalClicks = clicksData?.length || 0;
  const ultimosProdutos = produtos?.slice(0, 5) || [];

  // 2. Lógica do Gráfico de Evolução (Últimos 7 dias)
  const ultimos7Dias = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const chartData = ultimos7Dias.map(date => {
    const count = (clicksData || []).filter(c => c.created_at.startsWith(date)).length;
    return {
      data: new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      cliques: count
    };
  });

  // 3. Lógica do Ranking de Categorias
  const clicksPorCategoria = (clicksData || []).reduce((acc: Record<string, number>, curr) => {
    acc[curr.categoria_slug] = (acc[curr.categoria_slug] || 0) + 1;
    return acc;
  }, {});

  const topCategorias = Object.entries(clicksPorCategoria)
    .map(([slug, count]) => {
      const cat = categorias.find(c => c.slug === slug);
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
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Administração T-Hex</h1>
        <p className="text-[#8E8E9F] mt-1">Performance e tendências em tempo real.</p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatCard title="Produtos" value={totalProdutos} icon={<Package className="text-[#F97316] w-5 h-5"/>} color="orange" />
        <StatCard title="Categorias" value={categorias.length} icon={<Tags className="text-[#7C3AED] w-5 h-5"/>} color="purple" />
        <StatCard title="Em Oferta" value={emOferta} icon={<TrendingDown className="text-[#22C55E] w-5 h-5"/>} color="green" />
        <StatCard title="Cliques Totais" value={totalClicks} icon={<Activity className="text-[#3B82F6] w-5 h-5"/>} color="blue" />
      </div>

      {/* ANALYTICS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Evolução */}
        <div className="lg:col-span-2 bg-[#1A1A24] p-6 rounded-[24px] border border-[#2A2A35]">
          <div className="flex items-center gap-2 mb-6">
            <LineChart className="w-5 h-5 text-[#3B82F6]" />
            <h2 className="text-xl font-bold text-white">Evolução de Cliques</h2>
          </div>
          <AnalyticsChart data={chartData} />
        </div>

        {/* Top Categorias */}
        <div className="bg-[#1A1A24] p-6 rounded-[24px] border border-[#2A2A35]">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-[#EAB308]" />
            <h2 className="text-xl font-bold text-white">Top Categorias</h2>
          </div>
          <div className="space-y-5">
            {topCategorias.map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white">{cat.emoji} {cat.nome}</span>
                  <span className="text-[#8E8E9F]">{cat.count} clicks</span>
                </div>
                <div className="h-1.5 w-full bg-[#2A2A35] rounded-full overflow-hidden">
                  <div className="h-full" style={{ width: `${cat.percent}%`, backgroundColor: cat.cor }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY ROW */}
      <div className="bg-[#1A1A24] p-6 rounded-[24px] border border-[#2A2A35]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-white" />
            <h2 className="text-xl font-bold text-white">Últimos Produtos Cadastrados</h2>
          </div>
          <Link href="/admin/produtos" className="text-xs font-black text-[#F97316] flex items-center gap-1 hover:opacity-80">
            VER TUDO <ArrowRight className="w-3 h-3"/>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {ultimosProdutos.map(p => (
            <div key={p.id} className="bg-[#1E1E2E] p-4 rounded-xl border border-[#2A2A35] text-center">
              <p className="text-xs font-bold text-white truncate mb-2">{p.nome}</p>
              <p className="text-sm font-black text-[#22C55E]">R$ {p.preco.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para os Cards (mantenha no mesmo arquivo ou mova para components)
function StatCard({ title, value, icon, color }: any) {
  const colors: any = {
    orange: 'hover:border-[#F97316]/50',
    purple: 'hover:border-[#7C3AED]/50',
    green: 'hover:border-[#22C55E]/50',
    blue: 'hover:border-[#3B82F6]/50',
  };
  return (
    <div className={`bg-[#1A1A24] p-6 rounded-2xl border border-[#2A2A35] transition-all ${colors[color]}`}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-[#8E8E9F] text-sm font-medium">{title}</p>
        {icon}
      </div>
      <h3 className="text-4xl font-black text-white">{value}</h3>
    </div>
  );
}