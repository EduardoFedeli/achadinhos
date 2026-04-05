import Image from 'next/image'
import type { Produto, Categoria } from '@/types'
import { formatarPreco } from '@/lib/produtos'

interface ProductCardProps {
  produto: Produto
  categoria: Categoria
  brandColorOnly?: boolean // Prop para forçar a cor verde na Home
  forceColor?: string      // Prop para forçar qualquer cor (ex: Laranja)
}

const LOJA_LABEL: Record<string, string> = {
  amazon: 'Amazon', shopee: 'Shopee', magalu: 'Magalu',
  mercadolivre: 'Mercado Livre', americanas: 'Americanas',
  casasbahia: 'Casas Bahia', centauro: 'Centauro', aliexpress: 'AliExpress',
}

export default function ProductCard({ produto, categoria, brandColorOnly, forceColor }: ProductCardProps) {
  // A LÓGICA MESTRA DE CORES: 
  // 1. Se tiver forceColor, usa ele.
  // 2. Se for brandColorOnly, usa o verde T-Hex (#22C55E).
  // 3. Se não, usa a cor da categoria.
  const baseColor = forceColor ? forceColor : (brandColorOnly ? '#22C55E' : (categoria.cor || '#22C55E'))

  return (
    <a
      href={produto.linkAfiliado || produto.link_afiliado}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group flex flex-col overflow-hidden rounded-[24px] bg-[#1A1A24] border border-[#2A2A35] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] relative"
      // Injeta a cor certa (Verde ou da Categoria) como variável CSS para o Tailwind
      style={{ '--cat-color': baseColor } as React.CSSProperties}
    >
      {/* Borda que acende na cor da variável --cat-color */}
      <div className="absolute inset-0 rounded-[24px] border-2 border-transparent group-hover:border-[var(--cat-color)] opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20" />
      
      {/* Thumb 1:1 - Mudamos para bg-white para misturar com o fundo padrão de e-commerces */}
      <div className="relative aspect-square w-full overflow-hidden bg-white">
        {produto.imagem ? (
          <Image
            src={produto.imagem}
            alt={produto.nome}
            fill
            // object-contain faz a imagem caber inteira, p-4 dá um respiro (margem) nas bordas
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 50vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {categoria.emoji}
          </div>
        )}

        {/* Container de Badges */}
        <div className="absolute inset-x-2 top-2 md:inset-x-3 md:top-3 flex justify-between items-start pointer-events-none z-10">
          
          {/* Lado Esquerdo (Destaque) */}
          <div className="flex flex-col items-start max-w-[50%]">
            {produto.destaque && (
              <span className="rounded-md bg-[#FFD700] px-1.5 py-0.5 md:px-2 md:py-1 text-[8px] md:text-[10px] font-black uppercase text-[#0F0F13] shadow-lg">
                ★ Destaque
              </span>
            )}
          </div>

          {/* Lado Direito (Desconto e Novo) */}
          <div className="flex flex-col gap-1 md:gap-1.5 items-end max-w-[50%]">
            {produto.desconto_pct && produto.desconto_pct > 0 && (
              <span className="rounded-md bg-[#FF3838] px-1.5 py-0.5 md:px-2 md:py-1 text-[9px] md:text-[11px] font-black text-white shadow-lg">
                -{produto.desconto_pct}%
              </span>
            )}
            {produto.novo && (
              <span className="rounded-md bg-[#22D3EE] px-1.5 py-0.5 md:px-2 md:py-1 text-[8px] md:text-[10px] font-black uppercase text-[#0F0F13] shadow-lg">
                Novo
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#A1A1AA]">
          {LOJA_LABEL[produto.loja] ?? produto.loja}
        </p>
        
        {/* NOME DO PRODUTO (Hover usa a variável --cat-color) */}
        <p className="flex-1 line-clamp-2 text-sm font-bold leading-snug text-white group-hover:text-[var(--cat-color)] transition-colors mb-4 h-[2.5em]">
          {produto.nome}
        </p>
        
        <div className="mb-5">
          {(produto.precoOriginal || produto.preco_original) && (
            <p className="text-[11px] text-[#A1A1AA] line-through opacity-60 mb-0.5 font-medium">
              {formatarPreco(produto.precoOriginal || produto.preco_original || 0)}
            </p>
          )}
          {/* PREÇO (Usa a cor base dinamicamente via style) */}
          <p className="text-xl font-black leading-none tracking-tight" style={{ color: baseColor }}>
            {formatarPreco(produto.preco)}
          </p>
        </div>

        {/* Botão VER OFERTA (Fundo e Sombra acompanham a cor base dinamicamente) */}
        <div
          className="w-full rounded-xl py-3.5 text-center text-[11px] font-black text-[#0F0F13] transition-all group-hover:brightness-110 flex items-center justify-center gap-2"
          style={{ 
            backgroundColor: baseColor,
            boxShadow: `0 4px 14px ${baseColor}4D` 
          }}
        >
          VER OFERTA
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
      </div>
    </a>
  )
}