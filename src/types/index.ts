export type Loja = 'amazon' | 'shopee' | 'magalu' | 'mercadolivre' | 'americanas' | 'casasbahia' | 'centauro' | 'aliexpress';

export interface Produto {
  id: string;
  nome: string;
  preco: number;
  preco_original?: number;
  desconto_pct?: number;
  imagem: string;
  link_afiliado: string;
  loja: string;
  lojaOrigem?: string; // 👈 AQUI ESTÁ! O TypeScript agora sabe que isso existe.
  tags?: string[];
  destaque?: boolean;
  novo?: boolean;
  createdAt: string;
  categoriaSlugs?: string[];
}

export interface Categoria {
  id?: string;
  nome: string;
  slug: string;
  emoji?: string;
  cor: string;
  descricao?: string;
  imagem_url?: string; // 👈 Adicionamos essa linha aqui!
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