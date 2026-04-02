# Achadinhos Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir a homepage e a página de categoria do Achadinhos com identidade visual vibrante (laranja/amarelo), grid de 2 colunas de produtos, e navegação por categorias.

**Architecture:** Todas as páginas são Server Components que leem `src/data/produtos.json` via funções em `src/lib/produtos.ts`. Componentes de UI são Client Components apenas quando necessário (nenhum deles precisa de estado nesta fase). Dados fluem do JSON → lib → page → componentes via props.

**Tech Stack:** Next.js 16.2.2 (App Router), React 19, TypeScript 5, Tailwind CSS v4, shadcn/ui

---

> **Atenção Next.js 16:** `params` nas páginas dinâmicas é uma `Promise` — deve ser `await`-ado. Veja `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md`.
>
> **Atenção Tailwind v4:** Não existe `tailwind.config.js`. Tokens customizados vão em `src/app/globals.css` dentro de `@theme {}`. Diretiva de import é `@import 'tailwindcss'`.

---

## File Map

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `src/types/index.ts` | Criar | Tipos `Produto` e `Categoria` |
| `src/data/produtos.json` | Criar | Fonte de verdade — 6 categorias, ~4 produtos cada |
| `src/lib/produtos.ts` | Criar | `getCategorias`, `getCategoria`, `getProdutosDestaque` |
| `src/lib/produtos.test.ts` | Criar | Testes das funções da lib |
| `vitest.config.ts` | Criar | Configuração do Vitest |
| `src/app/globals.css` | Modificar | Tokens de cor da marca via `@theme` |
| `src/app/layout.tsx` | Modificar | Metadata do site |
| `src/components/Header.tsx` | Criar | Logo + ícones, sticky |
| `src/components/HeroBanner.tsx` | Criar | Banner gradiente com CTA |
| `src/components/SectionHeader.tsx` | Criar | Título de seção + link |
| `src/components/CategoryGrid.tsx` | Criar | Pills de categoria centralizadas |
| `src/components/ProductCard.tsx` | Criar | Card individual de produto |
| `src/components/ProductGrid.tsx` | Criar | Grid 2 colunas de ProductCard |
| `src/components/BottomNav.tsx` | Criar | Navegação fixa no rodapé |
| `src/app/page.tsx` | Modificar | Homepage: todos os destaques |
| `src/app/[categoria]/page.tsx` | Criar | Página de categoria filtrada |

---

## Task 1: Vitest + TypeScript Types

**Files:**
- Create: `vitest.config.ts`
- Create: `src/types/index.ts`

- [ ] **Instalar Vitest**

```bash
npm install -D vitest
```

- [ ] **Criar `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
  },
})
```

- [ ] **Adicionar script de teste no `package.json`**

Abrir `package.json` e adicionar dentro de `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Criar `src/types/index.ts`**

```ts
export type Loja = 'amazon' | 'shopee'

export interface Produto {
  id: string
  nome: string
  preco: string
  imagem: string | null
  link_afiliado: string
  loja: Loja
  destaque: boolean
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
```

- [ ] **Commit**

```bash
git add vitest.config.ts src/types/index.ts package.json
git commit -m "chore: add vitest and TypeScript types"
```

---

## Task 2: produtos.json

**Files:**
- Create: `src/data/produtos.json`

- [ ] **Criar `src/data/produtos.json`** com 6 categorias e 4 produtos cada:

```json
{
  "categorias": [
    {
      "nome": "Pets",
      "slug": "pets",
      "emoji": "🐾",
      "cor": "#FFF3ED",
      "descricao": "Tudo para seu bichinho",
      "produtos": [
        {
          "id": "pets-001",
          "nome": "Coleira ajustável premium para cães médios",
          "preco": "R$ 49,90",
          "imagem": null,
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "destaque": true
        },
        {
          "id": "pets-002",
          "nome": "Comedouro automático com timer programável",
          "preco": "R$ 129,90",
          "imagem": null,
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "destaque": false
        },
        {
          "id": "pets-003",
          "nome": "Arranhador em sisal para gatos — 60cm",
          "preco": "R$ 39,90",
          "imagem": null,
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "destaque": true
        },
        {
          "id": "pets-004",
          "nome": "Ração premium para cães adultos 15kg",
          "preco": "R$ 189,90",
          "imagem": null,
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "destaque": false
        }
      ]
    },
    {
      "nome": "Games",
      "slug": "games",
      "emoji": "🎮",
      "cor": "#EDF2FF",
      "descricao": "Equipamentos e acessórios gamer",
      "produtos": [
        {
          "id": "games-001",
          "nome": "Controle sem fio gamer com LED RGB",
          "preco": "R$ 129,90",
          "imagem": null,
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "destaque": true
        },
        {
          "id": "games-002",
          "nome": "Headset gamer 7.1 surround com microfone",
          "preco": "R$ 149,90",
          "imagem": null,
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "destaque": false
        },
        {
          "id": "games-003",
          "nome": "Mousepad gamer XL 80x40cm antiderrapante",
          "preco": "R$ 59,90",
          "imagem": null,
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "destaque": true
        },
        {
          "id": "games-004",
          "nome": "Cadeira gamer ergonômica com apoio lombar",
          "preco": "R$ 899,90",
          "imagem": null,
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "destaque": false
        }
      ]
    },
    {
      "nome": "Esporte",
      "slug": "esporte",
      "emoji": "👟",
      "cor": "#EBFBEE",
      "descricao": "Para quem não para quieto",
      "produtos": [
        {
          "id": "esporte-001",
          "nome": "Tênis esportivo respirável unissex",
          "preco": "R$ 89,90",
          "imagem": null,
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "destaque": true
        },
        {
          "id": "esporte-002",
          "nome": "Garrafa térmica 1L aço inox com alça",
          "preco": "R$ 49,90",
          "imagem": null,
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "destaque": false
        },
        {
          "id": "esporte-003",
          "nome": "Corda de pular com contador digital",
          "preco": "R$ 29,90",
          "imagem": null,
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "destaque": true
        },
        {
          "id": "esporte-004",
          "nome": "Mochila esportiva impermeável 30L",
          "preco": "R$ 119,90",
          "imagem": null,
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "destaque": false
        }
      ]
    },
    {
      "nome": "Livros",
      "slug": "livros",
      "emoji": "📚",
      "cor": "#FFF9DB",
      "descricao": "Leituras que valem cada centavo",
      "produtos": [
        {
          "id": "livros-001",
          "nome": "Box Harry Potter — Edição especial capa dura",
          "preco": "R$ 159,90",
          "imagem": null,
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "destaque": true
        },
        {
          "id": "livros-002",
          "nome": "Atomic Habits — James Clear (capa comum)",
          "preco": "R$ 39,90",
          "imagem": null,
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "destaque": false
        },
        {
          "id": "livros-003",
          "nome": "Livro de receitas fit — 200 receitas saudáveis",
          "preco": "R$ 49,90",
          "imagem": null,
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "destaque": true
        },
        {
          "id": "livros-004",
          "nome": "Box Naruto Shippuden — Volumes 1 a 5",
          "preco": "R$ 89,90",
          "imagem": null,
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "destaque": false
        }
      ]
    },
    {
      "nome": "Roupas",
      "slug": "roupas",
      "emoji": "👗",
      "cor": "#FCE4EC",
      "descricao": "Estilo sem gastar muito",
      "produtos": [
        {
          "id": "roupas-001",
          "nome": "Blusa oversized tie-dye verão unissex",
          "preco": "R$ 39,90",
          "imagem": null,
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "destaque": true
        },
        {
          "id": "roupas-002",
          "nome": "Calça jogger moletom slim fit",
          "preco": "R$ 69,90",
          "imagem": null,
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "destaque": false
        },
        {
          "id": "roupas-003",
          "nome": "Moletom canguru com capuz algodão premium",
          "preco": "R$ 89,90",
          "imagem": null,
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "destaque": true
        },
        {
          "id": "roupas-004",
          "nome": "Vestido midi floral verão — tamanhos P ao GG",
          "preco": "R$ 59,90",
          "imagem": null,
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "destaque": false
        }
      ]
    },
    {
      "nome": "Casa",
      "slug": "casa",
      "emoji": "🏠",
      "cor": "#F3E8FF",
      "descricao": "Deixa sua casa mais bonita",
      "produtos": [
        {
          "id": "casa-001",
          "nome": "Luminária LED de mesa touch recarregável",
          "preco": "R$ 59,90",
          "imagem": null,
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "destaque": true
        },
        {
          "id": "casa-002",
          "nome": "Suporte articulado para celular — mesa e cama",
          "preco": "R$ 29,90",
          "imagem": null,
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "destaque": false
        },
        {
          "id": "casa-003",
          "nome": "Organizador de gaveta modular 10 peças",
          "preco": "R$ 49,90",
          "imagem": null,
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "destaque": true
        },
        {
          "id": "casa-004",
          "nome": "Difusor de aromas elétrico ultrassônico 400ml",
          "preco": "R$ 79,90",
          "imagem": null,
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "destaque": false
        }
      ]
    }
  ]
}
```

- [ ] **Commit**

```bash
git add src/data/produtos.json
git commit -m "feat: add produtos.json with 6 categories and 24 generic products"
```

---

## Task 3: lib/produtos.ts com TDD

**Files:**
- Create: `src/lib/produtos.ts`
- Create: `src/lib/produtos.test.ts`

- [ ] **Criar `src/lib/produtos.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { getCategorias, getCategoria, getProdutosDestaque } from './produtos'

describe('getCategorias', () => {
  it('retorna todas as 6 categorias', () => {
    const cats = getCategorias()
    expect(cats).toHaveLength(6)
  })

  it('cada categoria tem slug, nome e emoji', () => {
    const cats = getCategorias()
    for (const cat of cats) {
      expect(cat.slug).toBeTruthy()
      expect(cat.nome).toBeTruthy()
      expect(cat.emoji).toBeTruthy()
    }
  })
})

describe('getCategoria', () => {
  it('retorna a categoria pelo slug', () => {
    const cat = getCategoria('pets')
    expect(cat).not.toBeNull()
    expect(cat?.nome).toBe('Pets')
  })

  it('retorna null para slug inexistente', () => {
    const cat = getCategoria('nao-existe')
    expect(cat).toBeNull()
  })
})

describe('getProdutosDestaque', () => {
  it('retorna apenas produtos com destaque: true', () => {
    const produtos = getProdutosDestaque()
    expect(produtos.every(p => p.destaque)).toBe(true)
  })

  it('retorna produtos de múltiplas categorias', () => {
    const produtos = getProdutosDestaque()
    expect(produtos.length).toBeGreaterThan(1)
  })

  it('aceita limite opcional', () => {
    const produtos = getProdutosDestaque(4)
    expect(produtos).toHaveLength(4)
  })
})
```

- [ ] **Rodar o teste para confirmar que falha**

```bash
npm test
```

Expected: FAIL — "Cannot find module './produtos'"

- [ ] **Criar `src/lib/produtos.ts`**

```ts
import data from '../data/produtos.json'
import type { Categoria, Produto } from '../types'

const { categorias } = data as { categorias: Categoria[] }

export function getCategorias(): Categoria[] {
  return categorias
}

export function getCategoria(slug: string): Categoria | null {
  return categorias.find(c => c.slug === slug) ?? null
}

export function getProdutosDestaque(limite?: number): Produto[] {
  const todos = categorias.flatMap(c => c.produtos.filter(p => p.destaque))
  return limite ? todos.slice(0, limite) : todos
}
```

- [ ] **Rodar os testes para confirmar que passam**

```bash
npm test
```

Expected: PASS — 7 tests passed

- [ ] **Commit**

```bash
git add src/lib/produtos.ts src/lib/produtos.test.ts
git commit -m "feat: add produtos lib with getCategorias, getCategoria, getProdutosDestaque"
```

---

## Task 4: Tokens de cor no globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Abrir `src/app/globals.css` e substituir todo o conteúdo por:**

```css
@import "tailwindcss";

@theme {
  --color-brand: #FF6B35;
  --color-brand-yellow: #FFD23F;
  --color-page-bg: #F5F5F5;
}
```

Isso expõe as classes `bg-brand`, `text-brand`, `bg-brand-yellow`, `text-brand-yellow`, `bg-page-bg` no Tailwind v4.

- [ ] **Verificar que o build não quebra**

```bash
npm run build
```

Expected: compilação sem erros

- [ ] **Commit**

```bash
git add src/app/globals.css
git commit -m "style: add brand color tokens to Tailwind theme"
```

---

## Task 5: Header

**Files:**
- Create: `src/components/Header.tsx`

- [ ] **Criar `src/components/Header.tsx`**

```tsx
export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-5 py-3 shadow-sm border-b border-gray-100">
      <span className="text-2xl font-black tracking-tight">
        <span className="text-brand">acha</span>
        <span className="text-brand-yellow">dinhos</span>
      </span>
      <div className="flex gap-2">
        <button
          aria-label="Buscar"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-lg"
        >
          🔍
        </button>
        <button
          aria-label="Notificações"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-lg"
        >
          🔔
        </button>
      </div>
    </header>
  )
}
```

- [ ] **Verificar build**

```bash
npm run build
```

Expected: sem erros

- [ ] **Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: add Header component"
```

---

## Task 6: HeroBanner

**Files:**
- Create: `src/components/HeroBanner.tsx`

- [ ] **Criar `src/components/HeroBanner.tsx`**

```tsx
import Link from 'next/link'

export default function HeroBanner() {
  return (
    <section
      className="relative overflow-hidden px-5 pb-8 pt-7"
      style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 50%, #FFD23F 100%)' }}
    >
      {/* Círculos decorativos */}
      <div className="absolute -right-5 -top-5 h-36 w-36 rounded-full bg-white/10" />
      <div className="absolute bottom-[-30px] right-8 h-24 w-24 rounded-full bg-white/[0.06]" />

      <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-white/85">
        ✨ Curadoria semanal
      </p>
      <h1 className="mb-1.5 text-[26px] font-black leading-tight tracking-tight text-white">
        Os melhores<br />achados pra você
      </h1>
      <p className="mb-5 text-sm text-white/90">
        Produtos selecionados da Amazon e Shopee
      </p>
      <Link
        href="#destaques"
        className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[13px] font-extrabold text-brand shadow-md"
      >
        Ver tudo →
      </Link>
    </section>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/HeroBanner.tsx
git commit -m "feat: add HeroBanner component"
```

---

## Task 7: SectionHeader

**Files:**
- Create: `src/components/SectionHeader.tsx`

- [ ] **Criar `src/components/SectionHeader.tsx`**

```tsx
import Link from 'next/link'

interface SectionHeaderProps {
  title: string
  href?: string
  linkLabel?: string
}

export default function SectionHeader({ title, href, linkLabel = 'Ver mais →' }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 pb-3 pt-5">
      <h2 className="text-[13px] font-extrabold uppercase tracking-wide text-gray-900">
        {title}
      </h2>
      {href && (
        <Link href={href} className="text-xs font-semibold text-brand">
          {linkLabel}
        </Link>
      )}
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/SectionHeader.tsx
git commit -m "feat: add SectionHeader component"
```

---

## Task 8: CategoryGrid

**Files:**
- Create: `src/components/CategoryGrid.tsx`

- [ ] **Criar `src/components/CategoryGrid.tsx`**

```tsx
import Link from 'next/link'
import type { Categoria } from '../types'

interface CategoryGridProps {
  categorias: Categoria[]
  slugAtivo?: string
}

export default function CategoryGrid({ categorias, slugAtivo }: CategoryGridProps) {
  return (
    <div className="flex flex-wrap justify-center gap-x-2.5 gap-y-4 px-5 pb-5">
      {categorias.map(cat => {
        const ativo = cat.slug === slugAtivo
        return (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className="flex flex-col items-center gap-1.5"
          >
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-sm"
              style={{ background: cat.cor }}
            >
              {cat.emoji}
            </div>
            <span
              className={`text-[10px] font-bold ${ativo ? 'text-brand' : 'text-gray-500'}`}
            >
              {cat.nome}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/CategoryGrid.tsx
git commit -m "feat: add CategoryGrid component"
```

---

## Task 9: ProductCard

**Files:**
- Create: `src/components/ProductCard.tsx`

- [ ] **Criar `src/components/ProductCard.tsx`**

```tsx
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
      <div className="m-2.5 mt-2 rounded-lg bg-brand py-2 text-center text-[11px] font-bold text-white">
        Ver oferta →
      </div>
    </a>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/ProductCard.tsx
git commit -m "feat: add ProductCard component"
```

---

## Task 10: ProductGrid

**Files:**
- Create: `src/components/ProductGrid.tsx`

- [ ] **Criar `src/components/ProductGrid.tsx`**

```tsx
import ProductCard from './ProductCard'
import type { Produto, Categoria } from '../types'

interface ProductGridProps {
  produtos: Produto[]
  categorias: Categoria[]
}

export default function ProductGrid({ produtos, categorias }: ProductGridProps) {
  // Monta um mapa id → categoria percorrendo os produtos de cada categoria
  const catPorIdProduto = new Map<string, Categoria>()
  for (const cat of categorias) {
    for (const p of cat.produtos) {
      catPorIdProduto.set(p.id, cat)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 px-5">
      {produtos.map(produto => (
        <ProductCard
          key={produto.id}
          produto={produto}
          categoria={catPorIdProduto.get(produto.id) ?? categorias[0]}
        />
      ))}
    </div>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/ProductGrid.tsx
git commit -m "feat: add ProductGrid component"
```

---

## Task 11: BottomNav

**Files:**
- Create: `src/components/BottomNav.tsx`

- [ ] **Criar `src/components/BottomNav.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ITENS = [
  { href: '/', label: 'Início', emoji: '🏠' },
  { href: '/buscar', label: 'Buscar', emoji: '🔍' },
  { href: '/ofertas', label: 'Ofertas', emoji: '🔥' },
  { href: '/categorias', label: 'Categorias', emoji: '📂' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 flex justify-around border-t border-gray-100 bg-white pb-4 pt-2.5 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      {ITENS.map(item => {
        const ativo = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 text-[9px] font-semibold ${
              ativo ? 'text-brand' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">{item.emoji}</span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
```

- [ ] **Commit**

```bash
git add src/components/BottomNav.tsx
git commit -m "feat: add BottomNav client component"
```

---

## Task 12: Homepage (app/page.tsx)

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Substituir todo o conteúdo de `src/app/page.tsx` por:**

```tsx
import { getCategorias, getProdutosDestaque } from '../lib/produtos'
import Header from '../components/Header'
import HeroBanner from '../components/HeroBanner'
import SectionHeader from '../components/SectionHeader'
import CategoryGrid from '../components/CategoryGrid'
import ProductGrid from '../components/ProductGrid'
import BottomNav from '../components/BottomNav'

export default function HomePage() {
  const categorias = getCategorias()
  const destaques = getProdutosDestaque()

  return (
    <div className="min-h-screen bg-page-bg pb-20">
      <Header />
      <HeroBanner />

      <SectionHeader title="Categorias" href="/" linkLabel="Ver todas →" />
      <CategoryGrid categorias={categorias} />

      <SectionHeader id="destaques" title="🔥 Em destaque" href="/" linkLabel="Ver mais →" />
      <ProductGrid produtos={destaques} categorias={categorias} />

      <BottomNav />
    </div>
  )
}
```

**Nota:** O atributo `id="destaques"` em SectionHeader não existe ainda — adicione a prop `id?: string` ao componente `SectionHeader.tsx` e aplique no `<div>` raiz.

- [ ] **Adicionar prop `id` ao SectionHeader** — abrir `src/components/SectionHeader.tsx` e atualizar:

```tsx
interface SectionHeaderProps {
  title: string
  href?: string
  linkLabel?: string
  id?: string
}

export default function SectionHeader({ title, href, linkLabel = 'Ver mais →', id }: SectionHeaderProps) {
  return (
    <div id={id} className="flex items-center justify-between px-5 pb-3 pt-5">
```

- [ ] **Rodar em dev e verificar visualmente**

```bash
npm run dev
```

Abrir http://localhost:3000 e confirmar: header, hero, categorias centralizadas, grid 2 colunas.

- [ ] **Build de produção**

```bash
npm run build
```

Expected: sem erros

- [ ] **Commit**

```bash
git add src/app/page.tsx src/components/SectionHeader.tsx
git commit -m "feat: implement homepage with hero, categories, and product grid"
```

---

## Task 13: Página de Categoria (app/[categoria]/page.tsx)

**Files:**
- Create: `src/app/[categoria]/page.tsx`

- [ ] **Criar pasta e arquivo `src/app/[categoria]/page.tsx`**

```tsx
import { notFound } from 'next/navigation'
import { getCategorias, getCategoria } from '../../lib/produtos'
import Header from '../../components/Header'
import SectionHeader from '../../components/SectionHeader'
import CategoryGrid from '../../components/CategoryGrid'
import ProductGrid from '../../components/ProductGrid'
import BottomNav from '../../components/BottomNav'

interface PageProps {
  params: Promise<{ categoria: string }>
}

export async function generateStaticParams() {
  const categorias = getCategorias()
  return categorias.map(c => ({ categoria: c.slug }))
}

export default async function CategoriaPage({ params }: PageProps) {
  const { categoria: slug } = await params
  const cat = getCategoria(slug)

  if (!cat) notFound()

  const categorias = getCategorias()

  return (
    <div className="min-h-screen bg-page-bg pb-20">
      <Header />

      {/* Mini banner da categoria */}
      <section
        className="px-5 py-6"
        style={{ background: cat.cor }}
      >
        <p className="text-3xl">{cat.emoji}</p>
        <h1 className="mt-1 text-xl font-black text-gray-900">
          {cat.nome}
        </h1>
        <p className="text-sm text-gray-500">{cat.descricao}</p>
        <p className="mt-1 text-xs font-semibold text-brand">
          {cat.produtos.length} achados
        </p>
      </section>

      <SectionHeader title="Categorias" />
      <CategoryGrid categorias={categorias} slugAtivo={slug} />

      <SectionHeader title={`Todos os achados — ${cat.nome}`} />
      <ProductGrid produtos={cat.produtos} categorias={categorias} />

      <BottomNav />
    </div>
  )
}
```

- [ ] **Rodar em dev e verificar**

```bash
npm run dev
```

Abrir http://localhost:3000/pets e confirmar: mini banner laranja, categoria ativa destacada, produtos da categoria.

- [ ] **Build de produção**

```bash
npm run build
```

Expected: sem erros. Confirmar que as 6 rotas foram geradas estaticamente (output do build mostra `/pets`, `/games`, etc.)

- [ ] **Commit**

```bash
git add src/app/[categoria]/page.tsx
git commit -m "feat: add category page with static generation"
```

---

## Task 14: Metadata e ajustes finais

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Atualizar metadata em `src/app/layout.tsx`**

Substituir o bloco `export const metadata`:

```tsx
export const metadata: Metadata = {
  title: 'Achadinhos — Os melhores achados da internet',
  description: 'Produtos selecionados da Amazon e Shopee organizados por categoria. Pets, Games, Esporte, Livros, Roupas e Casa.',
}
```

- [ ] **Atualizar `lang` do `<html>` para `pt-BR`**

```tsx
<html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
```

- [ ] **Build final + lint**

```bash
npm run build && npm run lint
```

Expected: sem erros em ambos

- [ ] **Commit final**

```bash
git add src/app/layout.tsx
git commit -m "chore: update metadata and lang to pt-BR"
```

---

## Verificação Final

Após todos os tasks, confirmar manualmente:

1. `/` — homepage: header, hero, 6 categorias centralizadas, grid 2 colunas com produtos de destaque
2. `/pets` — produtos filtrados, categoria ativa em laranja, mini banner colorido
3. `/games`, `/esporte`, `/livros`, `/roupas`, `/casa` — idem
4. `npm run build` sem warnings de TypeScript
5. Responsividade mobile (DevTools → iPhone 14)
