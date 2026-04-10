import { getCategorias } from '@/lib/produtos'
import Header from '@/components/Header'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CategoriasPage() {
  const categoriasRaw = await getCategorias()
  
  // Ordenar alfabeticamente para facilitar a busca do usuário
  const categorias = [...categoriasRaw].sort((a, b) => a.nome.localeCompare(b.nome))

  return (
    <div className="relative flex flex-col pb-24 overflow-hidden">
      
      {/* Background Padrão (Mantendo a identidade da Home) */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-[#22D3EE] opacity-[0.03] blur-[150px] pointer-events-none"></div>

      <div className="relative z-10">
        <Header />

        <main className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-12 md:mt-20">
          
          {/* Header da Página */}
          <div className="text-center mb-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#22D3EE]/30 bg-[#22D3EE]/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-[#22D3EE]">
              <span>🗂️</span> Navegação Completa
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-4">
              Todas as <span className="text-[#22D3EE]">Categorias</span>
            </h1>
            <p className="text-[#A1A1AA] text-base md:text-lg max-w-2xl mx-auto">
              Selecione o nicho que você procura e encontre as melhores ofertas garimpadas, avaliadas e organizadas para facilitar a sua escolha.
            </p>
          </div>

          {/* Grid de Categorias */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {categorias.map((cat) => (
              <Link 
                key={cat.slug} 
                href={`/${cat.slug}`}
                className="group relative bg-[#1A1A24]/60 backdrop-blur-sm border border-[#2A2A35] rounded-3xl p-6 flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden"
                style={{ 
                  '--cat-color': cat.cor,
                  '--cat-color-translucent': `${cat.cor}15`
                } as React.CSSProperties}
              >
                {/* Glow de fundo no hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,var(--cat-color-translucent)_0%,transparent_70%)]" />
                
                {/* Borda que acende no hover */}
                <div className="absolute inset-0 rounded-3xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ borderColor: cat.cor }} />

                <div 
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center shadow-lg relative z-10 transition-transform duration-500 group-hover:scale-110 border border-[#2A2A35]"
                  style={{ backgroundColor: '#0F0F13' }}
                >
                  {cat.imagem_url ? (
                    <img 
                      src={cat.imagem_url} 
                      alt={cat.nome} 
                      className="w-12 h-12 md:w-14 md:h-14 object-contain filter drop-shadow-[0_0_15px_var(--cat-color)] transition-all duration-300 group-hover:brightness-125" 
                    />
                  ) : (
                    <span className="text-4xl md:text-5xl filter drop-shadow-[0_0_15px_var(--cat-color)]">{cat.emoji}</span>
                  )}
                </div>

                <div className="text-center relative z-10 w-full">
                  <h2 className="text-sm md:text-base font-black text-white uppercase tracking-widest group-hover:text-[var(--cat-color)] transition-colors">
                    {cat.nome}
                  </h2>
                  {cat.descricao && (
                    <p className="text-[#A1A1AA] text-[10px] md:text-xs mt-2 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                      {cat.descricao}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

        </main>
      </div>
    </div>
  )
}