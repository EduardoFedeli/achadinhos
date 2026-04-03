import Image from 'next/image'
import type { Produto, Categoria } from '@/types'
import { formatarPreco } from '@/lib/produtos'

interface ProductCardProps {
  produto: Produto
  categoria: Categoria
}

const LOJA_LABEL: Record<string, string> = {
  amazon: 'Amazon', shopee: 'Shopee', magalu: 'Magalu',
  mercadolivre: 'Mercado Livre', americanas: 'Americanas',
  casasbahia: 'Casas Bahia', centauro: 'Centauro', aliexpress: 'AliExpress',
}

export default function ProductCard({ produto, categoria }: ProductCardProps) {
  const accentColor = categoria.cor

  return (
    <a
      href={produto.link_afiliado}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group flex flex-col overflow-hidden rounded-[24px] bg-[#1A1A24] border border-[#2A2A35] transition-all duration-300 hover:border-[var(--cat-color)] hover:shadow-2xl relative"
      style={{ '--cat-color': accentColor } as React.CSSProperties}
    >
      {/* Thumb 1:1 */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#0F0F13]">
        {produto.imagem ? (
          <Image
            src={produto.imagem}
            alt={produto.nome}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {categoria.emoji}
          </div>
        )}

        {/* Badges */}
        <div className="absolute inset-x-2.5 top-2.5 flex justify-between items-start pointer-events-none">
          {produto.desconto_pct && produto.desconto_pct > 0 && (
            <span className="rounded-lg bg-red-600 px-2.5 py-1 text-[11px] font-black text-white shadow-xl">
              -{produto.desconto_pct}%
            </span>
          )}
          {produto.novo && (
            <span className="rounded-lg bg-green-600 px-2.5 py-1 text-[11px] font-black text-white shadow-xl">
              NOVO
            </span>
          )}
        </div>
      </div>

      {/* Conteúdo com escala aumentada */}
      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-[#A1A1AA]">
          {LOJA_LABEL[produto.loja] ?? produto.loja}
        </p>
        
        <p className="flex-1 line-clamp-2 text-[14px] font-bold leading-tight text-white group-hover:text-[var(--cat-color)] transition-colors mb-4 h-[2.5em]">
          {produto.nome}
        </p>
        
        <div className="mb-4">
          {produto.preco_original && (
            <p className="text-[11px] text-[#A1A1AA] line-through opacity-50 mb-0.5">
              {formatarPreco(produto.preco_original)}
            </p>
          )}
          <p className="text-xl font-black leading-none tracking-tight" style={{ color: accentColor }}>
            {formatarPreco(produto.preco)}
          </p>
        </div>

        {/* Botão com mais padding */}
        <div
          className="w-full rounded-xl py-3 text-center text-[11px] font-black text-white transition-all group-hover:brightness-110 flex items-center justify-center gap-2"
          style={{ backgroundColor: accentColor }}
        >
          VER OFERTA
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
      </div>
    </a>
  )
}