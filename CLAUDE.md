# CLAUDE.md - T-Hex Indica (Enterprise Edition)

## Stack Atualizada
- **Next.js 15+** (App Router / Turbopack)
- **React 19**
- **Tailwind CSS v4** (Config no globals.css via CSS variables)
- **Banco de Dados:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth com Middleware de Admin
- **Scraper:** Cheerio (Arquitetura Híbrida com Disfarce Social)

## Regras Estruturais e de Banco de Dados (NÃO VIOLAR)
1. **Nomenclatura do Supabase:** A tabela `produtos` usa estritamente **camelCase**. Use `lojaOrigem`, `precoOriginal`, `linkAfiliado`, `createdAt`.
2. A ÚNICA exceção à regra é a coluna `desconto_pct` (snake_case).
3. Nunca adicione colunas como `updatedAt` ou `updated_at` em comandos `.update()` sem confirmar se elas existem.

## Funcionalidades Críticas: Radar Automático e Fila Manual
- A operação de varredura de preços foi dividida:
  - **Automático:** Pega apenas marketplaces com `scraper_ativo = true`.
  - **Manual (Fila de Revisão):** Pega marketplaces com `scraper_ativo = false` (Shopee, Netshoes, ML) onde o scraper atua apenas resgatando metadados via User-Agent do Facebook.
- **Cache do Next.js:** Qualquer alteração de produto via API (`POST`/`PUT`) deve obrigatoriamente chamar `revalidatePath('/', 'layout')` para que os preços reflitam na Home imediatamente.

## Identidade Visual (UI/UX)
- Design System: **Dark & Bold**. Fundo (`#0F0F13`), Superfícies (`#1A1A24`), Cards (`#1E1E2E`).
- Componentes baseados em `shadcn/ui`.
- Badges de desconto e preço sempre em verde (`#22C55E`).

## Comandos
- `npm run dev` - Rodar projeto localmente.
- `npm run build` - Validar build rigorosamente antes de dar tarefas por concluídas.