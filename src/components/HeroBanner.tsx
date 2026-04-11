"use client"

import * as React from "react"
import Link from 'next/link'
import Image from 'next/image'
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/ui/carousel"

export default function HeroBanner({ setApi }: { setApi?: (api: CarouselApi) => void }) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  )

  return (
    <div className="relative w-full h-full">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full h-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="h-full">
          
          {/* SLIDE 1: O T-Hex */}
          <CarouselItem>
            <div className="relative w-full overflow-hidden bg-[#14141C] px-4 py-8 md:px-12 md:py-10">
              <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#22C55E] opacity-10 blur-[80px] pointer-events-none" />
              <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-[#22D3EE] opacity-[0.07] blur-[100px] pointer-events-none" />

              <div className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-center gap-12 md:gap-24 lg:gap-32 max-w-5xl mx-auto">
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
                    href="/explorar" 
                    className="inline-flex items-center gap-2 bg-[#22C55E] text-[#0F0F13] px-6 py-3 rounded-full font-black text-sm hover:brightness-110 transition-all shadow-[0_4px_14px_rgba(34,197,94,0.3)]"
                  >
                    Começar a Caçada →
                  </Link>
                </div>

                <div className="relative w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 drop-shadow-2xl animate-in fade-in zoom-in duration-1000">
                  <Image src="/assets/mascot/icone4.png" alt="Mascote T-Hex Indica" fill priority sizes="(max-width: 768px) 300px, 500px" className="object-contain drop-shadow-2xl animate-in fade-in" />
                </div>
              </div>
            </div>
          </CarouselItem>

          {/* SLIDE 2: Telegram (NOVO - Focado em Conversão) */}
          <CarouselItem>
             <div className="relative w-full h-full min-h-[400px] md:min-h-[450px] overflow-hidden bg-[#0A0A0F] border border-[#2A2A35] px-4 py-8 md:px-12 md:py-10 flex items-center justify-center">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0088CC]/20 via-[#0F0F13]/0 to-transparent pointer-events-none"></div>

               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 max-w-5xl mx-auto w-full">
                 <div className="text-center md:text-left flex flex-col items-center md:items-start max-w-lg">
                    <span className="bg-[#0088CC]/10 text-[#0088CC] border border-[#0088CC]/30 text-xs font-black uppercase px-4 py-1.5 rounded-full mb-5 inline-block tracking-widest shadow-[0_0_15px_rgba(0,136,204,0.2)] animate-pulse">
                      Canal do Telegram
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.05] mb-5">
                      Não perca mais <br className="hidden md:block" />nenhuma <span className="text-[#0088CC]">oferta.</span>
                    </h2>
                    <p className="text-[#A1A1AA] text-base md:text-lg mb-8 leading-relaxed">
                      As melhores promoções esgotam em minutos. Entre no nosso grupo do Telegram e seja notificado no celular assim que algum produto chegar na loja!
                    </p>
                    <Link 
                      href="https://t.me/+KJS4AekuWeYzMDZh" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#0088CC] text-white px-6 py-3 rounded-full font-black text-sm hover:brightness-110 transition-all shadow-[0_4px_14px_rgba(0,136,204,0.4)]"
                    >
                      Entrar no Grupo Agora ✈️
                    </Link>
                 </div>
                 <div className="text-[100px] md:text-[160px] drop-shadow-[0_0_40px_rgba(0,136,204,0.5)] hover:scale-105 transition-transform cursor-default">
                   📱
                 </div>
               </div>
             </div>
          </CarouselItem>

          {/* SLIDE 3: Foco em Filtros e Navegação */}
          <CarouselItem>
             <div className="relative w-full h-full min-h-[400px] md:min-h-[450px] overflow-hidden bg-[#0A0A0F] border border-[#2A2A35] px-4 py-8 md:px-12 md:py-10 flex items-center justify-center">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#22D3EE]/15 via-[#0F0F13]/0 to-transparent pointer-events-none"></div>

               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 max-w-5xl mx-auto w-full">
                 <div className="text-center md:text-left flex flex-col items-center md:items-start max-w-lg">
                    <span className="bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/30 text-xs font-black uppercase px-4 py-1.5 rounded-full mb-5 inline-block tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                      Navegação Inteligente
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.05] mb-5">
                      Ache exatamente <br className="hidden md:block" />o que <span className="text-[#22D3EE]">procura.</span>
                    </h2>
                    <p className="text-[#A1A1AA] text-base md:text-lg mb-8 leading-relaxed">
                      Use nossos filtros avançados e explore categorias nichadas. Esqueça a bagunça dos marketplaces, encontre a oferta perfeita para você em segundos.
                    </p>
                    <Link href="/explorar" className="inline-flex items-center gap-2 bg-[#22D3EE] text-[#0F0F13] px-6 py-3 rounded-full font-black text-sm hover:brightness-110 transition-all shadow-[0_4px_14px_rgba(34,211,238,0.3)]">
                      Testar Filtros 🎯
                    </Link>
                 </div>
                 <div className="text-[100px] md:text-[160px] drop-shadow-[0_0_40px_rgba(34,211,238,0.3)] hover:scale-105 transition-transform cursor-default">
                   🎛️
                 </div>
               </div>
             </div>
          </CarouselItem>

          {/* SLIDE 4: Todas as Categorias */}
          <CarouselItem>
             <div className="relative w-full h-full min-h-[400px] md:min-h-[450px] overflow-hidden bg-gradient-to-br from-[#1E3A8A] to-[#0F172A] px-4 py-8 md:px-12 md:py-10 flex items-center justify-center">
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 max-w-5xl mx-auto w-full">
                 <div className="text-center md:text-left flex flex-col items-center md:items-start max-w-lg">
                    <span className="bg-[#3B82F6]/20 text-[#60A5FA] border border-[#3B82F6]/30 text-xs font-black uppercase px-4 py-1.5 rounded-full mb-5 inline-block tracking-widest">
                      Catálogo Organizado
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.05] mb-5">
                      Explore todas as <br className="hidden md:block" /><span className="text-[#60A5FA]">Categorias.</span>
                    </h2>
                    <p className="text-[#A1A1AA] text-base md:text-lg mb-8 leading-relaxed">
                      Navegue por nossa base completa de nichos. De Casa a Games, nós separamos as melhores ofertas do mercado em um só lugar para você não perder tempo.
                    </p>
                    <Link 
                      href="/categorias" 
                      className="inline-flex items-center gap-2 bg-[#3B82F6] text-white px-6 py-3 rounded-full font-black text-sm hover:brightness-110 transition-all shadow-[0_4px_14px_rgba(59,130,246,0.3)]"
                    >
                      Ver Categorias 🗂️
                    </Link>
                 </div>
                 <div className="text-[100px] md:text-[160px] drop-shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:scale-105 transition-transform cursor-default">
                   📦
                 </div>
               </div>
             </div>
          </CarouselItem>

        </CarouselContent>
      </Carousel>
    </div>
  )
}