import Link from 'next/link'

export default function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#EA580C] via-[#F97316] to-[#FB923C] px-6 py-8 md:px-10 md:py-12 shadow-lg">
      
      {/* Elementos Decorativos Modernizados (Efeito Glass/Glow) */}
      <div className="absolute -right-10 -top-24 h-64 w-64 rounded-full bg-white opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-20 h-32 w-32 rounded-full bg-white opacity-20 blur-2xl pointer-events-none" />

      {/* Container do Conteúdo */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        
        <div className="max-w-lg">
          <p className="mb-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-white/80 drop-shadow-sm">
            ✨ Curadoria T-Hex
          </p>
          <h1 className="mb-2 text-2xl md:text-4xl font-black leading-tight tracking-tight text-white drop-shadow-sm">
            As melhores ofertas <br className="hidden md:block" />escolhidas a dedo
          </h1>
          <p className="text-sm md:text-base text-white/90 font-medium drop-shadow-sm">
            Produtos selecionados da Amazon, Shopee e Mercado Livre.
          </p>
        </div>

        {/* Botão de CTA atualizado com alto contraste */}
        <Link
          href="#destaques"
          className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#0F0F13] px-6 py-3 text-sm font-bold text-white shadow-xl hover:bg-[#1A1A24] hover:scale-105 transition-all duration-300"
        >
          Explorar ofertas →
        </Link>
        
      </div>
    </section>
  )
}