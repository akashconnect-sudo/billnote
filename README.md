# BILLNOTE

Production-grade multi-tenant billing for Indian businesses. Design docs live in [`docs/design`](docs/design).

## Phase status

**Phase 1** scaffold and design: done.  
**Phase 2** auth, control-plane DB, Redis, tenant provisioning, app shell, permissions onboarding, PWA SW/install banner: done.  
**Phase 3** products, barcode lookup, items UI + tooltips: done.  
**Phase 4** POS cart, GST helpers, charge/payments, printable receipt: done.  
**Phase 5** (in progress) live dashboard totals, full sidebar menu, bills list.  
**UI Redesign R1** Paper & Ink design system in `@billnote/ui` (Poppins, tokens, components, Storybook): done.

Not yet: R2 app shell, parties/purchases deep APIs (Phase 6), offline/desktop printers (Phase 7).

## Stack

| Piece | Version pin |
| --- | --- |
| Node | 24 LTS |
| pnpm | 9.15 |
| Next.js | 16 |
| NestJS | 12 |
| Expo | 58 |
| PostgreSQL | 18 |
| Redis | 7 |

## Quick start

```bash
pnpm install
cp .env.example .env
# Postgres 18 + Redis must be running (docker compose up -d, or local Windows services)
pnpm --filter @billnote/shared build
pnpm --filter @billnote/ui build
pnpm --filter @billnote/db prisma:generate
pnpm --filter @billnote/db db:push
pnpm --filter @billnote/api dev
pnpm --filter @billnote/web dev
```

- Web: http://localhost:3000
- API ready (Postgres + Redis): http://localhost:4000/health/ready
- OpenAPI: http://localhost:4000/docs

Redis is used for rate limits, permission cache, business-switch markers, and the tenant provision queue (`bn:queue:provision`).

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm lint` | ESLint across packages |
| `pnpm typecheck` | TypeScript across packages |
| `pnpm test` | Vitest unit tests |
| `pnpm build` | Build packages and apps |

## Workspace layout

```text
apps/web        Next.js PWA
apps/api        NestJS API
apps/mobile     Expo Android/iOS
apps/desktop    Electron wrapper
packages/ui     Tip and web components
packages/shared money, tokens, help, terms
packages/config tsconfig, eslint, env schema
docs/design     Phase 1 system design
```

## Money rule

All money is integer **paise** (`bigint`). All quantities are integer **milli-units**. Use `@billnote/shared/money`. Never use JavaScript `number` for money.
