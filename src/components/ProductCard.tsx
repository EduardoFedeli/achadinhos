import type { Produto, Categoria } from '../types'

interface ProductCardProps {
  produto: Produto
  categoria: Categoria
}

const LOJA_LABEL: Record<string, string> = {
  amazon: '🛒 Amazon',
  shopee: '🏪 Shopee',
}

export default function ProductCard({ produto, categoria }: ProductCardProps) {
  return (
    <a
      href={produto.link_afiliado}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-label={`Ver oferta: ${produto.nome}`}
      className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm"
    >
      {/* Thumb */}
      <div
        className="relative flex aspect-square w-full items-center justify-center text-5xl"
        style={{ background: categoria.cor }}
      >
        {produto.destaque && (
          <span className="absolute left-2 top-2 rounded-full bg-brand px-2 py-0.5 text-[8px] font-bold text-white">
            🔥 DESTAQUE
          </span>
        )}
        {categoria.emoji}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-2.5 pb-0">
        <p className="mb-0.5 text-[9px] font-medium text-gray-400">
          {LOJA_LABEL[produto.loja] ?? produto.loja}
        </p>
        <p className="flex-1 text-[11px] font-bold leading-snug text-gray-900">
          {produto.nome}
        </p>
        <p className="mt-1.5 text-[15px] font-black text-brand">
          {produto.preco}
        </p>
      </div>

      {/* Botão */}
      <div aria-hidden="true" className="m-2.5 mt-2 rounded-lg bg-brand py-2 text-center text-[11px] font-bold text-white">
        Ver oferta →
      </div>
    </a>
  )
}
