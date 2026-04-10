import type { Metadata } from 'next'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Sobre — T-Hex Indica',
  description: 'Saiba mais sobre o T-Hex Indica, como funciona nossa curadoria e nossas políticas.',
}

export default function SobrePage() {
  return (
    // REMOVIDO o bg-page-bg e o min-h-screen para usar o fundo global!
    <div className="flex flex-col pb-24 relative z-10">
      <Header />

      {/* Hero */}
      <section className="px-5 py-12 md:py-20 text-center flex flex-col items-center justify-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#22C55E]/10 blur-[100px] rounded-full pointer-events-none" />
        
        <span className="text-6xl md:text-7xl mb-6 md:mb-8 select-none relative z-10 drop-shadow-2xl">🦖</span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#22C55E]/80 relative z-10">
          Sobre o T-Hex Indica
        </h1>
        <p className="mt-4 text-sm md:text-lg text-[#A1A1AA] max-w-lg mx-auto uppercase tracking-widest font-bold relative z-10">
          Curadoria honesta que vale cada centavo.
        </p>
      </section>

      {/* Content */}
      <div className="mx-auto w-full max-w-4xl px-4 md:px-8 pb-10">
        <div className="rounded-[32px] bg-[#1A1A24]/60 backdrop-blur-xl border border-[#2A2A35]/50 p-8 md:p-12 space-y-12 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          
          {/* Seção 1: O que é */}
          <div>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider flex items-center gap-3">
              <span className="text-[#22C55E] text-3xl leading-none">✦</span> O que é o T-Hex Indica?
            </h2>
            <p className="text-base text-[#A1A1AA] leading-relaxed">
              O T-Hex Indica é o seu radar de ofertas definitivo. Garimpamos diariamente os melhores 
              produtos da Amazon, Shopee e outros grandes marketplaces, tendo sempre foco em qualidade real, 
              custo-benefício e avaliações sinceras de quem já comprou. Nosso objetivo é poupar o seu tempo 
              e evitar que você caia em ciladas na internet.
            </p>
          </div>

          {/* Seção 2: Como funciona (Transparência) */}
          <div>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider flex items-center gap-3">
              <span className="text-[#22C55E] text-3xl leading-none">✦</span> Como o site se mantém?
            </h2>
            <p className="text-base text-[#A1A1AA] leading-relaxed">
              Transparência é a nossa regra número um. Cada produto listado aqui possui um link de afiliado. 
              Isso significa que, quando você clica e finaliza uma compra, nós recebemos uma pequena comissão 
              da loja parceira — <strong className="text-white font-black">sem adicionar absolutamente nenhum custo extra para você</strong>. 
              É esse modelo que nos permite manter o site 100% gratuito, atualizado e sem anúncios invasivos pulando na sua tela.
            </p>
          </div>

          {/* Seção 3: Explorar e Filtros (Funcionalidades) */}
          <div>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider flex items-center gap-3">
              <span className="text-[#22C55E] text-3xl leading-none">✦</span> Explorar & Filtros
            </h2>
            <p className="text-base text-[#A1A1AA] leading-relaxed mb-4">
              Para facilitar ainda mais a sua busca, criamos a aba <strong className="text-white font-black">Explorar</strong>. Lá é o nosso painel 
              central onde você pode ver tudo o que o T-Hex encontrou, de todas as categorias, em um só lugar.
            </p>
            <p className="text-base text-[#A1A1AA] leading-relaxed">
              Use nossos <strong className="text-white font-black">Filtros Inteligentes</strong> na barra lateral para refinar sua busca! Você pode 
              ajustar a faixa de preço que cabe no seu bolso, escolher suas lojas favoritas (como Amazon ou Mercado Livre) 
              e filtrar por características e tags específicas (como "Feminino", "Gamer" ou "Custo-benefício").
            </p>
          </div>

          {/* Seção 4: A Regra dos 90 Dias (Gatilho de Autoridade) */}
          <div className="bg-gradient-to-br from-[#22C55E]/10 to-transparent p-6 md:p-8 rounded-3xl border border-[#22C55E]/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/20 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2" />
            <h2 className="text-xl font-black text-white mb-3 uppercase tracking-wider">
              Auditoria de Catálogo (A Regra dos 90 Dias)
            </h2>
            <p className="text-sm md:text-base text-[#A1A1AA] leading-relaxed relative z-10">
              Não há nada mais frustrante do que clicar em uma oferta incrível e descobrir que o produto acabou ou o preço subiu, certo? 
              Por isso, temos uma política rigorosa de limpeza: <strong className="text-white">produtos inativos ou esgotados são removidos após 90 dias</strong>. 
              Apenas produtos que continuam em estoque, com preço justo e com alta procura pela comunidade sobrevivem a essa auditoria. 
            </p>
          </div>

          {/* Seção 5: Parcerias */}
          <div>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider flex items-center gap-3">
              <span className="text-[#22C55E] text-3xl leading-none">✦</span> Nossas Parcerias
            </h2>
            <p className="text-base text-[#A1A1AA] leading-relaxed mb-6">
              Nós colaboramos com diversas páginas e criadores de conteúdo que compartilham da nossa visão de trazer as melhores dicas para você. Conheça algumas delas:
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { label: '@bichinz_ — Universo Pet', href: 'https://instagram.com/bichinz_' },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-[#2A2A35] bg-[#0F0F13] px-6 py-4 text-sm font-black uppercase tracking-wider text-white transition-all hover:border-[#22C55E] hover:text-[#22C55E] hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(34,197,94,0.1)] flex items-center gap-2"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Seção 6: Próximas Atualizações (Roadmap) */}
          <div>
            <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider flex items-center gap-3">
              <span className="text-[#22C55E] text-3xl leading-none">✦</span> Nosso Roadmap
            </h2>
            <p className="text-base text-[#A1A1AA] leading-relaxed mb-6">
              O T-Hex Indica está em evolução constante. Nosso compromisso é entregar as melhores ofertas com a melhor experiência. Veja o que está no nosso radar:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Card 1: WhatsApp */}
              <div className="bg-[#0F0F13]/50 border border-dashed border-[#2A2A35] rounded-3xl p-6 relative overflow-hidden group hover:border-[#25D366]/50 transition-colors">
                <div className="absolute top-4 right-4 bg-[#25D366]/10 text-[#25D366] text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
                  Breve
                </div>
                <div className="w-12 h-12 bg-[#1A1A24] rounded-2xl mb-4 flex items-center justify-center text-2xl group-hover:bg-[#25D366]/20 group-hover:scale-110 transition-all">
                  💬
                </div>
                <h3 className="text-white font-black uppercase tracking-wider text-sm mb-2">Grupo WhatsApp</h3>
                <p className="text-[#A1A1AA] text-xs leading-relaxed">
                  Lançaremos grupos segmentados para você receber promoções relâmpago diretamente no seu app.
                </p>
              </div>

              {/* Card 2: Camisas de Time */}
              <div className="bg-[#0F0F13]/50 border border-dashed border-[#2A2A35] rounded-3xl p-6 relative overflow-hidden group hover:border-[#F97316]/50 transition-colors">
                <div className="absolute top-4 right-4 bg-[#F97316]/10 text-[#F97316] text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
                  Radar
                </div>
                <div className="w-12 h-12 bg-[#1A1A24] rounded-2xl mb-4 flex items-center justify-center text-2xl group-hover:bg-[#F97316]/20 group-hover:scale-110 transition-all">
                  ⚽
                </div>
                <h3 className="text-white font-black uppercase tracking-wider text-sm mb-2">Camisas de Time</h3>
                <p className="text-[#A1A1AA] text-xs leading-relaxed">
                  Uma nova categoria dedicada a vestuário esportivo, mapeando os melhores fornecedores.
                </p>
              </div>

              {/* Card 3: Decoração */}
              <div className="bg-[#0F0F13]/50 border border-dashed border-[#2A2A35] rounded-3xl p-6 relative overflow-hidden group hover:border-[#7C3AED]/50 transition-colors sm:col-span-2 md:col-span-1">
                <div className="absolute top-4 right-4 bg-[#7C3AED]/10 text-[#7C3AED] text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
                  Radar
                </div>
                <div className="w-12 h-12 bg-[#1A1A24] rounded-2xl mb-4 flex items-center justify-center text-2xl group-hover:bg-[#7C3AED]/20 group-hover:scale-110 transition-all">
                  🛋️
                </div>
                <h3 className="text-white font-black uppercase tracking-wider text-sm mb-2">Casa & Decor</h3>
                <p className="text-[#A1A1AA] text-xs leading-relaxed">
                  Expandiremos nossa curadoria para setups gamers e utilidades para o lar com rigoroso filtro.
                </p>
              </div>
            </div>
          </div>

          {/* Seção 7: Contato */}
          <div className="pt-8 border-t border-[#2A2A35]/50 flex flex-col items-center text-center">
            <h2 className="text-2xl font-black text-white mb-3 uppercase tracking-wider">Ficou com alguma dúvida?</h2>
            <p className="text-base text-[#A1A1AA] leading-relaxed max-w-lg mb-6">
              Seja para tirar dúvidas, reportar um link quebrado, sugerir um produto ou conversar sobre parcerias, sinta-se à vontade para nos chamar!
            </p>
            <a 
              href="mailto:ejstudios.conta@gmail.com" 
              className="px-8 py-4 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] font-black uppercase tracking-widest hover:bg-[#22C55E] hover:text-[#0F0F13] transition-all hover:scale-105"
            >
              ✉️ ejstudios.conta@gmail.com
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}