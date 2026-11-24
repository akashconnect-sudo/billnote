# API

Base path: `/api/v1`. The version check sits outside that prefix because an old app must be able to call it.

`GET /app/version` returns:

```json
{
  "data": {
    "platform": "android",
    "installed": "1.4.0",
    "minSupported": "1.3.0",
    "latest": "1.5.0",
    "forceUpdate": false,
    "notes": "Bug fixes for barcode scan."
  },
  "error": null
}
```

`forceUpdate` is true when `installed` is below `minSupported`. The client then shows a full-screen update wall.

## Envelope

Success:

```json
{
  "data": {},
  "meta": { "requestId": "01J...", "cursor": null, "hasMore": false },
  "error": null
}
```

Failure:

```json
{
  "data": null,
  "error": {
    "code": "VALIDATION",
    "message": "Enter a 15-character GSTIN, or leave the field empty.",
    "details": [{ "path": "gstin", "message": "That GSTIN does not look right." }],
    "requestId": "01J..."
  }
}
```

The `message` is a sentence a shopkeeper can read. `code` is stable for the client. HTTP status matches the class: 400 validation, 401 unauthenticated, 403 forbidden, 404 missing, 409 conflict, 422 domain rule, 429 rate limit, 503 tenant still provisioning.

| Code | When |
| --- | --- |
| `VALIDATION` | Zod failed |
| `UNAUTHENTICATED` | Missing or bad access token |
| `FORBIDDEN` | Permission missing |
| `NOT_FOUND` | Row missing in this tenant |
| `CONFLICT` | Stale `version`, or the same idempotency key with a different body |
| `IDEMPOTENT_REPLAY` | Same key and same body. HTTP 200 with the stored response. This is success, not an error body |
| `NUMBER_EXHAUSTED` | Offline block is empty |
| `STOCK_SHORT` | Quantity would go negative and the shop disallows it |
| `PERIOD_LOCKED` | The month is locked |
| `TENANT_NOT_READY` | Provisioning has not finished |
| `GSTIN_INVALID` | Check digit failed |
| `CREDIT_LIMIT` | This bill would pass the customer's limit |
| `RATE_LIMITED` | Too many attempts |

## Pagination, filters, sort

`GET` collections take `limit` (default 30, max 100), `cursor`, `sort`, and `filter[field]`. The cursor is an opaque string. Sort fields are an allow-list per route. Unknown filters return `VALIDATION`.

## Idempotency

`POST` of invoices, payments, stock adjustments, and business creation require `Idempotency-Key`. The server stores the request hash and the response for 24 hours. The same key and the same hash returns the stored response. The same key and a different hash returns `CONFLICT`.

## Auth and session

| Method | Path | Permission |
| --- | --- | --- |
| POST | `/api/v1/auth/signup` | public |
| POST | `/api/v1/auth/login` | public |
| POST | `/api/v1/auth/otp/request` | public |
| POST | `/api/v1/auth/otp/verify` | public |
| POST | `/api/v1/auth/refresh` | refresh cookie or body |
| POST | `/api/v1/auth/logout` | session |
| POST | `/api/v1/auth/logout-all` | session |
| POST | `/api/v1/auth/2fa/setup` | session |
| POST | `/api/v1/auth/2fa/verify` | ticket |
| GET | `/api/v1/auth/sessions` | session |
| DELETE | `/api/v1/auth/sessions/:id` | session |
| GET | `/api/v1/me` | session |
| PATCH | `/api/v1/me` | session |
| GET | `/api/v1/me/businesses` | session |
| POST | `/api/v1/me/businesses/:id/switch` | membership |

## Business, staff, settings

| Method | Path | Permission |
| --- | --- | --- |
| POST | `/api/v1/businesses` | session, idempotent |
| GET | `/api/v1/businesses/:id/provisioning` | membership |
| GET | `/api/v1/settings/profile` | `settings.manage` or any member read |
| PATCH | `/api/v1/settings/profile` | `settings.manage` |
| GET PATCH | `/api/v1/branches` | `settings.manage` |
| GET PATCH | `/api/v1/counters` | `settings.manage` |
| GET POST PATCH | `/api/v1/staff` | `staff.manage` |
| POST | `/api/v1/staff/invites` | `staff.manage` |
| GET PUT | `/api/v1/roles/:id/permissions` | `role.manage` |
| GET PATCH | `/api/v1/settings/preferences` | own staff row |
| GET | `/api/v1/settings/permissions-status` | session |
| DELETE | `/api/v1/settings/location-data` | `settings.manage` |

## Catalogue and stock

| Method | Path | Permission |
| --- | --- | --- |
| GET POST PATCH DELETE | `/api/v1/products` | `product.read` `product.create` `product.update` `product.delete` |
| GET POST | `/api/v1/products/import` | `product.import` |
| GET | `/api/v1/products/import/sample` | `product.import` |
| POST | `/api/v1/barcodes/lookup` | `product.read` |
| POST | `/api/v1/scans` | `product.read` |
| GET POST | `/api/v1/stock/movements` | `stock.adjust` for writes, `product.read` for reads |
| POST | `/api/v1/stock/transfers` | `stock.transfer` |
| POST | `/api/v1/stock/counts` | `stock.count` |
| POST | `/api/v1/stock/counts/:id/post` | `stock.count` |
| GET POST | `/api/v1/labels` | `product.read` |

`POST /barcodes/lookup` body is `{ "barcode": "890..." }`. Response is either the tenant product or a catalogue suggestion with `source: "open_food_facts" | "none"`.

## Parties, documents, payments

| Method | Path | Permission |
| --- | --- | --- |
| GET POST PATCH DELETE | `/api/v1/parties` | `party.*` |
| GET | `/api/v1/parties/:id/statement` | `party.read` |
| GET POST | `/api/v1/documents` | `invoice.read` `invoice.create` |
| GET PATCH | `/api/v1/documents/:id` | `invoice.read` `invoice.update` |
| POST | `/api/v1/documents/:id/confirm` | `invoice.create` |
| POST | `/api/v1/documents/:id/void` | `invoice.void` |
| POST | `/api/v1/documents/:id/share` | `invoice.share` |
| POST | `/api/v1/documents/:id/convert` | `quote.convert` |
| GET POST | `/api/v1/payments` | `payment.read` `payment.create` |
| POST | `/api/v1/number-blocks` | `invoice.create` |
| GET POST | `/api/v1/purchases` | `purchase.read` `purchase.create` |
| GET POST | `/api/v1/expenses` | `expense.read` `expense.create` |

Purchases are documents with a purchase `doc_type`. The `/purchases` path is a filtered view, so the client does not hand-roll the filter.

Confirming a document is the transaction in the architecture doc: totals, stock, payment, journal.

## Sync, reports, accounts

| Method | Path | Permission |
| --- | --- | --- |
| POST | `/api/v1/sync/push` | matching permission per mutation |
| GET | `/api/v1/sync/pull` | session |
| GET | `/api/v1/reports/:key` | `report.view` |
| POST | `/api/v1/reports/:key/export` | `report.export` |
| GET | `/api/v1/ledger/accounts` | `accounting.view` |
| GET | `/api/v1/ledger/journals` | `accounting.view` |
| POST | `/api/v1/ledger/periods/:id/lock` | `accounting.lock` |
| GET POST | `/api/v1/dashboard` | session, customize needs `dashboard.customize` |
| GET PUT | `/api/v1/templates` | `template.manage` |
| GET | `/api/v1/search?q=` | session, results filtered by permission |

Report keys: `sales`, `purchases`, `gstr1`, `gstr3b`, `hsn`, `stock`, `valuation`, `profit-item`, `profit-party`, `aging`, `staff`, `tax`, `daybook`.

## Webhooks

Incoming: `POST /api/v1/webhooks/razorpay`, signature checked, event id stored in `processed_gateway_events`.

Outgoing, signed with HMAC SHA-256 in `X-Billnote-Signature`, retried from the outbox:

| Event | When |
| --- | --- |
| `invoice.confirmed` | A tax invoice, credit note, or debit note is confirmed |
| `invoice.voided` | A document is voided |
| `payment.received` | A payment is stored |
| `stock.low` | A balance crosses the reorder point |
| `subscription.updated` | The BILLNOTE plan changes |

Shops register endpoints in Phase 8. The table can wait until then; the event names above are reserved.

## Health and docs

| Method | Path | Who |
| --- | --- | --- |
| GET | `/health/live` | public |
| GET | `/health/ready` | public, no tenant data |
| GET | `/metrics` | internal network |
| GET | `/docs` | OpenAPI UI, off in production unless `EXPOSE_DOCS=true` |

The OpenAPI document is generated from the Nest controllers. A Bruno collection is generated from that document in CI so the two cannot drift.

## Client errors

The UI maps `code` to a sentence plus a next step. It never shows the raw code alone. Example: `STOCK_SHORT` → "Only 3 pieces of this item are left. Reduce the quantity, or turn on negative stock in settings."
