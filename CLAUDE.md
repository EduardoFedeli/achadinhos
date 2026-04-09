# CLAUDE.md - T-Hex Indica (Radar Edition)

## Stack Atualizada
- **Next.js 15+** (App Router / Turbopack)
- **React 19**
- **Tailwind CSS v4** (Config no globals.css)
- **Banco de Dados:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth com Middleware de Admin
- **Scraper:** Cheerio para extração de preços (Amazon/Mercado Livre)

## Funcionalidades Críticas: O Radar
O "Radar" é o motor de verificação de preços. Ele lê os produtos do Supabase, acessa os links (via `/api/scraper`), compara o preço atual com o salvo e gera alertas se houver mudança.

## Regras de Ouro
- **Links do Mercado Livre:** São encurtadores `meli.la`. O scraper deve tentar resolver o redirecionamento ou reconstruir a URL direta via ID `MLB` para evitar bloqueios de vitrine.
- **Persistência:** Toda alteração de produto deve refletir na tabela `produtos` do Supabase. A coluna correta para a loja é `lojaOrigem`.
- **Estilização:** Manter o padrão Dark/Cyberpunk usando as cores definidas no `@theme` do `globals.css`.

## Comandos
- `npm run dev` - Rodar projeto
- `npm run build` - Validar build (Obrigatório antes de finalizar tarefas)