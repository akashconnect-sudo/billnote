# BILLNOTE — Phase 1 system design

Status: **Phase 2 complete.** Control-plane Prisma schema, auth, Redis (rate limit, permission cache, provision queue), tenant DB provisioning, web app shell, permissions onboarding, and PWA service worker/install banner are in place.

Schema check on 24 November 2026: both SQL files loaded on an embedded PostgreSQL (PGlite). Docker is not installed on this machine, so this was not PostgreSQL 18 itself. The control-plane script created 17 tables. The tenant script created 96 tables. The database rejected a bad GSTIN, a bill whose balance did not match its total, a change to a confirmed bill's money columns, an unbalanced journal, an edit to a posted journal, and a second live row with the same barcode. It accepted a balanced journal and a status-only update on a confirmed bill.

This folder is the contract for every later phase. Phase 2 starts only after you reply `continue`, or after you reply with the decision numbers you want changed.

## How to read this

| Read this | When you want |
| --- | --- |
| This file | The choices that need your approval, and what the scaffold will contain |
| [01-architecture.md](01-architecture.md) | How the apps, API, databases, queue, and files fit together |
| [02-tenancy-auth-sync.md](02-tenancy-auth-sync.md) | Signup, tenant databases, login, roles, offline sync |
| [03-data-model.md](03-data-model.md) | Money rules, tax rules, ER diagrams, migration runner |
| [schema/control.sql](schema/control.sql) | Full control-plane SQL |
| [schema/tenant.sql](schema/tenant.sql) | Full per-business SQL |
| [04-barcode-permissions-ux.md](04-barcode-permissions-ux.md) | Scanning, permissions, layout per screen size, tooltips, Simple Mode |
| [05-api.md](05-api.md) | REST list, envelope, errors, webhooks |
| [06-delivery-security-risks.md](06-delivery-security-risks.md) | Installers, security, folder layout, risks |

## Product in one paragraph

BILLNOTE is a multi-tenant billing product for Indian businesses. Each business gets its own PostgreSQL database. The owner signs up, picks a business type, and lands on a dashboard written in everyday words. The same account works on an installable website, an Android app, an iPhone app, and a Windows, macOS, and Linux desktop app. Money is stored as whole paise. The first language is English, with Hindi beside it.

## Decisions waiting for your approval

These are the forks the brief left open, plus the version pins a new project has to make in November 2026. The rest of the design assumes the recommended column. Reply `continue` to accept all of them.

| # | Topic | Recommendation | Why |
| --- | --- | --- | --- |
| D1 | ORM | **Prisma 7, exact pin (7.10.x)** | Stable transactions, nested writes, and increment. Prisma 8 is still a release candidate and is missing those. `npm install prisma` currently resolves to the v8 RC, so the repo must pin v7. Drizzle stays the documented fallback if a Phase 2 load test shows the tenant client cache is too heavy. |
| D2 | Desktop shell | **Electron** | ESC/POS, USB/serial printers, and electron-updater are proven. Tauri is smaller, and its printer story is thinner. |
| D3 | Offline database on phones | **expo-sqlite** | It ships with Expo SDK 58 and EAS Build. The sync protocol lives in our code either way. |
| D4 | Camera scanner | **expo-camera behind a scanner interface** | One native stack for EAS. The interface can later host react-native-vision-camera if cheap Android phones miss barcodes. |
| D5 | PostgreSQL | **18.7 or newer 18.x** | Current patched 18 line. PostgreSQL 19 went GA on 19 November 2026; too new for the first release. |
| D6 | Node.js | **24 LTS (24.22.x)** | Still in LTS. Node 26 became LTS on 28 October 2026; we can move later. |
| D7 | API and web | **NestJS 12** and **Next.js 16 App Router**, **Tailwind CSS 4**, **Expo SDK 58** | Current stable majors that satisfy "Next.js 14+". NestJS 12 listens on localhost unless `host` is `0.0.0.0`; the Docker config will set that. |
| D8 | Money | **bigint paise** for every amount. **bigint milli-units** for every quantity (1 kg = 1000). Stock value on a balance row is bigint paise. | Matches the brief. JavaScript never uses `number` for money. |
| D9 | GST rounding | Per line, half away from zero, to the paise. Inclusive prices are split so taxable + tax = the typed price. Intra-state odd paise goes to CGST. | Shopkeepers expect the typed price to survive. A chartered accountant should review the vectors before the first real GST invoice (Phase 4). |
| D10 | Tenant schema shape | **One linear migration history for every business.** Category tables exist in every tenant database. The UI hides unused modules. | Divergent schemas across thousands of databases are how migrations get stuck. |
| D11 | Tenant identity | **No `business_id` column inside a tenant database.** The database name is the boundary. The connection manager checks `current_database()` before use. | A shared column would invite a query that trusts the client. |
| D12 | Plans | Placeholders only, confirmed again before Phase 9. Free ₹0: 1 user, 30 bills/month, 1 branch, watermark. Pro ₹499/month: 5 users, 3 branches, unlimited bills. Business ₹1499/month: unlimited users and branches, e-invoice. | Prices are a business choice, not an engineering one. The schema can store them. |
| D13 | Identity documents | BILLNOTE stores GSTIN and optional PAN. It does not collect Aadhaar. | The brief does not ask for Aadhaar, and storing it raises DPDP duties we do not need. |
| D14 | Invoice numbers offline | Each device gets a reserved block of 100 numbers per series. A confirmed GST invoice is never silently renumbered. | Silent renumbering breaks the shopkeeper's paper trail. |

Versions are pinned to a patch at scaffold time. Renovate may bump patches. Major bumps need a fresh decision.

## What "continue" will scaffold

Still Phase 1. No billing features.

- pnpm workspaces + Turborepo, TypeScript strict, ESLint, Prettier, EditorConfig
- `apps/web` — Next.js 16, Tailwind 4, shadcn/ui, a home screen that uses the tokens and `<Tip>`
- `apps/api` — NestJS 12, boots, `GET /health/live`, `GET /health/ready`, env validation, OpenAPI shell
- `apps/mobile` — Expo SDK 58, one screen, design tokens
- `apps/desktop` — Electron window with an auto-update stub and a preload bridge stub
- `packages/ui` — `<Tip>` skeleton (hover, focus, long-press, reduced motion, dark mode)
- `packages/shared` — design tokens, breakpoints, `help/en.ts` starter catalog, paise helpers
- `packages/config` — shared tsconfig, ESLint, zod env schema
- `docker-compose.yml` — PostgreSQL 18 and Redis 7
- GitHub Actions — install, lint, typecheck, unit test
- Unit tests for paise formatting and the help-catalog key rules
- Root README with how to boot the stack

Phase 1 scaffold does **not** include the Prisma schema, auth, or PWA install banner. Those are Phase 2, and they will follow this design.

## Phase map (unchanged)

| Phase | Builds |
| --- | --- |
| 1 | This design, then the scaffold above |
| 2 | Control-plane DB, auth, provisioning, RBAC, app shell, permissions, PWA install |
| 3 | Tenant DB, products, barcode flows, tooltips on those screens |
| 4 | POS, invoices, GST, payments, PDF |
| 5 | Dashboards, category presets, tour |
| 6 | Parties, purchases, expenses, accounts, reports |
| 7 | Offline sync, desktop installers, printers |
| 8 | Template designer, category modules, loyalty, notifications, location |
| 9 | Store builds, download page, subscriptions, hardening, e2e, deployment |
