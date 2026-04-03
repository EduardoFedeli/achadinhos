import Link from 'next/link'
import Image from 'next/image'

export default function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden rounded-[32px] bg-[#1A1A24] border border-[#2A2A35] px-6 py-10 md:px-12 md:py-16 shadow-2xl">
      
      {/* Efeitos Visuais T-Hex (Glow Verde e Ciano) */}
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#22C55E] opacity-10 blur-[80px] pointer-events-none" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-[#22D3EE] opacity-[0.07] blur-[100px] pointer-events-none" />

      {/* Container do Conteúdo */}
      <div className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        
        {/* Textos e CTA */}
        <div className="max-w-xl text-center md:text-left flex flex-col items-center md:items-start">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#936A47]/30 bg-[#936A47]/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[#FFD700]">
            <span>🦖</span> O caçador de ofertas
          </div>
          
          <h1 className="mb-4 text-3xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-white">
            As melhores <span className="text-[#22C55E]">ofertas</span><br className="hidden md:block" /> escolhidas a dedo.
          </h1>
          
          <p className="mb-8 text-base md:text-lg text-[#A1A1AA] font-medium max-w-md">
            O T-Hex vasculha a internet diariamente para trazer produtos com custo-benefício imbatível da Amazon, Shopee e Mercado Livre.
          </p>

          <Link
            href="#destaques"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#22C55E] px-8 py-4 text-sm font-black text-[#0F0F13] shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:bg-[#1ea850] hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all duration-300"
          >
            Começar a Caçada →
          </Link>
        </div>

        {/* Mascote T-Hex */}
        <div className="relative w-48 h-48 md:w-72 md:h-72 lg:w-96 lg:h-96 drop-shadow-2xl animate-in fade-in zoom-in duration-1000">
          <Image 
            src="/assets/mascot/icone4.png" 
            alt="T-Hex Mascote" 
            fill 
            sizes="(max-width: 768px) 192px, (max-width: 1024px) 288px, 384px"
            className="object-contain"
            priority
          />
        </div>
        
      </div>
    </section>
  )
}