import Image from 'next/image'
import type { Produto, Categoria } from '@/types'
import { formatarPreco } from '@/lib/produtos'

interface ProductCardProps {
  produto: Produto
  categoria: Categoria
}

const LOJA_LABEL: Record<string, string> = {
  amazon:       'Amazon',
  shopee:       'Shopee',
  magalu:       'Magalu',
  mercadolivre: 'Mercado Livre',
  americanas:   'Americanas',
  casasbahia:   'Casas Bahia',
  centauro:     'Centauro',
  aliexpress:   'AliExpress',
}

export default function ProductCard({ produto, categoria }: ProductCardProps) {
  const accentColor = categoria.cor

  return (
    <a
      href={produto.link_afiliado}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-label={`Ver oferta: ${produto.nome}`}
      className="flex flex-col overflow-hidden rounded-2xl bg-card-bg border border-card-border"
    >
      {/* Thumb */}
      <div className="relative aspect-square w-full overflow-hidden bg-surface flex items-center justify-center">
        {produto.imagem ? (
          <Image
            src={produto.imagem}
            alt={produto.nome}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <span className="text-5xl">{categoria.emoji}</span>
        )}

        {/* Badge desconto */}
        {produto.desconto_pct && produto.desconto_pct > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
            -{produto.desconto_pct}%
          </span>
        )}

        {/* Badge novo */}
        {produto.novo && (
          <span className="absolute right-2 top-2 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white">
            NOVO
          </span>
        )}

        {/* Badge destaque */}
        {produto.destaque && !produto.novo && (
          <span
            className="absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
            style={{ backgroundColor: accentColor }}
          >
            ★
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-2.5">
        <p className="mb-0.5 text-[9px] font-medium text-muted-foreground">
          {LOJA_LABEL[produto.loja] ?? produto.loja}
        </p>
        <p className="flex-1 line-clamp-2 text-[11px] font-bold leading-snug text-foreground">
          {produto.nome}
        </p>
        <div className="mt-1.5">
          <p
            className="text-[15px] font-black"
            style={{ color: accentColor }}
          >
            {formatarPreco(produto.preco)}
          </p>
          {produto.preco_original && (
            <p className="text-[10px] text-muted-foreground line-through">
              {formatarPreco(produto.preco_original)}
            </p>
          )}
        </div>
      </div>

      {/* Botão */}
      <div
        aria-hidden="true"
        className="mx-2.5 mb-2.5 rounded-lg py-2 text-center text-[11px] font-bold text-white"
        style={{ backgroundColor: accentColor }}
      >
        Ver oferta →
      </div>
    </a>
  )
}
