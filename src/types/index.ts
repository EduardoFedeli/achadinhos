export type Loja =
  | 'amazon'
  | 'shopee'
  | 'magalu'
  | 'mercadolivre'
  | 'americanas'
  | 'casasbahia'
  | 'centauro'
  | 'aliexpress'

export interface Produto {
  id: string
  nome: string
  preco: number
  preco_original?: number
  desconto_pct?: number
  imagem: string | null
  link_afiliado: string
  loja: Loja
  tags?: string[]
  destaque: boolean
  novo?: boolean
  createdAt?: string // <- Novo campo para rastrear a idade do produto (ISO 8601)
}

export interface Categoria {
  nome: string
  slug: string
  emoji: string
  cor: string
  descricao: string
  produtos: Produto[]
}

export interface ProdutosData {
  categorias: Categoria[]
}

export interface FiltrosProduto {
  lojas?: Loja[]
  precoMin?: number
  precoMax?: number
  tags?: string[]
  ordenar?: 'menor-preco' | 'maior-desconto' | 'az'
}