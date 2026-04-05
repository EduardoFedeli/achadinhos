# Achadinhos Full Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the current light-theme MVP into the full "Dark & Bold" Achadinhos site with per-category filtering, a `/sobre` page, and a password-protected admin CRUD panel.

**Architecture:** Public site is Next.js App Router with static generation; filter state lives client-side in a `'use client'` wrapper around the category page body. Admin panel is fully server-rendered with httpOnly cookie auth and file-system JSON mutations via API Route Handlers.

**Tech Stack:** Next.js 16.2.2, React 19, Tailwind v4, shadcn v4 (Sheet, Slider, Badge, Input, Label, Select, Switch, Table, Dialog), Vitest for unit tests, Node.js `fs` for JSON writes.

---

## Current state (as of plan writing)

| File                               | Status                                                                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `src/types/index.ts`               | exists — missing `preco_original`, `desconto_pct`, `novo`, `tags`; `preco` is `string` (must become `number`); `Loja` type too narrow |
| `src/data/produtos.json`           | exists — wrong colors (pastels), string prices, no discount fields, 4 products/cat                                                    |
| `src/lib/produtos.ts`              | exists — missing `getProdutos(slug, filtros)` and `getProdutosOferta()`                                                               |
| `src/lib/produtos.test.ts`         | exists — passes; needs update for new functions                                                                                       |
| `src/app/globals.css`              | exists — light theme; must become Dark & Bold                                                                                         |
| `src/app/layout.tsx`               | exists — Geist font; must switch to Inter + add `dark` class                                                                          |
| `src/components/Header.tsx`        | exists — light bg; must be dark                                                                                                       |
| `src/components/ProductCard.tsx`   | exists — light; must be dark + badges + numeric price                                                                                 |
| `src/components/CategoryGrid.tsx`  | exists — light                                                                                                                        |
| `src/components/HeroBanner.tsx`    | exists — orange gradient; keep for home                                                                                               |
| `src/components/ProductGrid.tsx`   | exists — light                                                                                                                        |
| `src/components/SectionHeader.tsx` | exists — light text                                                                                                                   |
| `src/components/BottomNav.tsx`     | exists — light                                                                                                                        |
| `src/app/page.tsx`                 | exists — functional                                                                                                                   |
| `src/app/[categoria]/page.tsx`     | exists — light, no filters                                                                                                            |
| `src/components/ui/button.tsx`     | exists — only shadcn component installed                                                                                              |

## Files to Create/Modify

```
MODIFY  src/app/globals.css                      # Dark & Bold theme tokens + shadcn dark vars
MODIFY  src/app/layout.tsx                       # Inter font, dark class on <html>
MODIFY  src/types/index.ts                       # New fields, preco: number, wider Loja
MODIFY  src/data/produtos.json                   # Rebuild: correct colors, 6 products/4 cats
MODIFY  src/lib/produtos.ts                      # Add getProdutos + getProdutosOferta + formatarPreco
MODIFY  src/lib/produtos.test.ts                 # Tests for new functions
MODIFY  src/components/Header.tsx                # Dark
MODIFY  src/components/ProductCard.tsx           # Dark + badges + numeric price
MODIFY  src/components/CategoryGrid.tsx          # Dark
MODIFY  src/components/HeroBanner.tsx            # Dark gradient
MODIFY  src/components/ProductGrid.tsx           # responsive grid cols
MODIFY  src/components/SectionHeader.tsx         # Dark text
MODIFY  src/components/BottomNav.tsx             # Dark bg
MODIFY  src/app/[categoria]/page.tsx             # server wrapper only (passes data to client)
CREATE  src/app/[categoria]/CategoriaContent.tsx # 'use client' — filter state + layout
CREATE  src/components/FilterChip.tsx
CREATE  src/components/FilterPanel.tsx           # mobile Sheet + desktop sidebar
CREATE  src/components/PriceRangeSlider.tsx
CREATE  src/app/sobre/page.tsx
CREATE  .env.local
CREATE  src/app/api/admin/login/route.ts
CREATE  src/app/api/admin/logout/route.ts
CREATE  src/app/api/produtos/route.ts            # GET + POST
CREATE  src/app/api/produtos/[id]/route.ts       # PUT + DELETE
CREATE  src/app/api/categorias/route.ts          # POST
CREATE  src/app/api/categorias/[slug]/route.ts   # PUT
CREATE  src/app/admin/page.tsx                   # login form
CREATE  src/app/admin/dashboard/layout.tsx       # sidebar nav
CREATE  src/app/admin/dashboard/page.tsx         # stats summary
CREATE  src/app/admin/dashboard/produtos/page.tsx
CREATE  src/app/admin/dashboard/categorias/page.tsx
CREATE  src/components/admin/ProductForm.tsx     # shared add/edit form
CREATE  src/components/admin/CategoryForm.tsx
```

---

## Task 1: Update design tokens in globals.css

**Files:**

- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace globals.css with the Dark & Bold theme**

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* Brand */
  --color-brand: #f97316;
  --color-brand-yellow: #ffd23f;

  /* Layout backgrounds */
  --color-page-bg: #0f0f13;
  --color-surface: #1a1a24;
  --color-card-bg: #1e1e2e;
  --color-card-border: #2a2a3e;

  /* shadcn token aliases */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);

  --font-sans: var(--font-inter);
  --font-mono: var(--font-geist-mono);
}

/* ───── Light (unused — site is always dark) ───── */
:root {
  --background: #0f0f13;
  --foreground: #f9fafb;
  --card: #1e1e2e;
  --card-foreground: #f9fafb;
  --popover: #1e1e2e;
  --popover-foreground: #f9fafb;
  --primary: #f97316;
  --primary-foreground: #ffffff;
  --secondary: #1a1a24;
  --secondary-foreground: #f9fafb;
  --muted: #1a1a24;
  --muted-foreground: #9ca3af;
  --accent: #2a2a3e;
  --accent-foreground: #f9fafb;
  --destructive: oklch(0.577 0.245 27.325);
  --border: #2a2a3e;
  --input: #2a2a3e;
  --ring: #f97316;
  --radius: 0.625rem;
  --sidebar: #1a1a24;
  --sidebar-foreground: #f9fafb;
  --sidebar-primary: #f97316;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #2a2a3e;
  --sidebar-accent-foreground: #f9fafb;
  --sidebar-border: #2a2a3e;
  --sidebar-ring: #f97316;
}

.dark {
  --background: #0f0f13;
  --foreground: #f9fafb;
  --card: #1e1e2e;
  --card-foreground: #f9fafb;
  --popover: #1e1e2e;
  --popover-foreground: #f9fafb;
  --primary: #f97316;
  --primary-foreground: #ffffff;
  --secondary: #1a1a24;
  --secondary-foreground: #f9fafb;
  --muted: #1a1a24;
  --muted-foreground: #9ca3af;
  --accent: #2a2a3e;
  --accent-foreground: #f9fafb;
  --destructive: oklch(0.704 0.191 22.216);
  --border: #2a2a3e;
  --input: #2a2a3e;
  --ring: #f97316;
  --sidebar: #1a1a24;
  --sidebar-foreground: #f9fafb;
  --sidebar-primary: #f97316;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #2a2a3e;
  --sidebar-accent-foreground: #f9fafb;
  --sidebar-border: #2a2a3e;
  --sidebar-ring: #f97316;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
  html {
    @apply font-sans;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "style: apply Dark & Bold theme tokens"
```

---

## Task 2: Switch to Inter font and set dark class on html

**Files:**

- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace layout.tsx**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Achadinhos — Os melhores achados da internet",
  description:
    "Produtos selecionados da Amazon e Shopee organizados por categoria. Pets, Games, Tech, Fitness, Moda e Casa.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-page-bg">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "style: switch to Inter font and force dark class"
```

---

## Task 3: Expand TypeScript types

**Files:**

- Modify: `src/types/index.ts`

- [ ] **Step 1: Replace types/index.ts**

```ts
export type Loja =
  | "amazon"
  | "shopee"
  | "magalu"
  | "mercadolivre"
  | "americanas"
  | "casasbahia"
  | "centauro"
  | "aliexpress";

export interface Produto {
  id: string;
  nome: string;
  preco: number;
  preco_original?: number;
  desconto_pct?: number;
  imagem: string | null;
  link_afiliado: string;
  loja: Loja;
  tags?: string[];
  destaque: boolean;
  novo?: boolean;
}

export interface Categoria {
  nome: string;
  slug: string;
  emoji: string;
  cor: string; // accent hex, e.g. "#F97316"
  descricao: string;
  produtos: Produto[];
}

export interface ProdutosData {
  categorias: Categoria[];
}

export interface FiltrosProduto {
  lojas?: Loja[];
  precoMin?: number;
  precoMax?: number;
  tags?: string[];
  ordenar?: "menor-preco" | "maior-desconto" | "az";
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: expand Produto types with discount, tags, novo fields"
```

---

## Task 4: Rebuild produtos.json

**Files:**

- Modify: `src/data/produtos.json`

The `cor` field is the accent hex (used for hero, badges, active filters).  
`preco` is a number (BRL, no formatting). `imagem` uses Unsplash keyword URLs.

- [ ] **Step 1: Replace src/data/produtos.json**

```json
{
  "categorias": [
    {
      "nome": "Pets",
      "slug": "pets",
      "emoji": "🐾",
      "cor": "#F97316",
      "descricao": "Tudo para seu bichinho",
      "produtos": [
        {
          "id": "pet-001",
          "nome": "Coleira ajustável premium para cães médios",
          "preco": 49.9,
          "preco_original": 79.9,
          "desconto_pct": 37,
          "imagem": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "tags": ["cachorro", "coleira"],
          "destaque": true,
          "novo": false
        },
        {
          "id": "pet-002",
          "nome": "Comedouro automático com timer programável",
          "preco": 129.9,
          "preco_original": 169.9,
          "desconto_pct": 24,
          "imagem": "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=400&h=400&fit=crop",
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "tags": ["cachorro", "gato", "alimentacao"],
          "destaque": false,
          "novo": true
        },
        {
          "id": "pet-003",
          "nome": "Arranhador em sisal para gatos 60cm",
          "preco": 39.9,
          "imagem": "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&h=400&fit=crop",
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "tags": ["gato", "brinquedos"],
          "destaque": true,
          "novo": false
        },
        {
          "id": "pet-004",
          "nome": "Ração premium para cães adultos 15kg",
          "preco": 189.9,
          "preco_original": 229.9,
          "desconto_pct": 17,
          "imagem": "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&h=400&fit=crop",
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "tags": ["cachorro", "alimentacao"],
          "destaque": false,
          "novo": false
        },
        {
          "id": "pet-005",
          "nome": "Cama aconchegante lavável para cães e gatos",
          "preco": 89.9,
          "preco_original": 119.9,
          "desconto_pct": 25,
          "imagem": "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop",
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "tags": ["cachorro", "gato", "camas-casinhas"],
          "destaque": true,
          "novo": false
        },
        {
          "id": "pet-006",
          "nome": "Kit higiene pet — escova + shampoo + perfume",
          "preco": 59.9,
          "imagem": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "tags": ["cachorro", "gato", "higiene"],
          "destaque": false,
          "novo": true
        }
      ]
    },
    {
      "nome": "Games",
      "slug": "games",
      "emoji": "🎮",
      "cor": "#7C3AED",
      "descricao": "Equipamentos e acessórios gamer",
      "produtos": [
        {
          "id": "games-001",
          "nome": "Controle sem fio gamer com LED RGB",
          "preco": 129.9,
          "preco_original": 179.9,
          "desconto_pct": 28,
          "imagem": "https://images.unsplash.com/photo-1592840062661-a5a7f78e2056?w=400&h=400&fit=crop",
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "tags": ["acessorios", "pc", "xbox"],
          "destaque": true,
          "novo": false
        },
        {
          "id": "games-002",
          "nome": "Headset gamer 7.1 surround com microfone",
          "preco": 149.9,
          "preco_original": 199.9,
          "desconto_pct": 25,
          "imagem": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop",
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "tags": ["acessorios", "pc"],
          "destaque": false,
          "novo": false
        },
        {
          "id": "games-003",
          "nome": "Mousepad gamer XL 80x40cm antiderrapante",
          "preco": 59.9,
          "imagem": "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop",
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "tags": ["acessorios", "pc"],
          "destaque": true,
          "novo": false
        },
        {
          "id": "games-004",
          "nome": "Cadeira gamer ergonômica com apoio lombar",
          "preco": 899.9,
          "preco_original": 1199.9,
          "desconto_pct": 25,
          "imagem": "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop",
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "tags": ["acessorios", "pc"],
          "destaque": false,
          "novo": false
        },
        {
          "id": "games-005",
          "nome": "Teclado mecânico gamer switches blue",
          "preco": 199.9,
          "preco_original": 279.9,
          "desconto_pct": 29,
          "imagem": "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&h=400&fit=crop",
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "tags": ["acessorios", "pc"],
          "destaque": true,
          "novo": true
        },
        {
          "id": "games-006",
          "nome": "Mouse gamer 12000 DPI RGB ajustável",
          "preco": 89.9,
          "preco_original": 129.9,
          "desconto_pct": 31,
          "imagem": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "tags": ["acessorios", "pc"],
          "destaque": false,
          "novo": false
        }
      ]
    },
    {
      "nome": "Tech",
      "slug": "tech",
      "emoji": "💻",
      "cor": "#3B82F6",
      "descricao": "Gadgets e eletrônicos que valem",
      "produtos": [
        {
          "id": "tech-001",
          "nome": "Fone de ouvido TWS com cancelamento de ruído",
          "preco": 199.9,
          "preco_original": 299.9,
          "desconto_pct": 33,
          "imagem": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "tags": ["audio"],
          "destaque": true,
          "novo": false
        },
        {
          "id": "tech-002",
          "nome": "Carregador turbo 65W GaN 3 portas USB-C",
          "preco": 89.9,
          "preco_original": 129.9,
          "desconto_pct": 31,
          "imagem": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop",
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "tags": ["carregadores"],
          "destaque": false,
          "novo": true
        },
        {
          "id": "tech-003",
          "nome": "Câmera de ação 4K com estabilizador",
          "preco": 349.9,
          "preco_original": 499.9,
          "desconto_pct": 30,
          "imagem": "https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=400&h=400&fit=crop",
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "tags": ["cameras"],
          "destaque": true,
          "novo": false
        },
        {
          "id": "tech-004",
          "nome": "Suporte articulado monitor + webcam desk",
          "preco": 79.9,
          "imagem": "https://images.unsplash.com/photo-1593642632532-3e22e7c48f0b?w=400&h=400&fit=crop",
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "tags": ["acessorios"],
          "destaque": false,
          "novo": false
        },
        {
          "id": "tech-005",
          "nome": "Hub USB-C 7 em 1 com HDMI 4K e ethernet",
          "preco": 149.9,
          "preco_original": 199.9,
          "desconto_pct": 25,
          "imagem": "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=400&h=400&fit=crop",
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "tags": ["acessorios", "carregadores"],
          "destaque": false,
          "novo": true
        },
        {
          "id": "tech-006",
          "nome": "Caixa de som Bluetooth portátil 20W à prova d'água",
          "preco": 159.9,
          "preco_original": 219.9,
          "desconto_pct": 27,
          "imagem": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "tags": ["audio"],
          "destaque": true,
          "novo": false
        }
      ]
    },
    {
      "nome": "Fitness",
      "slug": "fitness",
      "emoji": "💪",
      "cor": "#22C55E",
      "descricao": "Para quem não para quieto",
      "produtos": [
        {
          "id": "fitness-001",
          "nome": "Kit halter emborrachado 2x5kg + 2x3kg",
          "preco": 149.9,
          "preco_original": 199.9,
          "desconto_pct": 25,
          "imagem": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "tags": ["musculacao"],
          "destaque": true,
          "novo": false
        },
        {
          "id": "fitness-002",
          "nome": "Tapete de yoga antiderrapante 6mm dupla face",
          "preco": 89.9,
          "preco_original": 119.9,
          "desconto_pct": 25,
          "imagem": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "tags": ["yoga"],
          "destaque": false,
          "novo": false
        },
        {
          "id": "fitness-003",
          "nome": "Corda de pular com contador digital smart",
          "preco": 49.9,
          "imagem": "https://images.unsplash.com/photo-1434596922112-19c563067271?w=400&h=400&fit=crop",
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "tags": ["cardio"],
          "destaque": true,
          "novo": true
        },
        {
          "id": "fitness-004",
          "nome": "Whey protein concentrado 1kg baunilha",
          "preco": 129.9,
          "preco_original": 179.9,
          "desconto_pct": 28,
          "imagem": "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop",
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "tags": ["suplementos"],
          "destaque": false,
          "novo": false
        },
        {
          "id": "fitness-005",
          "nome": "Legging fitness cintura alta compressão",
          "preco": 79.9,
          "preco_original": 109.9,
          "desconto_pct": 27,
          "imagem": "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&h=400&fit=crop",
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "tags": ["vestuario"],
          "destaque": true,
          "novo": false
        },
        {
          "id": "fitness-006",
          "nome": "Garrafa squeeze 1L com marcação de hidratação",
          "preco": 39.9,
          "imagem": "https://images.unsplash.com/photo-1550505101-4f5e37fa5e5f?w=400&h=400&fit=crop",
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "tags": ["cardio"],
          "destaque": false,
          "novo": true
        }
      ]
    },
    {
      "nome": "Moda",
      "slug": "moda",
      "emoji": "👗",
      "cor": "#EC4899",
      "descricao": "Estilo sem gastar muito",
      "produtos": [
        {
          "id": "moda-001",
          "nome": "Blusa oversized tie-dye verão unissex",
          "preco": 39.9,
          "imagem": "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=400&fit=crop",
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "tags": ["masculino", "feminino"],
          "destaque": true,
          "novo": false
        },
        {
          "id": "moda-002",
          "nome": "Calça jogger moletom slim fit",
          "preco": 69.9,
          "preco_original": 99.9,
          "desconto_pct": 30,
          "imagem": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "tags": ["masculino"],
          "destaque": false,
          "novo": false
        },
        {
          "id": "moda-003",
          "nome": "Moletom canguru com capuz algodão premium",
          "preco": 89.9,
          "preco_original": 129.9,
          "desconto_pct": 31,
          "imagem": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop",
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "tags": ["masculino", "feminino"],
          "destaque": true,
          "novo": false
        },
        {
          "id": "moda-004",
          "nome": "Vestido midi floral verão — tamanhos P ao GG",
          "preco": 59.9,
          "imagem": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop",
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "tags": ["feminino"],
          "destaque": false,
          "novo": true
        },
        {
          "id": "moda-005",
          "nome": "Tênis casual unissex sola plataforma",
          "preco": 119.9,
          "preco_original": 159.9,
          "desconto_pct": 25,
          "imagem": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "tags": ["calcados"],
          "destaque": true,
          "novo": false
        },
        {
          "id": "moda-006",
          "nome": "Relógio feminino analógico caixa dourada",
          "preco": 99.9,
          "preco_original": 149.9,
          "desconto_pct": 33,
          "imagem": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "tags": ["acessorios", "feminino"],
          "destaque": false,
          "novo": false
        }
      ]
    },
    {
      "nome": "Casa",
      "slug": "casa",
      "emoji": "🏠",
      "cor": "#EAB308",
      "descricao": "Deixa sua casa mais bonita",
      "produtos": [
        {
          "id": "casa-001",
          "nome": "Luminária LED de mesa touch recarregável",
          "preco": 59.9,
          "preco_original": 89.9,
          "desconto_pct": 33,
          "imagem": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "tags": ["decoracao"],
          "destaque": true,
          "novo": false
        },
        {
          "id": "casa-002",
          "nome": "Suporte articulado para celular — mesa e cama",
          "preco": 29.9,
          "imagem": "https://images.unsplash.com/photo-1583394293214-0b7b9ae04b3d?w=400&h=400&fit=crop",
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "tags": ["organizacao"],
          "destaque": false,
          "novo": false
        },
        {
          "id": "casa-003",
          "nome": "Organizador de gaveta modular 10 peças",
          "preco": 49.9,
          "preco_original": 69.9,
          "desconto_pct": 29,
          "imagem": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "tags": ["organizacao"],
          "destaque": true,
          "novo": false
        },
        {
          "id": "casa-004",
          "nome": "Difusor de aromas elétrico ultrassônico 400ml",
          "preco": 79.9,
          "preco_original": 109.9,
          "desconto_pct": 27,
          "imagem": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "tags": ["decoracao"],
          "destaque": false,
          "novo": true
        },
        {
          "id": "casa-005",
          "nome": "Panela antiaderente 24cm cabo baquelite",
          "preco": 89.9,
          "preco_original": 129.9,
          "desconto_pct": 31,
          "imagem": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
          "link_afiliado": "https://amzn.to/exemplo",
          "loja": "amazon",
          "tags": ["cozinha"],
          "destaque": true,
          "novo": false
        },
        {
          "id": "casa-006",
          "nome": "Vassourinha elétrica portátil recarregável",
          "preco": 99.9,
          "preco_original": 149.9,
          "desconto_pct": 33,
          "imagem": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop",
          "link_afiliado": "https://shopee.com.br/exemplo",
          "loja": "shopee",
          "tags": ["limpeza"],
          "destaque": false,
          "novo": false
        }
      ]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/produtos.json
git commit -m "feat: rebuild produtos.json with dark colors, discounts, 6 products per category"
```

---

## Task 5: Update lib/produtos.ts and tests

**Files:**

- Modify: `src/lib/produtos.ts`
- Modify: `src/lib/produtos.test.ts`

- [ ] **Step 1: Write failing tests first**

Replace `src/lib/produtos.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  getCategorias,
  getCategoria,
  getProdutosDestaque,
  getProdutos,
  getProdutosOferta,
  formatarPreco,
} from "./produtos";

describe("getCategorias", () => {
  it("retorna todas as categorias", () => {
    const cats = getCategorias();
    expect(cats.length).toBeGreaterThanOrEqual(4);
  });

  it("cada categoria tem slug, nome, emoji e cor hex", () => {
    for (const cat of getCategorias()) {
      expect(cat.slug).toBeTruthy();
      expect(cat.nome).toBeTruthy();
      expect(cat.emoji).toBeTruthy();
      expect(cat.cor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});

describe("getCategoria", () => {
  it("retorna a categoria pelo slug", () => {
    const cat = getCategoria("pets");
    expect(cat?.nome).toBe("Pets");
  });

  it("retorna null para slug inexistente", () => {
    expect(getCategoria("nao-existe")).toBeNull();
  });
});

describe("getProdutosDestaque", () => {
  it("retorna apenas produtos com destaque: true", () => {
    expect(getProdutosDestaque().every((p) => p.destaque)).toBe(true);
  });

  it("aceita limite opcional", () => {
    expect(getProdutosDestaque(3)).toHaveLength(3);
  });
});

describe("getProdutos", () => {
  it("retorna todos os produtos da categoria sem filtros", () => {
    const produtos = getProdutos("pets");
    expect(produtos.length).toBeGreaterThanOrEqual(6);
  });

  it("filtra por loja", () => {
    const amazon = getProdutos("pets", { lojas: ["amazon"] });
    expect(amazon.every((p) => p.loja === "amazon")).toBe(true);
  });

  it("filtra por faixa de preço", () => {
    const baratos = getProdutos("pets", { precoMin: 0, precoMax: 60 });
    expect(baratos.every((p) => p.preco <= 60)).toBe(true);
  });

  it("filtra por tag", () => {
    const cachorro = getProdutos("pets", { tags: ["cachorro"] });
    expect(cachorro.every((p) => p.tags?.includes("cachorro"))).toBe(true);
  });

  it("ordena por menor preço", () => {
    const produtos = getProdutos("pets", { ordenar: "menor-preco" });
    for (let i = 1; i < produtos.length; i++) {
      expect(produtos[i].preco).toBeGreaterThanOrEqual(produtos[i - 1].preco);
    }
  });

  it("ordena por maior desconto", () => {
    const produtos = getProdutos("pets", { ordenar: "maior-desconto" });
    for (let i = 1; i < produtos.length; i++) {
      const a = produtos[i - 1].desconto_pct ?? 0;
      const b = produtos[i].desconto_pct ?? 0;
      expect(a).toBeGreaterThanOrEqual(b);
    }
  });

  it("ordena a-z", () => {
    const produtos = getProdutos("pets", { ordenar: "az" });
    for (let i = 1; i < produtos.length; i++) {
      expect(
        produtos[i].nome.localeCompare(produtos[i - 1].nome),
      ).toBeGreaterThanOrEqual(0);
    }
  });

  it("retorna array vazio para slug inexistente", () => {
    expect(getProdutos("nao-existe")).toHaveLength(0);
  });
});

describe("getProdutosOferta", () => {
  it("retorna apenas produtos com desconto_pct > 0", () => {
    const oferta = getProdutosOferta();
    expect(oferta.every((p) => (p.desconto_pct ?? 0) > 0)).toBe(true);
  });

  it("ordena por maior desconto primeiro", () => {
    const oferta = getProdutosOferta();
    for (let i = 1; i < oferta.length; i++) {
      expect(oferta[i - 1].desconto_pct!).toBeGreaterThanOrEqual(
        oferta[i].desconto_pct!,
      );
    }
  });
});

describe("formatarPreco", () => {
  it("formata número como BRL", () => {
    expect(formatarPreco(49.9)).toMatch(/R\$/);
    expect(formatarPreco(49.9)).toMatch(/49/);
  });
});
```

- [ ] **Step 2: Run tests — expect failures**

```bash
npm test
```

Expected: FAIL on `getProdutos`, `getProdutosOferta`, `formatarPreco` not defined

- [ ] **Step 3: Implement lib/produtos.ts**

Replace `src/lib/produtos.ts`:

```ts
import data from "../data/produtos.json";
import type { Categoria, Produto, FiltrosProduto } from "../types";

const { categorias } = data as { categorias: Categoria[] };

export function formatarPreco(preco: number): string {
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function getCategorias(): Categoria[] {
  return categorias;
}

export function getCategoria(slug: string): Categoria | null {
  return categorias.find((c) => c.slug === slug) ?? null;
}

export function getProdutosDestaque(limite?: number): Produto[] {
  const todos = categorias.flatMap((c) => c.produtos.filter((p) => p.destaque));
  return limite !== undefined ? todos.slice(0, limite) : todos;
}

export function getProdutos(
  slug: string,
  filtros: FiltrosProduto = {},
): Produto[] {
  const cat = categorias.find((c) => c.slug === slug);
  if (!cat) return [];

  let produtos = [...cat.produtos];

  if (filtros.lojas && filtros.lojas.length > 0) {
    produtos = produtos.filter((p) => filtros.lojas!.includes(p.loja));
  }

  if (filtros.precoMin !== undefined) {
    produtos = produtos.filter((p) => p.preco >= filtros.precoMin!);
  }

  if (filtros.precoMax !== undefined) {
    produtos = produtos.filter((p) => p.preco <= filtros.precoMax!);
  }

  if (filtros.tags && filtros.tags.length > 0) {
    produtos = produtos.filter((p) =>
      filtros.tags!.some((tag) => p.tags?.includes(tag)),
    );
  }

  if (filtros.ordenar === "menor-preco") {
    produtos.sort((a, b) => a.preco - b.preco);
  } else if (filtros.ordenar === "maior-desconto") {
    produtos.sort((a, b) => (b.desconto_pct ?? 0) - (a.desconto_pct ?? 0));
  } else if (filtros.ordenar === "az") {
    produtos.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }

  return produtos;
}

export function getProdutosOferta(): Produto[] {
  return categorias
    .flatMap((c) => c.produtos)
    .filter((p) => (p.desconto_pct ?? 0) > 0)
    .sort((a, b) => (b.desconto_pct ?? 0) - (a.desconto_pct ?? 0));
}
```

- [ ] **Step 4: Run tests — expect all pass**

```bash
npm test
```

Expected: all tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/produtos.ts src/lib/produtos.test.ts
git commit -m "feat: add getProdutos with filters, getProdutosOferta, formatarPreco"
```

---

## Task 6: Install required shadcn components

**Files:** none (CLI installs into `src/components/ui/`)

These components are needed before building filter UI and admin.

- [ ] **Step 1: Install all required components**

```bash
npx shadcn add sheet slider badge input label select switch table dialog separator
```

When prompted for overwrite of `button.tsx`, choose **yes** to get the updated version.

- [ ] **Step 2: Verify files were created**

```bash
ls src/components/ui/
```

Expected: `button.tsx`, `sheet.tsx`, `slider.tsx`, `badge.tsx`, `input.tsx`, `label.tsx`, `select.tsx`, `switch.tsx`, `table.tsx`, `dialog.tsx`, `separator.tsx` (plus any deps)

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/
git commit -m "chore: install shadcn sheet, slider, badge, input, label, select, switch, table, dialog, separator"
```

---

## Task 7: Update Header to dark theme

**Files:**

- Modify: `src/components/Header.tsx`

- [ ] **Step 1: Replace Header.tsx**

```tsx
import Link from "next/link";
import { getCategorias } from "@/lib/produtos";

export default function Header() {
  const categorias = await getCategorias();

  return (
    <header className="sticky top-0 z-20 bg-surface border-b border-card-border">
      {/* Row 1: logo + icons */}
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-2xl font-black tracking-tight">
          <span className="font-light text-white">acha</span>
          <span className="font-bold text-white">dinhos</span>
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Buscar"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg"
          >
            🔍
          </button>
          <button
            type="button"
            aria-label="Notificações"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg"
          >
            🔔
          </button>
        </div>
      </div>
      {/* Row 2: category chips — horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none">
        {categorias.map((cat) => (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/20"
          >
            <span>{cat.emoji}</span>
            <span>{cat.nome}</span>
          </Link>
        ))}
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Header.tsx
git commit -m "style: update Header to dark theme with category nav row"
```

---

## Task 8: Update ProductCard to dark theme with badges and numeric price

**Files:**

- Modify: `src/components/ProductCard.tsx`

- [ ] **Step 1: Replace ProductCard.tsx**

```tsx
import Image from "next/image";
import type { Produto, Categoria } from "@/types";
import { formatarPreco } from "@/lib/produtos";

interface ProductCardProps {
  produto: Produto;
  categoria: Categoria;
}

const LOJA_LABEL: Record<string, string> = {
  amazon: "Amazon",
  shopee: "Shopee",
  magalu: "Magalu",
  mercadolivre: "Mercado Livre",
  americanas: "Americanas",
  casasbahia: "Casas Bahia",
  centauro: "Centauro",
  aliexpress: "AliExpress",
};

export default function ProductCard({ produto, categoria }: ProductCardProps) {
  const accentColor = categoria.cor;

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
          <p className="text-[15px] font-black" style={{ color: accentColor }}>
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
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProductCard.tsx
git commit -m "style: dark ProductCard with badges, discount display, numeric price"
```

---

## Task 9: Update remaining display components to dark theme

**Files:**

- Modify: `src/components/CategoryGrid.tsx`
- Modify: `src/components/HeroBanner.tsx`
- Modify: `src/components/ProductGrid.tsx`
- Modify: `src/components/SectionHeader.tsx`
- Modify: `src/components/BottomNav.tsx`

- [ ] **Step 1: Update CategoryGrid.tsx**

```tsx
import Link from "next/link";
import type { Categoria } from "@/types";

interface CategoryGridProps {
  categorias: Categoria[];
  slugAtivo?: string;
}

export default function CategoryGrid({
  categorias,
  slugAtivo,
}: CategoryGridProps) {
  return (
    <div className="flex flex-wrap justify-center gap-x-3 gap-y-4 px-5 pb-5">
      {categorias.map((cat) => {
        const ativo = cat.slug === slugAtivo;
        return (
          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className="flex flex-col items-center gap-1.5"
          >
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
              style={{
                backgroundColor: ativo ? cat.cor : "rgba(255,255,255,0.08)",
                boxShadow: ativo ? `0 0 12px ${cat.cor}66` : undefined,
              }}
            >
              {cat.emoji}
            </div>
            <span
              className={`text-[10px] font-bold ${ativo ? "text-white" : "text-muted-foreground"}`}
              style={ativo ? { color: cat.cor } : undefined}
            >
              {cat.nome}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Update HeroBanner.tsx**

```tsx
import Link from "next/link";

export default function HeroBanner() {
  return (
    <section
      className="relative overflow-hidden px-5 pb-8 pt-7"
      style={{
        background:
          "linear-gradient(135deg, #F97316 0%, #EA580C 50%, #9A3412 100%)",
      }}
    >
      <div className="absolute -right-5 -top-5 h-36 w-36 rounded-full bg-white/10" />
      <div className="absolute bottom-[-30px] right-8 h-24 w-24 rounded-full bg-white/[0.06]" />

      <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-white/85">
        ✨ Curadoria semanal
      </p>
      <h1 className="mb-1.5 text-[26px] font-black leading-tight tracking-tight text-white">
        Os melhores
        <br />
        achadinhos pra você
      </h1>
      <p className="mb-5 text-sm text-white/90">
        Produtos selecionados da Amazon e Shopee
      </p>
      <Link
        href="#destaques"
        className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[13px] font-extrabold text-[#F97316] shadow-md"
      >
        Ver tudo →
      </Link>
    </section>
  );
}
```

- [ ] **Step 3: Update ProductGrid.tsx** (add responsive grid cols)

```tsx
import ProductCard from "./ProductCard";
import type { Produto, Categoria } from "@/types";

interface ProductGridProps {
  produtos: Produto[];
  categorias: Categoria[];
}

export default function ProductGrid({
  produtos,
  categorias,
}: ProductGridProps) {
  const catPorIdProduto = new Map<string, Categoria>();
  for (const cat of categorias) {
    for (const p of cat.produtos) {
      catPorIdProduto.set(p.id, cat);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3 px-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-4 lg:gap-5">
      {produtos.map((produto) => {
        const categoria = catPorIdProduto.get(produto.id) ?? categorias[0];
        return (
          <ProductCard
            key={produto.id}
            produto={produto}
            categoria={categoria}
          />
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Update SectionHeader.tsx**

```tsx
import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  href?: string;
  linkLabel?: string;
  id?: string;
}

export default function SectionHeader({
  title,
  href,
  linkLabel = "Ver mais →",
  id,
}: SectionHeaderProps) {
  return (
    <div id={id} className="flex items-center justify-between px-4 pb-3 pt-5">
      <h2 className="text-[13px] font-extrabold uppercase tracking-wide text-white">
        {title}
      </h2>
      {href && (
        <Link href={href} className="text-xs font-semibold text-brand">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Update BottomNav.tsx**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITENS = [
  { href: "/", label: "Início", emoji: "🏠" },
  { href: "/sobre", label: "Sobre", emoji: "ℹ️" },
  { href: "/pets", label: "Pets", emoji: "🐾" },
  { href: "/games", label: "Games", emoji: "🎮" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 flex justify-around border-t border-card-border bg-surface pb-4 pt-2.5">
      {ITENS.map((item) => {
        const ativo = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 text-[9px] font-semibold ${
              ativo ? "text-brand" : "text-muted-foreground"
            }`}
          >
            <span className="text-xl">{item.emoji}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/CategoryGrid.tsx src/components/HeroBanner.tsx src/components/ProductGrid.tsx src/components/SectionHeader.tsx src/components/BottomNav.tsx
git commit -m "style: update all display components to dark theme"
```

---

## Task 10: Create FilterChip component

**Files:**

- Create: `src/components/FilterChip.tsx`

- [ ] **Step 1: Create FilterChip.tsx**

```tsx
interface FilterChipProps {
  label: string;
  ativo: boolean;
  cor?: string;
  onClick: () => void;
}

export default function FilterChip({
  label,
  ativo,
  cor,
  onClick,
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors"
      style={
        ativo
          ? {
              backgroundColor: cor ?? "#F97316",
              borderColor: cor ?? "#F97316",
              color: "#ffffff",
            }
          : {
              backgroundColor: "transparent",
              borderColor: "#2A2A3E",
              color: "#9CA3AF",
            }
      }
    >
      {label}
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/FilterChip.tsx
git commit -m "feat: add FilterChip component"
```

---

## Task 11: Create PriceRangeSlider component

**Files:**

- Create: `src/components/PriceRangeSlider.tsx`

- [ ] **Step 1: Create PriceRangeSlider.tsx**

```tsx
"use client";

import { Slider } from "@/components/ui/slider";
import { formatarPreco } from "@/lib/produtos";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  cor?: string;
}

export default function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  cor,
}: PriceRangeSliderProps) {
  return (
    <div>
      <Slider
        min={min}
        max={max}
        step={10}
        value={value}
        onValueChange={(v) => onChange(v as [number, number])}
        className="my-3"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatarPreco(value[0])}</span>
        <span>{formatarPreco(value[1])}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PriceRangeSlider.tsx
git commit -m "feat: add PriceRangeSlider component"
```

---

## Task 12: Create FilterPanel component

**Files:**

- Create: `src/components/FilterPanel.tsx`

The filter panel renders as:

- **Mobile:** a floating "Filtrar" button (fixed bottom-right) that opens a shadcn `Sheet` from the bottom
- **Desktop (lg:):** a fixed left sidebar (220px) always visible

It receives the current filter state and callbacks to update it.

- [ ] **Step 1: Create FilterPanel.tsx**

```tsx
"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import FilterChip from "@/components/FilterChip";
import PriceRangeSlider from "@/components/PriceRangeSlider";
import type { FiltrosProduto, Loja } from "@/types";
import { SlidersHorizontal } from "lucide-react";

const LOJAS: Loja[] = [
  "amazon",
  "shopee",
  "magalu",
  "mercadolivre",
  "americanas",
  "casasbahia",
  "centauro",
  "aliexpress",
];
const LOJA_LABEL: Record<Loja, string> = {
  amazon: "Amazon",
  shopee: "Shopee",
  magalu: "Magalu",
  mercadolivre: "Mercado Livre",
  americanas: "Americanas",
  casasbahia: "Casas Bahia",
  centauro: "Centauro",
  aliexpress: "AliExpress",
};

interface FilterPanelProps {
  filtros: FiltrosProduto;
  onFiltrosChange: (f: FiltrosProduto) => void;
  tagsDaCategoria: string[];
  precoMaxTotal: number;
  cor: string;
}

function FilterBody({
  filtros,
  onFiltrosChange,
  tagsDaCategoria,
  precoMaxTotal,
  cor,
}: FilterPanelProps) {
  const precoMin = filtros.precoMin ?? 0;
  const precoMax = filtros.precoMax ?? precoMaxTotal;

  function toggleLoja(loja: Loja) {
    const current = filtros.lojas ?? [];
    const next = current.includes(loja)
      ? current.filter((l) => l !== loja)
      : [...current, loja];
    onFiltrosChange({ ...filtros, lojas: next.length > 0 ? next : undefined });
  }

  function toggleTag(tag: string) {
    const current = filtros.tags ?? [];
    const next = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    onFiltrosChange({ ...filtros, tags: next.length > 0 ? next : undefined });
  }

  function setOrdenar(ord: FiltrosProduto["ordenar"]) {
    onFiltrosChange({
      ...filtros,
      ordenar: filtros.ordenar === ord ? undefined : ord,
    });
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      {/* Ordenar */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Ordenar
        </p>
        <div className="flex flex-wrap gap-2">
          {(["menor-preco", "maior-desconto", "az"] as const).map((ord) => {
            const labels = {
              "menor-preco": "Menor preço",
              "maior-desconto": "Maior desconto",
              az: "A-Z",
            };
            return (
              <FilterChip
                key={ord}
                label={labels[ord]}
                ativo={filtros.ordenar === ord}
                cor={cor}
                onClick={() => setOrdenar(ord)}
              />
            );
          })}
        </div>
      </div>

      {/* Faixa de preço */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Faixa de preço
        </p>
        <PriceRangeSlider
          min={0}
          max={precoMaxTotal}
          value={[precoMin, precoMax]}
          onChange={([min, max]) =>
            onFiltrosChange({
              ...filtros,
              precoMin: min > 0 ? min : undefined,
              precoMax: max < precoMaxTotal ? max : undefined,
            })
          }
          cor={cor}
        />
      </div>

      {/* Lojas */}
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Loja
        </p>
        <div className="flex flex-wrap gap-2">
          {LOJAS.map((loja) => (
            <FilterChip
              key={loja}
              label={LOJA_LABEL[loja]}
              ativo={(filtros.lojas ?? []).includes(loja)}
              cor={cor}
              onClick={() => toggleLoja(loja)}
            />
          ))}
        </div>
      </div>

      {/* Tags da categoria */}
      {tagsDaCategoria.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Filtrar por
          </p>
          <div className="flex flex-wrap gap-2">
            {tagsDaCategoria.map((tag) => (
              <FilterChip
                key={tag}
                label={tag}
                ativo={(filtros.tags ?? []).includes(tag)}
                cor={cor}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Limpar */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onFiltrosChange({})}
        className="mt-2 border-card-border text-muted-foreground"
      >
        Limpar filtros
      </Button>
    </div>
  );
}

export default function FilterPanel(props: FilterPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile: floating button + Sheet */}
      <div className="lg:hidden fixed bottom-20 right-4 z-30">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              style={{ backgroundColor: props.cor }}
              className="rounded-full shadow-lg text-white gap-2"
            >
              <SlidersHorizontal size={16} />
              Filtrar
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="bg-surface border-card-border rounded-t-2xl max-h-[80vh] overflow-y-auto"
          >
            <SheetHeader className="px-4 pt-4">
              <SheetTitle className="text-white text-left">Filtros</SheetTitle>
            </SheetHeader>
            <FilterBody {...props} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: static sidebar */}
      <aside className="hidden lg:block w-[220px] shrink-0">
        <div className="sticky top-[100px] rounded-2xl bg-card-bg border border-card-border">
          <p className="px-4 pt-4 text-xs font-bold uppercase tracking-wide text-white">
            Filtros
          </p>
          <FilterBody {...props} />
        </div>
      </aside>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/FilterPanel.tsx
git commit -m "feat: add FilterPanel with mobile Sheet and desktop sidebar"
```

---

## Task 13: Update category page with hero and filters

**Files:**

- Modify: `src/app/[categoria]/page.tsx`
- Create: `src/app/[categoria]/CategoriaContent.tsx`

The category page splits into:

- `page.tsx` — Server Component: fetches data, generates metadata/static params, renders `CategoriaContent`
- `CategoriaContent.tsx` — Client Component: owns filter state, renders hero + filter panel + product grid

- [ ] **Step 1: Create CategoriaContent.tsx**

```tsx
"use client";

import { useState, useMemo } from "react";
import type { Categoria } from "@/types";
import type { FiltrosProduto } from "@/types";
import { getProdutos } from "@/lib/produtos";
import ProductCard from "@/components/ProductCard";
import FilterPanel from "@/components/FilterPanel";
import CategoryGrid from "@/components/CategoryGrid";
import SectionHeader from "@/components/SectionHeader";
import { getCategorias } from "@/lib/produtos";

interface CategoriaContentProps {
  cat: Categoria;
  todasCategorias: Categoria[];
}

// Collect all unique tags from a category's products
function getTagsDaCategoria(cat: Categoria): string[] {
  const set = new Set<string>();
  for (const p of cat.produtos) {
    for (const tag of p.tags ?? []) set.add(tag);
  }
  return Array.from(set).sort();
}

export default function CategoriaContent({
  cat,
  todasCategorias,
}: CategoriaContentProps) {
  const [filtros, setFiltros] = useState<FiltrosProduto>({});

  const precoMaxTotal = useMemo(
    () => Math.ceil(Math.max(...cat.produtos.map((p) => p.preco)) / 10) * 10,
    [cat.produtos],
  );

  const produtosFiltrados = useMemo(
    () => getProdutos(cat.slug, filtros),
    [cat.slug, filtros],
  );

  const tags = useMemo(() => getTagsDaCategoria(cat), [cat]);

  return (
    <div className="min-h-screen bg-page-bg pb-24">
      {/* Hero */}
      <section
        className="px-5 py-8 md:flex md:items-center md:justify-between md:py-12"
        style={{
          background: `linear-gradient(135deg, ${cat.cor}33 0%, transparent 70%)`,
          borderBottom: `1px solid ${cat.cor}33`,
        }}
      >
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            categoria
          </p>
          <h1
            className="mt-1 text-3xl font-black lg:text-4xl"
            style={{ color: cat.cor }}
          >
            {cat.nome}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{cat.descricao}</p>
          <p className="mt-2 text-xs font-semibold text-muted-foreground">
            {produtosFiltrados.length} achados
          </p>
        </div>
        <span className="mt-4 block text-6xl md:mt-0 md:text-8xl">
          {cat.emoji}
        </span>
      </section>

      {/* Category strip */}
      <SectionHeader title="Categorias" />
      <CategoryGrid categorias={todasCategorias} slugAtivo={cat.slug} />

      {/* Products + filter */}
      <div className="flex gap-6 px-4 pt-2">
        <FilterPanel
          filtros={filtros}
          onFiltrosChange={setFiltros}
          tagsDaCategoria={tags}
          precoMaxTotal={precoMaxTotal}
          cor={cat.cor}
        />

        <div className="flex-1 min-w-0">
          <SectionHeader
            title={`${cat.nome} — ${produtosFiltrados.length} achados`}
          />
          {produtosFiltrados.length === 0 ? (
            <p className="px-4 text-sm text-muted-foreground">
              Nenhum produto encontrado com esses filtros.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {produtosFiltrados.map((produto) => (
                <ProductCard
                  key={produto.id}
                  produto={produto}
                  categoria={cat}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Replace page.tsx**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategorias, getCategoria } from "@/lib/produtos";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import CategoriaContent from "./CategoriaContent";

interface PageProps {
  params: Promise<{ categoria: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { categoria: slug } = await params;
  const cat = getCategoria(slug);
  if (!cat) return {};
  return {
    title: `${cat.nome} — Achadinhos`,
    description: cat.descricao,
  };
}

export async function generateStaticParams() {
  return getCategorias().map((c) => ({ categoria: c.slug }));
}

export default async function CategoriaPage({ params }: PageProps) {
  const { categoria: slug } = await params;
  const cat = getCategoria(slug);
  if (!cat) notFound();

  const todasCategorias = getCategorias();

  return (
    <>
      <Header />
      <CategoriaContent cat={cat} todasCategorias={todasCategorias} />
      <BottomNav />
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/[categoria]/page.tsx src/app/[categoria]/CategoriaContent.tsx
git commit -m "feat: category page with dark hero, filter panel, client-side filtering"
```

---

## Task 14: Update home page to dark theme

**Files:**

- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update page.tsx**

```tsx
import {
  getCategorias,
  getProdutosDestaque,
  getProdutosOferta,
} from "@/lib/produtos";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import SectionHeader from "@/components/SectionHeader";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import BottomNav from "@/components/BottomNav";

export default function HomePage() {
  const categorias = await getCategorias();
  const destaques = getProdutosDestaque(8);
  const ofertas = getProdutosOferta().slice(0, 8);

  return (
    <div className="min-h-screen bg-page-bg pb-20">
      <Header />
      <HeroBanner />

      <SectionHeader title="Categorias" />
      <CategoryGrid categorias={categorias} />

      <SectionHeader id="destaques" title="🔥 Em destaque" />
      <ProductGrid produtos={destaques} categorias={categorias} />

      <SectionHeader title="💰 Melhores ofertas" />
      <ProductGrid produtos={ofertas} categorias={categorias} />

      <BottomNav />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: home page with destaques and ofertas sections"
```

---

## Task 15: Create /sobre page

**Files:**

- Create: `src/app/sobre/page.tsx`

- [ ] **Step 1: Create sobre/page.tsx**

```tsx
import type { Metadata } from "next";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Sobre — Achadinhos",
  description: "Saiba mais sobre o Achadinhos e como funciona.",
};

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-page-bg pb-24">
      <Header />

      {/* Hero */}
      <section className="px-5 py-10 text-center">
        <h1 className="text-3xl font-black text-white">Sobre o Achadinhos</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Curadoria honesta de produtos que valem cada centavo
        </p>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-5 pb-10">
        <div className="rounded-2xl bg-card-bg border border-card-border p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-2">
              O que é o Achadinhos?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O Achadinhos é um site de curadoria de produtos afiliados.
              Garimpamos os melhores produtos da Amazon e Shopee — com foco em
              qualidade, custo-benefício e avaliações reais de compradores.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">
              Como funciona?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cada produto listado tem um link de afiliado. Quando você clica e
              compra, recebemos uma pequena comissão — sem custo extra pra você.
              Esse modelo nos permite manter o site gratuito e sem anúncios
              invasivos.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">Nossos perfis</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Cada categoria tem um perfil temático nas redes sociais com dicas
              e achados exclusivos.
            </p>
            <div className="flex flex-wrap gap-2">
              {[{ label: "@bichinz_ — Pets", href: "#" }].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-card-border px-4 py-2 text-xs font-semibold text-brand hover:bg-brand/10"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/sobre/page.tsx
git commit -m "feat: add /sobre page"
```

---

## Task 16: Create .env.local

**Files:**

- Create: `.env.local`

- [ ] **Step 1: Create .env.local**

```
ADMIN_PASSWORD=achadinhos123
```

- [ ] **Step 2: Verify .env.local is in .gitignore**

```bash
grep -q ".env.local" .gitignore && echo "OK" || echo "ADD TO GITIGNORE"
```

If it prints `ADD TO GITIGNORE`, add `.env.local` to `.gitignore`.

---

## Task 17: Create admin auth API routes

**Files:**

- Create: `src/app/api/admin/login/route.ts`
- Create: `src/app/api/admin/logout/route.ts`

- [ ] **Step 1: Create login route**

```ts
// src/app/api/admin/login/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };

  if (!body.password || body.password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_token", "ok", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
    sameSite: "lax",
  });

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Create logout route**

```ts
// src/app/api/admin/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/login/route.ts src/app/api/admin/logout/route.ts
git commit -m "feat: admin auth API routes (login + logout)"
```

---

## Task 18: Create produto CRUD API routes

**Files:**

- Create: `src/app/api/produtos/route.ts`
- Create: `src/app/api/produtos/[id]/route.ts`

All write routes check the `admin_token` cookie before mutating the JSON file.

- [ ] **Step 1: Create a shared auth helper**

Create `src/lib/adminAuth.ts`:

```ts
import { cookies } from "next/headers";

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value === "ok";
}
```

- [ ] **Step 2: Create GET+POST route for /api/produtos**

```ts
// src/app/api/produtos/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type { ProdutosData, Produto } from "@/types";
import { isAdminAuthenticated } from "@/lib/adminAuth";

const DATA_FILE = path.join(process.cwd(), "src", "data", "produtos.json");

function readData(): ProdutosData {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as ProdutosData;
}

function writeData(data: ProdutosData): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  return NextResponse.json(readData());
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = (await request.json()) as {
    categoriaSlug: string;
    produto: Produto;
  };
  const data = readData();

  const cat = data.categorias.find((c) => c.slug === body.categoriaSlug);
  if (!cat) {
    return NextResponse.json(
      { error: "Categoria não encontrada" },
      { status: 404 },
    );
  }

  cat.produtos.push(body.produto);
  writeData(data);

  return NextResponse.json({ ok: true }, { status: 201 });
}
```

- [ ] **Step 3: Create PUT+DELETE route for /api/produtos/[id]**

```ts
// src/app/api/produtos/[id]/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type { ProdutosData, Produto } from "@/types";
import { isAdminAuthenticated } from "@/lib/adminAuth";

const DATA_FILE = path.join(process.cwd(), "src", "data", "produtos.json");

function readData(): ProdutosData {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as ProdutosData;
}

function writeData(data: ProdutosData): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json()) as Produto;
  const data = readData();

  let found = false;
  for (const cat of data.categorias) {
    const idx = cat.produtos.findIndex((p) => p.id === id);
    if (idx !== -1) {
      cat.produtos[idx] = body;
      found = true;
      break;
    }
  }

  if (!found) {
    return NextResponse.json(
      { error: "Produto não encontrado" },
      { status: 404 },
    );
  }

  writeData(data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const data = readData();

  let found = false;
  for (const cat of data.categorias) {
    const idx = cat.produtos.findIndex((p) => p.id === id);
    if (idx !== -1) {
      cat.produtos.splice(idx, 1);
      found = true;
      break;
    }
  }

  if (!found) {
    return NextResponse.json(
      { error: "Produto não encontrado" },
      { status: 404 },
    );
  }

  writeData(data);
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/adminAuth.ts src/app/api/produtos/route.ts src/app/api/produtos/[id]/route.ts
git commit -m "feat: produtos CRUD API routes with cookie auth"
```

---

## Task 19: Create categoria API routes

**Files:**

- Create: `src/app/api/categorias/route.ts`
- Create: `src/app/api/categorias/[slug]/route.ts`

- [ ] **Step 1: Create POST /api/categorias**

```ts
// src/app/api/categorias/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type { ProdutosData, Categoria } from "@/types";
import { isAdminAuthenticated } from "@/lib/adminAuth";

const DATA_FILE = path.join(process.cwd(), "src", "data", "produtos.json");

function readData(): ProdutosData {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as ProdutosData;
}

function writeData(data: ProdutosData): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = (await request.json()) as Omit<Categoria, "produtos">;
  const data = readData();

  if (data.categorias.find((c) => c.slug === body.slug)) {
    return NextResponse.json({ error: "Slug já existe" }, { status: 409 });
  }

  data.categorias.push({ ...body, produtos: [] });
  writeData(data);

  return NextResponse.json({ ok: true }, { status: 201 });
}
```

- [ ] **Step 2: Create PUT /api/categorias/[slug]**

```ts
// src/app/api/categorias/[slug]/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import type { ProdutosData, Categoria } from "@/types";
import { isAdminAuthenticated } from "@/lib/adminAuth";

const DATA_FILE = path.join(process.cwd(), "src", "data", "produtos.json");

function readData(): ProdutosData {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8")) as ProdutosData;
}

function writeData(data: ProdutosData): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function PUT(request: Request, { params }: RouteContext) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { slug } = await params;
  const body = (await request.json()) as Partial<Omit<Categoria, "produtos">>;
  const data = readData();

  const idx = data.categorias.findIndex((c) => c.slug === slug);
  if (idx === -1) {
    return NextResponse.json(
      { error: "Categoria não encontrada" },
      { status: 404 },
    );
  }

  data.categorias[idx] = { ...data.categorias[idx], ...body };
  writeData(data);

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/categorias/route.ts src/app/api/categorias/[slug]/route.ts
git commit -m "feat: categorias CRUD API routes with cookie auth"
```

---

## Task 20: Create admin login page

**Files:**

- Create: `src/app/admin/page.tsx`

This is a Client Component (form with useState for password + fetch to login route).

- [ ] **Step 1: Create admin/page.tsx**

```tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Senha incorreta. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-page-bg px-4">
      <div className="w-full max-w-sm rounded-2xl bg-card-bg border border-card-border p-8">
        <h1 className="mb-1 text-2xl font-black text-white">
          <span className="font-light">acha</span>dinhos
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Painel administrativo
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="password" className="text-white mb-1 block">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-surface border-card-border text-white"
              required
              autoFocus
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="bg-brand text-white hover:bg-brand/90"
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/admin/page.tsx
git commit -m "feat: admin login page"
```

---

## Task 21: Create admin dashboard layout with auth guard

**Files:**

- Create: `src/app/admin/dashboard/layout.tsx`
- Create: `src/app/admin/dashboard/page.tsx`

- [ ] **Step 1: Create dashboard layout.tsx**

This is a Server Component. It reads the cookie and redirects to `/admin` if not authenticated.

```tsx
// src/app/admin/dashboard/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCategorias } from "@/lib/produtos";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_token")?.value !== "ok") {
    redirect("/admin");
  }

  const categorias = await getCategorias();

  return (
    <div className="flex min-h-screen bg-[#F8F8F8]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col bg-white border-r border-gray-200 px-4 py-6">
        <Link href="/" className="mb-6 text-xl font-black text-gray-900">
          <span className="font-light">acha</span>dinhos
        </Link>
        <nav className="flex flex-col gap-1 flex-1">
          <Link
            href="/admin/dashboard"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            📊 Dashboard
          </Link>
          <Link
            href="/admin/dashboard/produtos"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            📦 Produtos
          </Link>
          <Link
            href="/admin/dashboard/categorias"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            📂 Categorias
          </Link>
        </nav>
        <AdminLogoutButton />
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}
```

- [ ] **Step 2: Create AdminLogoutButton.tsx**

```tsx
// src/components/admin/AdminLogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className="w-full"
    >
      Sair
    </Button>
  );
}
```

- [ ] **Step 3: Create dashboard/page.tsx (summary stats)**

```tsx
// src/app/admin/dashboard/page.tsx
import { getCategorias, getProdutosOferta } from "@/lib/produtos";

export default function DashboardPage() {
  const categorias = await getCategorias();
  const totalProdutos = categorias.reduce(
    (acc, c) => acc + c.produtos.length,
    0,
  );
  const emOferta = getProdutosOferta().length;

  const stats = [
    { label: "Categorias", value: categorias.length, emoji: "📂" },
    { label: "Produtos", value: totalProdutos, emoji: "📦" },
    { label: "Em oferta", value: emOferta, emoji: "💰" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-white border border-gray-200 p-5"
          >
            <p className="text-3xl">{s.emoji}</p>
            <p className="mt-2 text-3xl font-black text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/dashboard/layout.tsx src/app/admin/dashboard/page.tsx src/components/admin/AdminLogoutButton.tsx
git commit -m "feat: admin dashboard layout with auth guard and stats page"
```

---

## Task 22: Create admin products page

**Files:**

- Create: `src/app/admin/dashboard/produtos/page.tsx`
- Create: `src/components/admin/ProductsTable.tsx`
- Create: `src/components/admin/ProductForm.tsx`

The products page is a Server Component that passes data to the client `ProductsTable`.

- [ ] **Step 1: Create ProductForm.tsx**

```tsx
// src/components/admin/ProductForm.tsx
"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Produto, Categoria, Loja } from "@/types";

const LOJAS: Loja[] = [
  "amazon",
  "shopee",
  "magalu",
  "mercadolivre",
  "americanas",
  "casasbahia",
  "centauro",
  "aliexpress",
];

interface ProductFormProps {
  categorias: Categoria[];
  produto?: Produto & { categoriaSlug: string };
  onSave: () => void;
  onCancel: () => void;
}

export default function ProductForm({
  categorias,
  produto,
  onSave,
  onCancel,
}: ProductFormProps) {
  const isEdit = !!produto;
  const [nome, setNome] = useState(produto?.nome ?? "");
  const [categoriaSlug, setCategoriaSlug] = useState(
    produto?.categoriaSlug ?? categorias[0]?.slug ?? "",
  );
  const [preco, setPreco] = useState(produto?.preco?.toString() ?? "");
  const [precoOriginal, setPrecoOriginal] = useState(
    produto?.preco_original?.toString() ?? "",
  );
  const [desconto, setDesconto] = useState(
    produto?.desconto_pct?.toString() ?? "",
  );
  const [imagem, setImagem] = useState(produto?.imagem ?? "");
  const [linkAfiliado, setLinkAfiliado] = useState(
    produto?.link_afiliado ?? "",
  );
  const [loja, setLoja] = useState<Loja>(produto?.loja ?? "amazon");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(produto?.tags ?? []);
  const [destaque, setDestaque] = useState(produto?.destaque ?? false);
  const [novo, setNovo] = useState(produto?.novo ?? false);
  const [loading, setLoading] = useState(false);

  // Auto-calculate desconto when both prices filled
  function handlePrecoOriginalChange(v: string) {
    setPrecoOriginal(v);
    const orig = parseFloat(v);
    const atual = parseFloat(preco);
    if (!isNaN(orig) && !isNaN(atual) && orig > 0) {
      setDesconto(String(Math.round((1 - atual / orig) * 100)));
    }
  }

  function addTag(e: React.KeyboardEvent) {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const novoProduto: Produto = {
      id: produto?.id ?? `${categoriaSlug}-${Date.now()}`,
      nome,
      preco: parseFloat(preco),
      preco_original: precoOriginal ? parseFloat(precoOriginal) : undefined,
      desconto_pct: desconto ? parseInt(desconto) : undefined,
      imagem: imagem || null,
      link_afiliado: linkAfiliado,
      loja,
      tags: tags.length > 0 ? tags : undefined,
      destaque,
      novo,
    };

    const url = isEdit ? `/api/produtos/${produto!.id}` : "/api/produtos";
    const method = isEdit ? "PUT" : "POST";
    const body = isEdit ? novoProduto : { categoriaSlug, produto: novoProduto };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      onSave();
    } else {
      alert("Erro ao salvar produto.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Nome</Label>
          <Input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Categoria</Label>
          <select
            value={categoriaSlug}
            onChange={(e) => setCategoriaSlug(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            required
          >
            {categorias.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Loja</Label>
          <select
            value={loja}
            onChange={(e) => setLoja(e.target.value as Loja)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            {LOJAS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Preço atual (R$)</Label>
          <Input
            type="number"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Preço original (R$)</Label>
          <Input
            type="number"
            step="0.01"
            value={precoOriginal}
            onChange={(e) => handlePrecoOriginalChange(e.target.value)}
          />
        </div>

        <div>
          <Label>Desconto %</Label>
          <Input
            type="number"
            value={desconto}
            onChange={(e) => setDesconto(e.target.value)}
          />
        </div>

        <div className="col-span-2">
          <Label>URL da imagem</Label>
          <div className="flex gap-2">
            <Input
              value={imagem}
              onChange={(e) => setImagem(e.target.value)}
              placeholder="https://..."
            />
            {imagem && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagem}
                alt=""
                className="h-10 w-10 rounded object-cover shrink-0"
              />
            )}
          </div>
        </div>

        <div className="col-span-2">
          <Label>Link afiliado</Label>
          <Input
            value={linkAfiliado}
            onChange={(e) => setLinkAfiliado(e.target.value)}
            placeholder="https://amzn.to/..."
            required
          />
        </div>

        <div className="col-span-2">
          <Label>Tags (Enter para adicionar)</Label>
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
            placeholder="cachorro, gato..."
          />
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs hover:bg-red-100"
              >
                {tag} ✕
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="destaque"
            checked={destaque}
            onCheckedChange={setDestaque}
          />
          <Label htmlFor="destaque">Destaque</Label>
        </div>

        <div className="flex items-center gap-2">
          <Switch id="novo" checked={novo} onCheckedChange={setNovo} />
          <Label htmlFor="novo">Novo</Label>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Create ProductsTable.tsx**

```tsx
// src/components/admin/ProductsTable.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductForm from "./ProductForm";
import type { Produto, Categoria } from "@/types";
import { formatarPreco } from "@/lib/produtos";

interface ProdutoComCategoria extends Produto {
  categoriaSlug: string;
  categoriaNome: string;
}

interface ProductsTableProps {
  produtos: ProdutoComCategoria[];
  categorias: Categoria[];
}

export default function ProductsTable({
  produtos,
  categorias,
}: ProductsTableProps) {
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [editando, setEditando] = useState<ProdutoComCategoria | null>(null);
  const [adicionando, setAdicionando] = useState(false);
  const router = useRouter();

  const filtered = produtos.filter((p) => {
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
    const matchCat = !filtroCategoria || p.categoriaSlug === filtroCategoria;
    return matchBusca && matchCat;
  });

  async function handleDelete(id: string) {
    if (!confirm("Remover produto?")) return;
    await fetch(`/api/produtos/${id}`, { method: "DELETE" });
    router.refresh();
  }

  function handleSaved() {
    setEditando(null);
    setAdicionando(false);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          placeholder="Buscar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">Todas as categorias</option>
          {categorias.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.nome}
            </option>
          ))}
        </select>
        <Button onClick={() => setAdicionando(true)}>
          + Adicionar produto
        </Button>
      </div>

      <div className="rounded-xl border bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Img</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Desc.</TableHead>
              <TableHead>Loja</TableHead>
              <TableHead>Dest.</TableHead>
              <TableHead>Novo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  {p.imagem ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imagem}
                      alt=""
                      className="h-8 w-8 rounded object-cover"
                    />
                  ) : (
                    <span className="text-lg">
                      {categorias.find((c) => c.slug === p.categoriaSlug)
                        ?.emoji ?? "?"}
                    </span>
                  )}
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-sm font-medium">
                  {p.nome}
                </TableCell>
                <TableCell className="text-sm">{p.categoriaNome}</TableCell>
                <TableCell className="text-sm">
                  {formatarPreco(p.preco)}
                </TableCell>
                <TableCell className="text-sm">
                  {p.desconto_pct ? `${p.desconto_pct}%` : "—"}
                </TableCell>
                <TableCell className="text-sm">{p.loja}</TableCell>
                <TableCell>{p.destaque ? "✓" : "—"}</TableCell>
                <TableCell>{p.novo ? "✓" : "—"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditando(p)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(p.id)}
                    >
                      Remover
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editando} onOpenChange={() => setEditando(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar produto</DialogTitle>
          </DialogHeader>
          {editando && (
            <ProductForm
              categorias={categorias}
              produto={editando}
              onSave={handleSaved}
              onCancel={() => setEditando(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add dialog */}
      <Dialog open={adicionando} onOpenChange={setAdicionando}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar produto</DialogTitle>
          </DialogHeader>
          <ProductForm
            categorias={categorias}
            onSave={handleSaved}
            onCancel={() => setAdicionando(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

- [ ] **Step 3: Create products page.tsx**

```tsx
// src/app/admin/dashboard/produtos/page.tsx
import { getCategorias } from "@/lib/produtos";
import ProductsTable from "@/components/admin/ProductsTable";

export default function ProdutosPage() {
  const categorias = await getCategorias();

  const produtos = categorias.flatMap((cat) =>
    cat.produtos.map((p) => ({
      ...p,
      categoriaSlug: cat.slug,
      categoriaNome: cat.nome,
    })),
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Produtos ({produtos.length})
      </h1>
      <ProductsTable produtos={produtos} categorias={categorias} />
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/dashboard/produtos/page.tsx src/components/admin/ProductForm.tsx src/components/admin/ProductsTable.tsx
git commit -m "feat: admin products page with CRUD table and form dialog"
```

---

## Task 23: Create admin categories page

**Files:**

- Create: `src/app/admin/dashboard/categorias/page.tsx`
- Create: `src/components/admin/CategoriesPanel.tsx`
- Create: `src/components/admin/CategoryForm.tsx`

- [ ] **Step 1: Create CategoryForm.tsx**

```tsx
// src/components/admin/CategoryForm.tsx
"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Categoria } from "@/types";

interface CategoryFormProps {
  categoria?: Categoria;
  onSave: () => void;
  onCancel: () => void;
}

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function CategoryForm({
  categoria,
  onSave,
  onCancel,
}: CategoryFormProps) {
  const isEdit = !!categoria;
  const [nome, setNome] = useState(categoria?.nome ?? "");
  const [slug, setSlug] = useState(categoria?.slug ?? "");
  const [emoji, setEmoji] = useState(categoria?.emoji ?? "");
  const [cor, setCor] = useState(categoria?.cor ?? "#F97316");
  const [descricao, setDescricao] = useState(categoria?.descricao ?? "");
  const [loading, setLoading] = useState(false);

  function handleNomeChange(v: string) {
    setNome(v);
    if (!isEdit) setSlug(toSlug(v));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const body = { nome, slug, emoji, cor, descricao };
    const url = isEdit
      ? `/api/categorias/${categoria!.slug}`
      : "/api/categorias";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      onSave();
    } else {
      const err = (await res.json()) as { error?: string };
      alert(err.error ?? "Erro ao salvar.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <Label>Nome</Label>
        <Input
          value={nome}
          onChange={(e) => handleNomeChange(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>Slug</Label>
        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          readOnly={isEdit}
          className={isEdit ? "bg-gray-50" : ""}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Emoji</Label>
          <Input
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            placeholder="🐾"
            required
          />
        </div>
        <div>
          <Label>Cor accent</Label>
          <div className="flex gap-2">
            <input
              type="color"
              value={cor}
              onChange={(e) => setCor(e.target.value)}
              className="h-10 w-12 cursor-pointer rounded border"
            />
            <Input
              value={cor}
              onChange={(e) => setCor(e.target.value)}
              placeholder="#F97316"
            />
          </div>
        </div>
      </div>
      <div>
        <Label>Descrição</Label>
        <Input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Create CategoriesPanel.tsx**

```tsx
// src/components/admin/CategoriesPanel.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CategoryForm from "./CategoryForm";
import type { Categoria } from "@/types";

interface CategoriesPanelProps {
  categorias: Categoria[];
}

export default function CategoriesPanel({ categorias }: CategoriesPanelProps) {
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [adicionando, setAdicionando] = useState(false);
  const router = useRouter();

  function handleSaved() {
    setEditando(null);
    setAdicionando(false);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4">
        <Button onClick={() => setAdicionando(true)}>+ Nova categoria</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categorias.map((cat) => (
          <div
            key={cat.slug}
            className="rounded-2xl bg-white border border-gray-200 p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                style={{
                  backgroundColor: `${cat.cor}22`,
                  border: `1px solid ${cat.cor}55`,
                }}
              >
                {cat.emoji}
              </div>
              <div>
                <p className="font-bold text-gray-900">{cat.nome}</p>
                <p className="text-xs text-gray-500">/{cat.slug}</p>
              </div>
              <div
                className="ml-auto h-4 w-4 rounded-full"
                style={{ backgroundColor: cat.cor }}
                title={cat.cor}
              />
            </div>
            <p className="text-xs text-gray-500 mb-3">
              {cat.produtos.length} produtos
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditando(cat)}
              >
                Editar
              </Button>
              <Link href={`/${cat.slug}`} target="_blank">
                <Button size="sm" variant="ghost">
                  Ver site →
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!editando} onOpenChange={() => setEditando(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar categoria</DialogTitle>
          </DialogHeader>
          {editando && (
            <CategoryForm
              categoria={editando}
              onSave={handleSaved}
              onCancel={() => setEditando(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={adicionando} onOpenChange={setAdicionando}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova categoria</DialogTitle>
          </DialogHeader>
          <CategoryForm
            onSave={handleSaved}
            onCancel={() => setAdicionando(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

- [ ] **Step 3: Create categorias page.tsx**

```tsx
// src/app/admin/dashboard/categorias/page.tsx
import { getCategorias } from "@/lib/produtos";
import CategoriesPanel from "@/components/admin/CategoriesPanel";

export default function CategoriasPage() {
  const categorias = await getCategorias();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Categorias ({categorias.length})
      </h1>
      <CategoriesPanel categorias={categorias} />
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/admin/dashboard/categorias/page.tsx src/components/admin/CategoriesPanel.tsx src/components/admin/CategoryForm.tsx
git commit -m "feat: admin categories page with CRUD"
```

---

## Task 24: Build verification and fixes

**Files:** any files that fail to build

- [ ] **Step 1: Run build**

```bash
npm run build
```

Expected: success with no type errors.

Common issues to fix:

- **Image domains:** If Next.js complains about `images.unsplash.com` not being in allowed domains, add to `next.config.ts`:
  ```ts
  const nextConfig = {
    images: {
      remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    },
  };
  export default nextConfig;
  ```
- **`any` types:** TypeScript may complain about untyped JSON assertions — check `as` casts are correct.
- **Unused imports:** Remove any unused imports flagged by the linter.

- [ ] **Step 2: Run tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: build errors and type issues"
```

- [ ] **Step 4: Start dev server and verify manually**

```bash
npm run dev
```

Check manually:

- [ ] `/` — home page loads dark, hero visible, destaques and ofertas grids show
- [ ] `/pets` — dark hero orange, filter panel button visible on mobile, products load
- [ ] `/pets` — apply a filter (e.g. Shopee only) — products filter correctly
- [ ] `/sobre` — page loads
- [ ] `/admin` — login form shows, wrong password shows error, correct password (`achadinhos123`) redirects to dashboard
- [ ] `/admin/dashboard` — stats show
- [ ] `/admin/dashboard/produtos` — table shows all products, search works
- [ ] `/admin/dashboard/categorias` — category cards show

---

## Spec Coverage Check

| Spec section                                                      | Covered by task(s)      |
| ----------------------------------------------------------------- | ----------------------- |
| Dark & Bold design system                                         | Tasks 1, 2              |
| Inter font                                                        | Task 2                  |
| Category accent colors                                            | Tasks 4, 8, 10, 12, 13  |
| Responsive grid (2/3/4/5 cols)                                    | Tasks 9, 13             |
| Responsive Header (2 rows mobile, 1 row desktop)                  | Task 7                  |
| produtos.json with 6 products × 4 cats                            | Task 4                  |
| Numeric `preco`, `preco_original`, `desconto_pct`, `tags`, `novo` | Tasks 3, 4, 5           |
| `getProdutos` with `FiltrosProduto`                               | Task 5                  |
| `getProdutosOferta`                                               | Task 5                  |
| shadcn Sheet / Slider / Badge / etc.                              | Task 6                  |
| FilterPanel mobile (floating button + Sheet from bottom)          | Task 12                 |
| FilterPanel desktop (sidebar 220px fixed)                         | Task 12                 |
| FilterChip with active state                                      | Task 10                 |
| PriceRangeSlider                                                  | Task 11                 |
| Category page hero with per-category color                        | Task 13                 |
| Badge desconto / novo / destaque on ProductCard                   | Task 8                  |
| `/sobre` page                                                     | Task 15                 |
| `.env.local` with `ADMIN_PASSWORD`                                | Task 16                 |
| Admin login with httpOnly cookie                                  | Tasks 17, 20            |
| Admin dashboard layout + auth guard                               | Task 21                 |
| `/api/produtos` GET/POST                                          | Task 18                 |
| `/api/produtos/[id]` PUT/DELETE                                   | Task 18                 |
| `/api/categorias` POST                                            | Task 19                 |
| `/api/categorias/[slug]` PUT                                      | Task 19                 |
| Admin products table with search + category filter                | Task 22                 |
| Admin product add/edit form with all fields                       | Task 22                 |
| Admin categories cards with edit form                             | Task 23                 |
| `npm run build` clean                                             | Task 24                 |
| No hardcoded products in JSX                                      | All tasks use JSON data |
| `Loja` expanded to 8 stores                                       | Task 3                  |
