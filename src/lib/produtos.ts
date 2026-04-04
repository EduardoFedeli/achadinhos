import data from '../data/produtos.json'
import type { Categoria, Produto, FiltrosProduto } from '../types'

const { categorias } = data as { categorias: Categoria[] }

export function formatarPreco(preco: number): string {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function getCategorias(): Categoria[] {
  return categorias
}

export function getCategoria(slug: string): Categoria | null {
  return categorias.find(c => c.slug === slug) ?? null
}

export function getProdutosDestaque(limite?: number): Produto[] {
  const todos = categorias.flatMap(c => c.produtos.filter(p => p.destaque))
  // Desduplicação inteligente baseada no ID do produto
  const unicos = Array.from(new Map(todos.map(p => [p.id, p])).values())
  return limite !== undefined ? unicos.slice(0, limite) : unicos
}

export function getProdutos(slug: string, filtros: FiltrosProduto = {}): Produto[] {
  const cat = categorias.find(c => c.slug === slug)
  if (!cat) return []

  let produtos = [...cat.produtos]

  if (filtros.lojas && filtros.lojas.length > 0) {
    // Adicionamos o "as Loja" para acalmar o TypeScript
    produtos = produtos.filter(p => filtros.lojas!.includes(p.loja as any))
  }

  if (filtros.precoMin !== undefined) {
    produtos = produtos.filter(p => p.preco >= filtros.precoMin!)
  }

  if (filtros.precoMax !== undefined) {
    produtos = produtos.filter(p => p.preco <= filtros.precoMax!)
  }

  if (filtros.tags && filtros.tags.length > 0) {
    produtos = produtos.filter(p =>
      filtros.tags!.some(tag => p.tags?.includes(tag))
    )
  }

  if (filtros.ordenar === 'menor-preco') {
    produtos.sort((a, b) => a.preco - b.preco)
  } else if (filtros.ordenar === 'maior-desconto') {
    produtos.sort((a, b) => (b.desconto_pct ?? 0) - (a.desconto_pct ?? 0))
  } else if (filtros.ordenar === 'az') {
    produtos.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
  }

  return produtos
}

export function getProdutosOferta(): Produto[] {
  const todosOfertas = categorias
    .flatMap(c => c.produtos)
    .filter(p => (p.desconto_pct ?? 0) > 0)
    .sort((a, b) => (b.desconto_pct ?? 0) - (a.desconto_pct ?? 0))
  
  // Desduplicação baseada no ID
  return Array.from(new Map(todosOfertas.map(p => [p.id, p])).values())
}