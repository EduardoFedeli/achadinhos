<div align="center">

# 🦖 T-Hex Indica

**The internet's most relentless deal curation platform.**

*Full-stack affiliate platform with intelligent scraping, a complete admin panel, and real-time price tracking.*

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## Overview

**T-Hex Indica** is a deal curation and affiliate link platform built from scratch as a professional-grade portfolio project. The site aggregates products from multiple marketplaces (Amazon, Shopee, Mercado Livre, Magalu, etc.), displays them with real-time discount information, and routes users to the purchase point via affiliate links — generating commission revenue at zero extra cost to the end consumer.

The project goes far beyond a simple product listing site. It features a **hybrid scraping engine** capable of automatically extracting product data, a **full-featured admin panel** for catalog management, and a **robust data architecture** on Supabase with product auditing and expiry logic.

---

## Visual Overview

```
┌─────────────────────────────────────────────────────────┐
│                   HOME — T-Hex Indica                   │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ [grid bg] │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │           🦖 HERO BANNER (Carousel)             │   │
│  │        Featured deals — autoplay                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  🏆 BEST SELLERS ───────────────────────── [SEE ALL]   │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐            │
│  │ 🛒 │ │ 🛒 │ │ 🛒 │ │ 🛒 │ │ 🛒 │ │ 🛒 │  ← drag   │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘            │
│                                                         │
│  ⚡ NEW ARRIVALS ───────────────────────── [SEE ALL]   │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ...                       │
└─────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Technical Decision |
|-------|-----------|-------------------|
| **Framework** | Next.js 15 (App Router) | Native SSR/SSG, integrated API Routes, Turbopack for DX |
| **UI Library** | React 19 | Concurrent features, Server Components, Actions |
| **Styling** | Tailwind CSS v4 | Config via CSS variables in `globals.css`, zero `tailwind.config.js` |
| **Components** | shadcn/ui + Radix UI | Native accessibility, unopinionated styling |
| **Database** | Supabase (PostgreSQL) | BaaS with RLS, realtime, and integrated storage |
| **Auth** | Next.js Middleware + cookie | Session-based, no JWT exposed to the client |
| **Scraping** | Cheerio | Server-side HTML parser, hybrid architecture with social media disguise |
| **Language** | TypeScript 5 | Strict typing throughout the entire codebase |
| **Deploy** | Vercel | Edge Network, preview deploys, automatic caching |

---

## Project Architecture

```
t-hex-indica/
│
├── src/
│   ├── app/                         # App Router (Next.js 15)
│   │   ├── layout.tsx               # Root layout — font, dark mode, global background
│   │   ├── page.tsx                 # Home — Hero, Best Sellers, New Arrivals
│   │   ├── globals.css              # Design System via CSS Variables (Tailwind v4)
│   │   │
│   │   ├── [slug]/                  # Dynamic category route
│   │   │   ├── page.tsx             # Server Component — fetches and renders category
│   │   │   └── CategoriaContent.tsx # Client Component — filters, sorting, search
│   │   │
│   │   ├── explorar/page.tsx        # "All Finds" page — full catalog
│   │   ├── mais-vendidos/page.tsx   # Best sellers page with "Best Seller" badge
│   │   ├── novidades/page.tsx       # New products page with "New" badge
│   │   ├── sobre/page.tsx           # About — mission, transparency, roadmap
│   │   ├── categorias/page.tsx      # Category navigation grid
│   │   │
│   │   ├── admin/
│   │   │   ├── login/page.tsx       # Admin authentication screen
│   │   │   └── dashboard/
│   │   │       ├── layout.tsx       # Panel layout — sidebar + topbar
│   │   │       ├── page.tsx         # Dashboard — KPIs, click chart, top categories
│   │   │       ├── produtos/        # Full product CRUD
│   │   │       ├── categorias/      # Category management
│   │   │       ├── marketplaces/    # Store configuration and scraper flags
│   │   │       ├── radar/           # Automatic price scanning engine
│   │   │       ├── revisao/         # Manual review queue for blocked stores
│   │   │       ├── laboratorio/     # Sandbox to test URLs before registering
│   │   │       └── auditoria/       # Expired products (90+ days)
│   │   │
│   │   └── api/                     # API Routes (serverless functions)
│   │       ├── scraper/route.ts     # Data extraction engine
│   │       ├── radar/route.ts       # Bulk price update
│   │       ├── revisao/route.ts     # Manual price update (blocked stores)
│   │       ├── auditoria/route.ts   # Renew or delete expired products
│   │       ├── produtos/            # Product CRUD (GET, POST, PUT, DELETE)
│   │       ├── categorias/          # Category CRUD
│   │       ├── marketplaces/        # Marketplace CRUD and bulk actions
│   │       ├── track-click/         # Affiliate click tracking
│   │       └── admin/               # Panel login and logout
│   │
│   ├── components/
│   │   ├── Header.tsx               # Main navigation with category menu
│   │   ├── Footer.tsx               # Footer with links and legal information
│   │   ├── HeroBanner.tsx           # Home banner carousel
│   │   ├── ProductCardRanked.tsx    # Product card with ranking badge
│   │   ├── ProductGrid.tsx          # Responsive product grid
│   │   ├── FilterPanel.tsx          # Filter panel (price, store, tags)
│   │   ├── PriceRangeSlider.tsx     # Price range slider
│   │   ├── CategoryGrid.tsx         # Category navigation grid
│   │   ├── SectionHeader.tsx        # Reusable section header
│   │   └── admin/
│   │       ├── AdminSidebar.tsx     # Panel navigation sidebar
│   │       ├── AnalyticsChart.tsx   # Click evolution chart (7 days)
│   │       ├── SupabaseProgressBar.tsx # Real-time storage usage indicator
│   │       ├── CategoriesPanel.tsx  # Category management panel
│   │       └── CategoryFormModal.tsx # Category create/edit modal
│   │
│   ├── lib/
│   │   ├── supabase.ts              # Configured Supabase client
│   │   ├── produtos.ts              # Data access functions (getCategorias etc.)
│   │   ├── marketplaces.ts          # Marketplace constants and types
│   │   ├── adminAuth.ts             # Admin authentication middleware
│   │   └── utils.ts                 # Utilities (cn, formatters)
│   │
│   └── types/index.ts               # Global types: Product, Category, Filters
│
├── next.config.ts                   # Next.js config (remote images)
├── CLAUDE.md                        # Development rules (used with Claude Code)
└── package.json
```

---

## Features in Detail

### Public Frontend

#### Home Page
The main page is a **Client Component** that asynchronously loads data from Supabase, displaying:

- **Hero Banner** — Featured carousel with animated dot navigation. Controlled by shadcn/ui's `CarouselApi` with synchronized state between the selector and the carousel.
- **Best Sellers Section** — Horizontal carousel with `dragFree: true` showing products with `destaque: true`, orange badge, navigation arrows hidden on mobile. Random shuffle on each load to vary product exposure.
- **New Arrivals Section** — Same as above for products with `novo: true`, cyan badge and aqua/cyan visual identity.
- **Global Background** — Subtle line grid (`#8080800a`) with diffuse green glow (`blur-[120px]`) fixed in the layout and visible across all pages of the site.

#### Category Page (`/[slug]`)
Dynamic route with two components separated by responsibility:

- **`page.tsx`** (Server Component): Performs the initial product fetch and extracts lists of stores and tags present. Passes data as props without exposing credentials to the client.
- **`CategoriaContent.tsx`** (Client Component): Manages filter state on the client side — price range via slider, store filter, and tag filter. Renders `ProductGrid` with filtered products in real time.

#### Explore Page (`/explorar`)
A special version of the category page that loads **all products** in the catalog, without a slug filter. Works as the site's general search panel, with the same filters available.

#### Best Sellers & New Arrivals (`/mais-vendidos`, `/novidades`)
Dedicated pages displaying featured and new products in a full grid — landing pages for the "See All" buttons on the home page.

#### About Page (`/sobre`)
Institutional page covering:
- What T-Hex Indica is
- Affiliate monetization model (full transparency)
- Explanation of filters and the Explore page
- The 90-Day Rule (catalog audit policy)
- Partnerships
- Future feature roadmap (WhatsApp groups, new categories)

---

### Admin Panel (`/admin/dashboard`)

Password-protected area, accessible only with the master password. All navigation is done via a lateral sidebar with module identification.

#### Main Dashboard
High-level business view in real time:
- **4 KPI Cards** — Total Products, Categories, Products on Sale, and Total Clicks
- **Click Evolution Chart** — Daily grouping of the last 7 days, rendered with `AnalyticsChart`
- **Top 5 Categories** — Ranking with a progress bar proportional to clicks recorded in the `clicks_produtos` table
- **Recent Registrations Feed** — Grid of the 5 most recently added products with name and price

#### Automatic Radar (`/admin/dashboard/radar`)
The automatic price scanning engine. The operational heart of the site:

1. Loads only marketplaces with `scraper_ativo = true` (e.g., Amazon, Magalu)
2. The admin selects the target store (or "all")
3. The system fetches all eligible products from the database
4. For each product, fires a `POST /api/scraper` with the affiliate link
5. **Random 2–5 second delay between requests** to avoid rate limiting and IP blocks
6. Displays real-time status for each product: `waiting → scanning → success | unchanged | error`
7. Products with a price drop of 5%+ receive an opportunity badge with the discount percentage
8. At the end, the "Save N prices" button consolidates all changes at once via `POST /api/radar`

#### Manual Review Queue (`/admin/dashboard/revisao`)
For marketplaces that block automatic scraping (Shopee, Mercado Livre, Netshoes):

- Filters products by the selected marketplace (only stores with `scraper_ativo = false`)
- **Curve A Mode** — Filters only products marked as `destaque: true` for prioritization
- The admin opens the affiliate link, checks the current price on the store, and enters values manually
- The system automatically calculates `desconto_pct` on save
- Saved products are immediately removed from the queue (optimistic local state removal)

#### Link Lab (`/admin/dashboard/laboratorio`)
Diagnostic sandbox to test a URL's health before registering a new marketplace:

- **Approved Status** (green) — Scraper successfully extracted name, image, and price. Safe to use Automatic Radar.
- **Partial Status** (orange) — Scraper got metadata but the price was blocked. Use Manual Queue.
- **Critical Status** (red) — Total block. Link is likely broken or expired.
- Returns the raw JSON result for technical debugging.

#### Validity Audit (`/admin/dashboard/auditoria`)
Catalog hygiene system:

- Scans all products and identifies those with `createdAt` more than **90 days** ago
- Displays them as red cards with a day-count badge
- Available actions per product:
  - **Test Link** — Opens the affiliate link to verify availability
  - **Renew** — Backdates the creation date by 1, 2, or 3 months (extending the product's lifespan)
  - **Delete** — Permanently removes from the database

#### Marketplace Management (`/admin/dashboard/marketplaces`)
Full CRUD for partner stores:

- Registration with Name, Slug, Link Patterns (domains), and the **Allow Scraper** flag
- Individual status toggle (Active / Paused) directly in the table
- **Bulk selection** with batch actions: Activate, Pause, or Delete multiple marketplaces
- Auto-generated slug from the typed name (normalization and accent removal)

#### Product Management (`/admin/dashboard/produtos`)
Full product catalog CRUD with:
- Registration form with image preview
- Linking to multiple categories (`categoriaSlugs[]`)
- Featured and new flags
- Sync via `revalidatePath('/', 'layout')` after each operation to invalidate the Next.js cache

#### Category Management (`/admin/dashboard/categorias`)
- Create and edit categories with emoji, theme color, and cover image
- Auto-generated slug
- Automatic linking with products via the `categoriaSlugs` array

---

### Hybrid Scraping Engine

The scraping architecture is one of the most sophisticated aspects of the project. Instead of a generic scraper, the system uses a two-layer strategy:

#### Layer 1 — Social Media Disguise (User-Agent Spoofing)
The first extraction attempt uses a **Facebook/Meta User-Agent**:

```
facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
```

The reasoning: e-commerce sites rarely block Facebook's crawler because they need their URLs to be "unfurled" (show a preview) when shared on social networks. This allows the bot to access **Open Graph tags** (`og:title`, `og:image`, `og:price:amount`) that many e-commerce platforms expose freely.

#### Layer 2 — HTML Parsing with Cheerio
For sites that don't expose OG tags or require raw HTML scraping, the system uses **Cheerio** to parse the HTML and search for known price selectors.

#### Marketplace Classification
After analyzing the result, the admin classifies the marketplace:

| Result | Database Flag | Behavior |
|--------|--------------|----------|
| Price extracted ✅ | `scraper_ativo = true` | Goes into **Automatic Radar** |
| Metadata only ⚠️ | `scraper_ativo = false` | Goes into **Manual Review Queue** |
| Total block ❌ | Do not register | — |

---

### Admin Authentication System

The panel authentication does not use Supabase Auth. The decision was deliberate:

- The master password is stored in an environment variable (`ADMIN_PASSWORD`)
- Login creates an **HTTP-only cookie** `admin_token` on the server
- A **Next.js Middleware** intercepts all requests to `/admin/dashboard/*` and verifies the cookie
- The `withAdmin()` wrapper in `src/lib/adminAuth.ts` protects each API Route individually
- Logout deletes the cookie via Server Action

---

### Click Tracking

Each affiliate link has a tracking endpoint that:
1. Records the click in the `clicks_produtos` table with the `categoria_slug`
2. Redirects the user to the original affiliate link

This data feeds the **click evolution chart** and the **Top Categories ranking** on the dashboard.

---

## Design System

The design follows a consistent **Dark & Bold** identity across the entire site:

### Color Palette

```css
/* Backgrounds */
--color-page-bg:     #0F0F13  /* Main background — near black */
--color-surface:     #1A1A24  /* Elevated surfaces — cards, panels */
--color-card-bg:     #1E1E2E  /* Product cards */
--color-card-border: #2A2A35  /* Subtle borders */

/* Brand */
--color-brand-green: #22C55E  /* Jade green — primary color, CTAs, badges */
--color-brand-aqua:  #22D3EE  /* Cyan — New Arrivals section */
--color-brand-brown: #936A47  /* Brown — special accents */
--color-brand-gold:  #FFD700  /* Gold — premium elements */

/* Section Colors */
#F97316  /* Orange — Best Sellers */
#7C3AED  /* Purple — Categories */
#3B82F6  /* Blue — Analytics, audit links */
#EAB308  /* Yellow — Trophy/Top rankings */
```

### Global Visual Effects

The site-wide background is composed of two `fixed` elements in the root layout:

```html
<!-- Subtle line grid -->
<div class="fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),
            linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

<!-- Diffuse green glow -->
<div class="fixed top-0 m-auto h-[400px] w-[600px] rounded-full
            bg-[#22C55E] opacity-[0.03] blur-[120px]" />
```

### Typography
- **Primary font:** Inter (Google Fonts) via `next/font`
- **Weights used:** `font-bold` (700) and `font-black` (900) — weight is a core part of the visual identity
- **Letter-spacing:** `tracking-tight` and `tracking-tighter` for headings, `tracking-widest` for labels/badges

---

## Database (Supabase)

### `produtos` table
```sql
id             uuid     PRIMARY KEY
nome           text
preco          numeric
precoOriginal  numeric  -- camelCase per project convention
desconto_pct   integer  -- ONLY exception: snake_case
imagem         text
linkAfiliado   text
lojaOrigem     text     -- marketplace slug
tags           text[]   -- tag array
categoriaSlugs text[]   -- category slug array
destaque       boolean  -- appears in "Best Sellers"
novo           boolean  -- appears in "New Arrivals"
createdAt      timestamp
```

### `categorias` table
```sql
id          uuid
nome        text
slug        text  UNIQUE
emoji       text
cor         text  -- hex color
descricao   text
imagem_url  text
```

### `marketplaces` table
```sql
id            uuid
nome          text
slug          text  UNIQUE
dominios      text  -- comma-separated URL patterns
cor           text
ativo         boolean
scraper_ativo boolean  -- controls Radar vs Manual Queue
```

### `clicks_produtos` table
```sql
id            uuid
produto_id    uuid
categoria_slug text
created_at    timestamp
```

---

## API Routes

| Endpoint | Method | Function |
|----------|--------|----------|
| `/api/scraper` | POST | Extracts product data from a URL |
| `/api/radar` | POST | Bulk price update after scanning |
| `/api/revisao` | POST | Saves manually updated price |
| `/api/auditoria` | POST | Renews or deletes an expired product |
| `/api/produtos` | GET, POST | Lists and registers products |
| `/api/produtos/[id]` | GET, PUT, DELETE | Operations on a specific product |
| `/api/produtos/bulk` | POST | Bulk product import |
| `/api/produtos/sync` | POST | Data synchronization |
| `/api/categorias` | GET, POST | Lists and creates categories |
| `/api/categorias/[slug]` | PUT, DELETE | Edits and removes a category |
| `/api/marketplaces` | POST | Full CRUD via `action` in the body |
| `/api/track-click` | POST | Records an affiliate click |
| `/api/admin/login` | POST | Authenticates and creates session cookie |
| `/api/admin/logout` | POST | Removes cookie and ends session |

All admin routes are protected by the `withAdmin()` wrapper.

---

## Setup & Configuration

### Prerequisites
- Node.js 18+
- A Supabase account (free tier is sufficient)
- A Vercel account (for deployment)

### Environment Variables

```env
# Supabase — required
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Admin Authentication — required
ADMIN_PASSWORD=your_secret_password_here
ADMIN_TOKEN_SECRET=a_long_random_secret
```

### Local Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/t-hex-indica.git
cd t-hex-indica

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 4. Start the development server
npm run dev
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin/login` for the admin panel.

### Production Build

```bash
npm run build
npm run start
```

---

## Technical Decisions & Learnings

### Why App Router and not Pages Router?
Next.js 15's App Router allows the coexistence of **Server Components** (for data fetching without exposing credentials to the client) and **Client Components** (for interactivity). The category page uses this separation: `page.tsx` performs a secure server-side fetch and passes data to `CategoriaContent.tsx`, which manages filter state on the client.

### Why Tailwind v4 and not v3?
Tailwind v4 eliminates the `tailwind.config.js` file and moves all configuration to CSS via `@theme inline`. This results in a more maintainable design system — the CSS variables and base styles live in the same file, creating a single source of truth.

### Why not use Supabase Auth for the admin?
Supabase Auth is great for large-scale user authentication, but for an admin panel with a single administrator, the overhead isn't justified. The solution with an HTTP-only cookie and middleware is simpler, equally secure, and has no dependency on external providers.

### Why does the scraper use a Facebook User-Agent?
It's a well-established anti-block technique in the affiliate market. E-commerce sites need Facebook's crawler to access their pages to generate previews when links are shared on social networks. This creates an "access vector" that is rarely blocked, even on sites that block other crawlers. The strategy turns an e-commerce business need (social media shareability) into an operational advantage for the scraper.

### Why the random delay in the Radar?
Sequential requests with uniform timing are easily detected as bots by rate limiting systems. A random 2–5 second delay mimics human behavior and drastically reduces the chance of an IP block.

### Next.js Cache and `revalidatePath`
Every data mutation via API Routes (POST, PUT, DELETE) calls `revalidatePath('/', 'layout')` to invalidate the Next.js ISR cache. Without this, pages would continue serving the cached version even after price updates — which would be critical for a site whose core value proposition is maintaining up-to-date prices.

### The 90-Day Rule
The validity audit ensures catalog quality: broken links, out-of-stock products, or outdated prices degrade the user experience and the site's credibility. By enforcing a quarterly review of each product, the system keeps the catalog healthy in a systematic way, without relying on constant manual review.

---

## Public Route Structure

| Route | Type | Description |
|-------|------|-------------|
| `/` | Client | Home with Hero, Best Sellers, and New Arrivals |
| `/explorar` | Server | Full catalog with filters |
| `/mais-vendidos` | Server | Featured product grid |
| `/novidades` | Server | New product grid |
| `/categorias` | Server | Category navigation grid |
| `/sobre` | Server | About page and roadmap |
| `/[slug]` | Server + Client | Dynamic category page |

---

## Roadmap

- [ ] WhatsApp groups for flash deals
- [ ] Sports Jersey category (sportswear)
- [ ] Expansion to Home & Decor and gamer setups
- [ ] Price drop email alerts
- [ ] Public product query API
- [ ] PWA for app installation

---

## About the Project

**T-Hex Indica** was developed by **Eduardo Fedeli** as a portfolio project representing a synthesis of full-stack web development knowledge — from database architecture to the UX engineering of a real consumer product.

The project is a practical exercise in:
- Architectural decision-making with real trade-offs
- Product development focused on user experience
- Data engineering and automation (scraping, click analytics)
- Building a cohesive design system from scratch

---

<div align="center">

Built with focus, coffee, and the conviction that **great deals deserve a site that's just as good.**

*© 2025 E.J Studio — Eduardo Fedeli*

</div>
