# Install, security, repository layout, risks

## Install and download

### Web

The manifest names the app BILLNOTE, `short_name` BILLNOTE, icons at 192 and 512 including a maskable icon, `display: standalone`, `start_url` `/app`, theme colour `#0B6E4F`, background `#F4F0E8`. Shortcuts: New bill, Add item, Scan.

Workbox caches the app shell, uses a network-first strategy for API calls, and an offline fallback page. A background-sync queue holds invoices the service worker can replay; the app's own SQLite queue is the source of truth where background sync is missing (notably iOS Safari).

The install banner uses `beforeinstallprompt` on Chrome, Edge, and desktop. It appears after the first confirmed bill, not on the first visit. Dismiss and "Don't show again" are stored on the device. iOS Safari gets a pictured guide: Share, then Add to Home Screen. Standalone mode hides the guide.

A waiting service worker raises "New version available — Update now".

### Phones

EAS Build produces an Android App Bundle for Play and a signed APK for the website. iOS goes to TestFlight and the App Store. Bundle id `com.billnote.app`. Version is semver plus a build number. EAS Update ships JavaScript fixes. A build older than `minSupported` from `GET /app/version` shows a blocking update screen.

Universal links open an invoice URL in the app when it is installed, and on the website otherwise.

Store checklist (assets produced in Phase 9): phone screenshots, tablet screenshots, short and full description, privacy policy URL, and the Play data-safety answers matching the permission section.

### Desktop

Electron installers: Windows `.exe` and `.msi`, macOS `.dmg`, Linux `.AppImage` and `.deb`, code-signed. electron-updater. Optional launch at login, a tray icon, and a print bridge for USB and Bluetooth thermal printers.

### Download page

`/download` detects the device and leads with one button: Play Store, App Store, APK, Windows, macOS, or Install as a web app. QR codes point a phone at the store listing. The same login works after install. The permission step runs once per device.

## Security

| Control | Choice |
| --- | --- |
| Transport | HTTPS only. Camera, location, and the PWA already require it. Postgres connections use TLS. |
| Headers | Helmet. CORS allow-list from env. |
| Cookies | Refresh cookie as specified in the auth doc. Custom header CSRF defence. |
| Rate limits | Redis. Login and OTP are stricter than authenticated reads. |
| Queries | Prisma parameterized queries only. Raw SQL is allowed in the migration runner and nowhere else. |
| Uploads | Size cap, MIME allow-list, checksum stored. |
| Secrets | Env validated with zod at boot. Production uses a secret manager. `.env` is never committed. |
| Passwords | argon2id as specified. |
| Bank account numbers | AES-256-GCM. The key is `DATA_KEY`, separate from the JWT signing key. |
| TOTP secrets | Same encryption. |
| Aadhaar | Not collected. |
| Tenant mix-up | `current_database()` checked on every borrowed connection. |
| Period and ledger | Triggers in the tenant SQL. |
| Sessions | List and revoke. Reuse of a rotated refresh token revokes the family. |
| DPDP | Consent rows, export job (JSON plus files), delete. |

Delete of a business: the owner confirms by typing the shop name, the API exports if they ask, status becomes `deleted`, a job runs `pg_dump` to the backup bucket, then drops the database after the dump succeeds. The control plane keeps the business id and `deleted_at` and removes the person's membership. Profile fields on that tombstone are cleared.

Backups: nightly `pg_dump -Fc` per ready tenant, key `backups/{businessId}/{date}.dump`, 30 daily and 12 monthly copies. A restore script creates a new database, restores, and points a business row at it only with an explicit flag. A monthly restore drill is part of the runbook. The first drill happens before launch, in Phase 9.

Audit: `audit_logs` for login-sensitive settings, voids, role changes, exports, and deletes. `login_events` on the control plane.

## Repository layout

```text
billnote/
  apps/
    web/                 Next.js PWA
    mobile/              Expo
    desktop/             Electron
    api/                 NestJS
      src/modules/       one folder per area: auth, tenants, catalog, billing, stock, ledger, sync
  packages/
    ui/                  web components, including Tip
    shared/              zod, money, gst, help, terms, categories, permissions, breakpoints
    config/              eslint, tsconfig, env
    db/                  Prisma schemas and SQL migrations (Phase 2+)
  docs/
    design/              this design
  docker-compose.yml
  turbo.json
  pnpm-workspace.yaml
  .github/workflows/ci.yml
```

Each feature module, when its phase starts, gets: schema change, service, controller, DTOs, tests, screens at the breakpoints, help-catalog entries, and a short README section.

## Tests the design expects

| Area | Tests | Phase |
| --- | --- | --- |
| Paise format and milli quantities | Unit | 1, with the scaffold |
| GST rounding, the worked examples in the data model | Unit, including credit notes and odd paise | 4 |
| GSTIN check digit | Unit | 2 |
| Invoice numbering and number blocks | Unit plus a concurrency test | 4 |
| Stock movement and weighted average | Unit, including the zero-quantity value wipe | 3 |
| Journal balance | Integration against Postgres | 6 |
| Permission state machine | Unit, every state in the diagram | 2 |
| Tenant connection asserts the database name | Integration | 2 |
| Playwright viewports and tooltip audit | e2e | from 2, expanded each phase |
| Maestro or Detox smoke on Android | e2e | 9 |

Phase 1 before this approval has no code, so there is nothing to run yet. The scaffold that follows `continue` runs the paise unit tests, lint, and typecheck.

## Risks

| # | Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- | --- |
| R1 | Too many Postgres connections | Medium | High | LRU cap 80, 2 connections each, idle eviction, measured budget |
| R2 | Prisma client memory per tenant | Medium | Medium | Measure in Phase 2. Drizzle is the fallback (decision D1) |
| R3 | A bad migration reaches every tenant | Medium | High | Batches of 25, `SKIP LOCKED`, checksums, backward-compatible files |
| R4 | GST rounding disagrees with a CA | Medium | High | Golden vectors, human review before real GST invoices |
| R5 | Offline bills run out of numbers | Medium | Medium | Blocks of 100, hold-only when empty, no silent renumber |
| R6 | iOS PWA cannot install, sync, or print like Android | High | Medium | Native iOS app is the primary phone path. The website shows the Share guide |
| R7 | A request uses the wrong tenant database | Low | Critical | Assert `current_database()`. Ignore body tenant ids |
| R8 | Backups are never restored in practice | Medium | High | Restore script and a drill before launch |
| R9 | A cluster hits database-count or connection limits | Low | High | `cluster_key` on the business. New businesses move to the next cluster past 2,000 databases |
| R10 | Cheap Android cameras miss barcodes | High | Medium | Manual entry, wedge scanners, torch, debounce, swappable scanner interface |
| R11 | Thermal printers vary | High | Medium | ESC/POS test set in Phase 7, PDF share as the fallback |
| R12 | Store review rejects permission copy | Medium | Medium | Plain-language usage strings, privacy policy, data-safety form aligned with this doc |
| R13 | Prisma 8 RC gets installed by mistake | Medium | High | Exact pin of Prisma 7. CI fails if the major is not 7 |
| R14 | Floats leak into money | Medium | High | Branded bigint, ESLint on `Paise` and `Milli` names |
| R15 | Scope pulls a later phase forward | High | High | This phase gate. `continue` means the next slice only |
| R16 | Hindi copy is awkward | Medium | Medium | English is complete first. Hindi is reviewed per screen |
| R17 | Open Food Facts is wrong or slow | Medium | Low | Cache, and the person confirms before save |
| R18 | Code-signing certificates delay desktop and iOS | Medium | Medium | Start Apple, Google, and Windows certs before Phase 7, not during it |

## Phase 1 scaffold, after approval

Listed again so the next turn has a boundary. Included: workspaces, the four apps booting, tokens, breakpoints, `<Tip>`, English help starter, paise helpers and their tests, Postgres and Redis compose, CI lint and typecheck and unit test.

Left for Phase 2: Prisma schema, auth, provisioning, the app shell, the permission wizard, the PWA manifest and service worker.
