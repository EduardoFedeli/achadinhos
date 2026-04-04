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
  imagem: string
  link_afiliado: string
  loja: string
  tags?: string[]
  // NOVO: Record onde a chave é o nome do atributo ("Tamanho") e o valor é a opção ("M")
  atributos?: Record<string, string> 
  destaque?: boolean
  novo?: boolean
  createdAt?: string
  marketplace?: string
}

export interface Categoria {
  nome: string
  slug: string
  emoji?: string         // Mantemos como opcional para fallback
  iconeUrl?: string      // Campo para o novo Flat Icon da IA
  cor: string
  descricao: string
  produtos: Produto[]
}

export interface ProdutosData {
  categorias: Categoria[]
}

export interface FiltrosProduto {
  precoMin?: number
  precoMax?: number
  lojas?: Loja[]
  tags?: string[]
  // NOVO: Dicionário de atributos selecionados no filtro
  atributos?: Record<string, string[]> 
}