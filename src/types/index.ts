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
  preco_original?: number // Para o código antigo
  precoOriginal?: number  // Para o Supabase
  desconto_pct?: number
  imagem: string
  link_afiliado: string   // Para o código antigo
  linkAfiliado?: string    // Para o Supabase
  loja: string
  tags?: string[]
  atributos?: Record<string, string> 
  destaque?: boolean
  novo?: boolean
  createdAt?: string
  marketplace?: string
  categoriaSlug?: string
  categoriaSlugs?: string[] // Array de categorias do Supabase
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
  atributos?: Record<string, string[]>
  ordenar?: string // <--- A LINHA QUE FALTAVA PARA SALVAR O DEPLOY
}