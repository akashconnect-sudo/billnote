-- BILLNOTE tenant schema
-- Design contract for Phase 3. Applied once per business database.
-- There is no business_id column. The database is the tenant boundary.
-- Money is bigint paise. Quantity is bigint milli-units (1000 = 1).

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE schema_migrations (
  version      integer PRIMARY KEY,
  name         text NOT NULL,
  checksum     text NOT NULL,
  applied_at   timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Shop profile, branches, people
-- ---------------------------------------------------------------------------

CREATE TABLE business_profile (
  id                              smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  legal_name                      text NOT NULL,
  display_name                    text NOT NULL,
  category_key                    text NOT NULL,
  phone_e164                      text,
  email                           text,
  website                         text,
  logo_file_id                    uuid,
  address_line1                   text,
  address_line2                   text,
  city                            text,
  pincode                         text,
  state_code                      text,
  fy_start_month                  integer NOT NULL DEFAULT 4 CHECK (fy_start_month BETWEEN 1 AND 12),
  price_mode                      text NOT NULL DEFAULT 'exclusive' CHECK (price_mode IN ('inclusive', 'exclusive')),
  round_off_mode                  text NOT NULL DEFAULT 'nearest_rupee' CHECK (round_off_mode IN ('none', 'nearest_rupee')),
  costing_method                  text NOT NULL DEFAULT 'weighted_avg' CHECK (costing_method IN ('weighted_avg', 'fifo')),
  allow_negative_stock            boolean NOT NULL DEFAULT false,
  composition_scheme              boolean NOT NULL DEFAULT false,
  gst_registered                  boolean NOT NULL DEFAULT false,
  upi_vpa                         text,
  terms_default                   text,
  signature_file_id               uuid,
  simple_mode_default             boolean NOT NULL DEFAULT true,
  loyalty_points_per_100_rupees   integer NOT NULL DEFAULT 0 CHECK (loyalty_points_per_100_rupees >= 0),
  location_tracking_enabled       boolean NOT NULL DEFAULT false,
  created_at                      timestamptz NOT NULL DEFAULT now(),
  updated_at                      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE gst_registrations (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gstin             text NOT NULL UNIQUE CHECK (
                      gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$'
                    ),
  legal_name        text NOT NULL,
  state_code        text NOT NULL,
  is_composition    boolean NOT NULL DEFAULT false,
  is_default        boolean NOT NULL DEFAULT false,
  created_at        timestamptz NOT NULL DEFAULT now(),
  deleted_at        timestamptz
);

CREATE TABLE branches (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gst_registration_id   uuid REFERENCES gst_registrations (id),
  name                  text NOT NULL,
  code                  text NOT NULL,
  phone_e164            text,
  address_line1         text,
  city                  text,
  pincode               text,
  state_code            text NOT NULL,
  lat                   numeric(9, 6),
  lng                   numeric(9, 6),
  is_default            boolean NOT NULL DEFAULT false,
  active                boolean NOT NULL DEFAULT true,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  deleted_at            timestamptz,
  UNIQUE (code)
);

CREATE TABLE stock_locations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id   uuid NOT NULL REFERENCES branches (id),
  name        text NOT NULL,
  is_default  boolean NOT NULL DEFAULT false,
  UNIQUE (branch_id, name)
);

CREATE TABLE counters (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id   uuid NOT NULL REFERENCES branches (id),
  name        text NOT NULL,
  active      boolean NOT NULL DEFAULT true,
  UNIQUE (branch_id, name)
);

CREATE TABLE devices (
  id            uuid PRIMARY KEY,
  name          text NOT NULL,
  platform      text NOT NULL CHECK (platform IN ('web', 'android', 'ios', 'windows', 'macos', 'linux')),
  app_version   text,
  last_seen_at  timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE staff (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL UNIQUE,
  display_name      text NOT NULL,
  phone_e164        text,
  pin_hash          text,
  commission_bps    integer CHECK (commission_bps IS NULL OR (commission_bps >= 0 AND commission_bps <= 10000)),
  active            boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  deleted_at        timestamptz
);

CREATE TABLE staff_branches (
  staff_id    uuid NOT NULL REFERENCES staff (id),
  branch_id   uuid NOT NULL REFERENCES branches (id),
  is_default  boolean NOT NULL DEFAULT false,
  PRIMARY KEY (staff_id, branch_id)
);

CREATE TABLE roles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key         text NOT NULL UNIQUE,
  name        text NOT NULL,
  is_system   boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE role_permissions (
  role_id          uuid NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
  permission_key   text NOT NULL,
  PRIMARY KEY (role_id, permission_key)
);

CREATE TABLE staff_roles (
  staff_id  uuid NOT NULL REFERENCES staff (id),
  role_id   uuid NOT NULL REFERENCES roles (id),
  PRIMARY KEY (staff_id, role_id)
);

CREATE TABLE staff_preferences (
  staff_id      uuid PRIMARY KEY REFERENCES staff (id),
  simple_mode   boolean NOT NULL DEFAULT true,
  locale        text NOT NULL DEFAULT 'en',
  help_mode     boolean NOT NULL DEFAULT false,
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Years, series, number blocks
-- ---------------------------------------------------------------------------

CREATE TABLE financial_years (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label       text NOT NULL UNIQUE,
  starts_on   date NOT NULL,
  ends_on     date NOT NULL,
  status      text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  CHECK (ends_on > starts_on)
);

CREATE TABLE accounting_periods (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fy_id         uuid NOT NULL REFERENCES financial_years (id),
  starts_on     date NOT NULL,
  ends_on       date NOT NULL,
  locked_at     timestamptz,
  locked_by     uuid REFERENCES staff (id),
  UNIQUE (fy_id, starts_on)
);

CREATE TABLE invoice_series (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gst_registration_id   uuid REFERENCES gst_registrations (id),
  branch_id             uuid REFERENCES branches (id),
  fy_id                 uuid NOT NULL REFERENCES financial_years (id),
  doc_type              text NOT NULL CHECK (doc_type IN (
                          'tax_invoice', 'bill_of_supply', 'quotation', 'proforma',
                          'sales_order', 'delivery_challan', 'credit_note', 'debit_note',
                          'sales_return', 'purchase_order', 'purchase_bill', 'purchase_return'
                        )),
  prefix                text NOT NULL,
  template              text NOT NULL DEFAULT '{prefix}/{fy}/{seq:6}',
  next_number           integer NOT NULL DEFAULT 1 CHECK (next_number >= 1),
  pad_width             integer NOT NULL DEFAULT 6,
  UNIQUE NULLS NOT DISTINCT (gst_registration_id, branch_id, fy_id, doc_type)
);

CREATE TABLE number_blocks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  series_id   uuid NOT NULL REFERENCES invoice_series (id),
  device_id   uuid NOT NULL REFERENCES devices (id),
  start_no    integer NOT NULL,
  end_no      integer NOT NULL,
  next_no     integer NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CHECK (end_no >= start_no),
  CHECK (next_no >= start_no AND next_no <= end_no + 1)
);

ALTER TABLE number_blocks
  ADD CONSTRAINT number_blocks_range_excl
  EXCLUDE USING gist (
    series_id WITH =,
    int4range(start_no, end_no, '[]') WITH &&
  );

-- ---------------------------------------------------------------------------
-- Files, tax, units, catalogue
-- ---------------------------------------------------------------------------

CREATE TABLE files (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purpose       text NOT NULL CHECK (purpose IN (
                  'logo', 'signature', 'product', 'attachment', 'import', 'pdf', 'label'
                )),
  object_key    text NOT NULL UNIQUE,
  mime          text NOT NULL,
  size_bytes    integer NOT NULL CHECK (size_bytes >= 0),
  checksum      text,
  created_by    uuid REFERENCES staff (id),
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE business_profile
  ADD CONSTRAINT business_profile_logo_fk FOREIGN KEY (logo_file_id) REFERENCES files (id);
ALTER TABLE business_profile
  ADD CONSTRAINT business_profile_signature_fk FOREIGN KEY (signature_file_id) REFERENCES files (id);

CREATE TABLE tax_rates (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  rate_bps    integer NOT NULL CHECK (rate_bps >= 0 AND rate_bps <= 10000),
  cess_bps    integer NOT NULL DEFAULT 0 CHECK (cess_bps >= 0 AND cess_bps <= 10000),
  is_exempt   boolean NOT NULL DEFAULT false,
  active      boolean NOT NULL DEFAULT true,
  UNIQUE (rate_bps, cess_bps, is_exempt)
);

CREATE TABLE units (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key         text NOT NULL UNIQUE,
  name        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE unit_conversions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_unit_id  uuid NOT NULL REFERENCES units (id),
  to_unit_id    uuid NOT NULL REFERENCES units (id),
  factor_num    bigint NOT NULL CHECK (factor_num > 0),
  factor_den    bigint NOT NULL CHECK (factor_den > 0),
  UNIQUE (from_unit_id, to_unit_id)
);

CREATE TABLE categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id   uuid REFERENCES categories (id),
  name        text NOT NULL,
  sort        integer NOT NULL DEFAULT 0,
  deleted_at  timestamptz
);

CREATE TABLE brands (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL UNIQUE,
  deleted_at  timestamptz
);

CREATE TABLE products (
  id                    uuid PRIMARY KEY,
  kind                  text NOT NULL CHECK (kind IN ('product', 'service')),
  name                  text NOT NULL,
  description           text,
  category_id           uuid REFERENCES categories (id),
  brand_id              uuid REFERENCES brands (id),
  sku                   text,
  hsn_sac               text,
  tax_rate_id           uuid REFERENCES tax_rates (id),
  unit_id               uuid NOT NULL REFERENCES units (id),
  mrp_paise             bigint CHECK (mrp_paise IS NULL OR mrp_paise >= 0),
  sale_price_paise      bigint NOT NULL DEFAULT 0 CHECK (sale_price_paise >= 0),
  purchase_price_paise  bigint NOT NULL DEFAULT 0 CHECK (purchase_price_paise >= 0),
  track_stock           boolean NOT NULL DEFAULT true,
  track_batch           boolean NOT NULL DEFAULT false,
  track_serial          boolean NOT NULL DEFAULT false,
  is_weighable          boolean NOT NULL DEFAULT false,
  schedule_drug         boolean NOT NULL DEFAULT false,
  reorder_milli         bigint NOT NULL DEFAULT 0,
  image_file_id         uuid REFERENCES files (id),
  custom                jsonb NOT NULL DEFAULT '{}',
  active                boolean NOT NULL DEFAULT true,
  version               integer NOT NULL DEFAULT 1,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  deleted_at            timestamptz
);

CREATE UNIQUE INDEX products_sku_uidx ON products (sku) WHERE sku IS NOT NULL AND deleted_at IS NULL;
CREATE INDEX products_name_trgm ON products USING gin (name gin_trgm_ops);

CREATE TABLE product_variants (
  id                uuid PRIMARY KEY,
  product_id        uuid NOT NULL REFERENCES products (id),
  name              text NOT NULL,
  sku               text,
  attributes        jsonb NOT NULL DEFAULT '{}',
  sale_price_paise  bigint CHECK (sale_price_paise IS NULL OR sale_price_paise >= 0),
  active            boolean NOT NULL DEFAULT true,
  version           integer NOT NULL DEFAULT 1,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  deleted_at        timestamptz
);

CREATE INDEX product_variants_product_idx ON product_variants (product_id);

CREATE TABLE product_barcodes (
  id           uuid PRIMARY KEY,
  product_id   uuid NOT NULL REFERENCES products (id),
  variant_id   uuid REFERENCES product_variants (id),
  barcode      text NOT NULL,
  symbology    text NOT NULL CHECK (symbology IN (
                 'ean13', 'ean8', 'upca', 'upce', 'code128', 'code39', 'qr', 'datamatrix', 'unknown'
               )),
  is_primary   boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now(),
  deleted_at   timestamptz
);

CREATE UNIQUE INDEX product_barcodes_live_uidx
  ON product_barcodes (barcode) WHERE deleted_at IS NULL;

CREATE TABLE price_lists (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  kind        text NOT NULL CHECK (kind IN ('retail', 'wholesale', 'tier')),
  active      boolean NOT NULL DEFAULT true,
  UNIQUE (name)
);

CREATE TABLE price_list_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  price_list_id   uuid NOT NULL REFERENCES price_lists (id) ON DELETE CASCADE,
  product_id      uuid NOT NULL REFERENCES products (id),
  variant_id      uuid REFERENCES product_variants (id),
  min_qty_milli   bigint NOT NULL DEFAULT 1000 CHECK (min_qty_milli > 0),
  price_paise     bigint NOT NULL CHECK (price_paise >= 0),
  UNIQUE NULLS NOT DISTINCT (price_list_id, product_id, variant_id, min_qty_milli)
);

CREATE TABLE parties (
  id                    uuid PRIMARY KEY,
  kind                  text NOT NULL CHECK (kind IN ('customer', 'supplier', 'both')),
  name                  text NOT NULL,
  phone_e164            text,
  email                 text,
  gstin                 text CHECK (
                          gstin IS NULL OR gstin ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$'
                        ),
  pan                   text,
  state_code            text,
  credit_limit_paise    bigint CHECK (credit_limit_paise IS NULL OR credit_limit_paise >= 0),
  price_list_id         uuid REFERENCES price_lists (id),
  loyalty_points        integer NOT NULL DEFAULT 0,
  notes                 text,
  custom                jsonb NOT NULL DEFAULT '{}',
  active                boolean NOT NULL DEFAULT true,
  version               integer NOT NULL DEFAULT 1,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  deleted_at            timestamptz
);

CREATE INDEX parties_name_trgm ON parties USING gin (name gin_trgm_ops);
CREATE INDEX parties_phone_idx ON parties (phone_e164) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX parties_gstin_uidx ON parties (gstin) WHERE gstin IS NOT NULL AND deleted_at IS NULL;

CREATE TABLE party_addresses (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id    uuid NOT NULL REFERENCES parties (id),
  label       text NOT NULL DEFAULT 'Main',
  line1       text NOT NULL,
  line2       text,
  city        text,
  pincode     text,
  state_code  text NOT NULL,
  gstin       text,
  is_default  boolean NOT NULL DEFAULT false
);

-- ---------------------------------------------------------------------------
-- Stock
-- ---------------------------------------------------------------------------

CREATE TABLE batches (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL REFERENCES products (id),
  batch_no    text NOT NULL,
  mfg_on      date,
  expiry_on   date,
  UNIQUE (product_id, batch_no)
);

CREATE INDEX batches_expiry_idx ON batches (expiry_on) WHERE expiry_on IS NOT NULL;

CREATE TABLE serials (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL REFERENCES products (id),
  variant_id  uuid REFERENCES product_variants (id),
  serial_no   text NOT NULL,
  status      text NOT NULL DEFAULT 'in_stock' CHECK (status IN ('in_stock', 'sold', 'returned', 'written_off')),
  UNIQUE (product_id, serial_no)
);

CREATE TABLE stock_balances (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    uuid NOT NULL REFERENCES products (id),
  variant_id    uuid REFERENCES product_variants (id),
  branch_id     uuid NOT NULL REFERENCES branches (id),
  location_id   uuid NOT NULL REFERENCES stock_locations (id),
  batch_id      uuid REFERENCES batches (id),
  qty_milli     bigint NOT NULL DEFAULT 0,
  value_paise   bigint NOT NULL DEFAULT 0,
  UNIQUE NULLS NOT DISTINCT (product_id, variant_id, branch_id, location_id, batch_id)
);

CREATE TABLE stock_layers (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id              uuid NOT NULL REFERENCES products (id),
  variant_id              uuid REFERENCES product_variants (id),
  branch_id               uuid NOT NULL REFERENCES branches (id),
  location_id             uuid NOT NULL REFERENCES stock_locations (id),
  batch_id                uuid REFERENCES batches (id),
  qty_milli_remaining     bigint NOT NULL CHECK (qty_milli_remaining >= 0),
  unit_cost_micro_paise   bigint NOT NULL CHECK (unit_cost_micro_paise >= 0),
  received_at             timestamptz NOT NULL DEFAULT now(),
  source_movement_id      uuid
);

CREATE TABLE stock_movements (
  id            uuid PRIMARY KEY,
  occurred_at   timestamptz NOT NULL DEFAULT now(),
  product_id    uuid NOT NULL REFERENCES products (id),
  variant_id    uuid REFERENCES product_variants (id),
  branch_id     uuid NOT NULL REFERENCES branches (id),
  location_id   uuid NOT NULL REFERENCES stock_locations (id),
  batch_id      uuid REFERENCES batches (id),
  qty_milli     bigint NOT NULL,
  value_paise   bigint NOT NULL,
  reason        text NOT NULL CHECK (reason IN (
                  'opening', 'purchase', 'sale', 'sale_return', 'purchase_return',
                  'adjustment', 'transfer_out', 'transfer_in'
                )),
  document_id   uuid,
  line_id       uuid,
  note          text,
  created_by    uuid REFERENCES staff (id)
);

CREATE INDEX stock_movements_product_idx
  ON stock_movements (product_id, branch_id, occurred_at);

CREATE TABLE stock_transfers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_branch   uuid NOT NULL REFERENCES branches (id),
  to_branch     uuid NOT NULL REFERENCES branches (id),
  status        text NOT NULL CHECK (status IN ('draft', 'sent', 'received', 'cancelled')),
  sent_at       timestamptz,
  received_at   timestamptz,
  created_by    uuid REFERENCES staff (id),
  CHECK (from_branch <> to_branch)
);

CREATE TABLE stock_transfer_lines (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_id   uuid NOT NULL REFERENCES stock_transfers (id) ON DELETE CASCADE,
  product_id    uuid NOT NULL REFERENCES products (id),
  variant_id    uuid REFERENCES product_variants (id),
  batch_id      uuid REFERENCES batches (id),
  qty_milli     bigint NOT NULL CHECK (qty_milli > 0)
);

CREATE TABLE stock_counts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id   uuid NOT NULL REFERENCES branches (id),
  status      text NOT NULL CHECK (status IN ('open', 'posted', 'cancelled')),
  started_at  timestamptz NOT NULL DEFAULT now(),
  posted_at   timestamptz,
  created_by  uuid REFERENCES staff (id)
);

CREATE TABLE stock_count_lines (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  count_id            uuid NOT NULL REFERENCES stock_counts (id) ON DELETE CASCADE,
  product_id          uuid REFERENCES products (id),
  barcode             text,
  expected_milli      bigint,
  counted_milli       bigint NOT NULL,
  UNIQUE NULLS NOT DISTINCT (count_id, product_id, barcode)
);

-- ---------------------------------------------------------------------------
-- Documents and payments
-- ---------------------------------------------------------------------------

CREATE TABLE documents (
  id                      uuid PRIMARY KEY,
  doc_type                text NOT NULL CHECK (doc_type IN (
                            'tax_invoice', 'bill_of_supply', 'quotation', 'proforma',
                            'sales_order', 'delivery_challan', 'credit_note', 'debit_note',
                            'sales_return', 'purchase_order', 'purchase_bill', 'purchase_return'
                          )),
  status                  text NOT NULL CHECK (status IN (
                            'draft', 'held', 'confirmed', 'partially_paid', 'paid',
                            'cancelled', 'void', 'converted'
                          )),
  series_id               uuid REFERENCES invoice_series (id),
  number                  integer,
  display_number          text,
  fy_id                   uuid REFERENCES financial_years (id),
  branch_id               uuid NOT NULL REFERENCES branches (id),
  counter_id              uuid REFERENCES counters (id),
  staff_id                uuid REFERENCES staff (id),
  party_id                uuid REFERENCES parties (id),
  place_of_supply_state   text NOT NULL,
  supply_type             text NOT NULL CHECK (supply_type IN ('intra', 'inter')),
  price_mode              text NOT NULL CHECK (price_mode IN ('inclusive', 'exclusive')),
  reverse_charge          boolean NOT NULL DEFAULT false,
  is_composition          boolean NOT NULL DEFAULT false,
  subtotal_paise          bigint NOT NULL DEFAULT 0,
  discount_paise          bigint NOT NULL DEFAULT 0,
  charge_paise            bigint NOT NULL DEFAULT 0,
  taxable_paise           bigint NOT NULL DEFAULT 0,
  cgst_paise              bigint NOT NULL DEFAULT 0,
  sgst_paise              bigint NOT NULL DEFAULT 0,
  igst_paise              bigint NOT NULL DEFAULT 0,
  cess_paise              bigint NOT NULL DEFAULT 0,
  round_off_paise         bigint NOT NULL DEFAULT 0,
  grand_total_paise       bigint NOT NULL DEFAULT 0,
  amount_paid_paise       bigint NOT NULL DEFAULT 0,
  balance_paise           bigint NOT NULL DEFAULT 0,
  notes                   text,
  terms                   text,
  reason                  text,
  source_document_id      uuid REFERENCES documents (id),
  irn                     text,
  irn_qr_text             text,
  ack_no                  text,
  ack_at                  timestamptz,
  eway_bill_no            text,
  custom                  jsonb NOT NULL DEFAULT '{}',
  device_id               uuid REFERENCES devices (id),
  idempotency_key         text,
  version                 integer NOT NULL DEFAULT 1,
  issued_on               date,
  confirmed_at            timestamptz,
  voided_at               timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now(),
  deleted_at              timestamptz,
  CHECK (grand_total_paise >= 0),
  CHECK (amount_paid_paise >= 0),
  CHECK (balance_paise = grand_total_paise - amount_paid_paise)
);

CREATE UNIQUE INDEX documents_series_number_uidx
  ON documents (series_id, number)
  WHERE number IS NOT NULL AND deleted_at IS NULL;

CREATE UNIQUE INDEX documents_display_number_uidx
  ON documents (display_number)
  WHERE display_number IS NOT NULL AND deleted_at IS NULL;

CREATE INDEX documents_issued_idx ON documents (issued_on, status);
CREATE INDEX documents_party_idx ON documents (party_id, issued_on);
CREATE INDEX documents_branch_idx ON documents (branch_id, doc_type, issued_on);
CREATE INDEX documents_display_trgm ON documents USING gin (display_number gin_trgm_ops);

CREATE TABLE document_lines (
  id                uuid PRIMARY KEY,
  document_id       uuid NOT NULL REFERENCES documents (id) ON DELETE CASCADE,
  line_no           integer NOT NULL,
  product_id        uuid REFERENCES products (id),
  variant_id        uuid REFERENCES product_variants (id),
  description       text NOT NULL,
  hsn_sac           text,
  unit_id           uuid REFERENCES units (id),
  qty_milli         bigint NOT NULL CHECK (qty_milli > 0),
  unit_price_paise  bigint NOT NULL CHECK (unit_price_paise >= 0),
  discount_bps      integer,
  discount_paise    bigint NOT NULL DEFAULT 0,
  tax_rate_bps      integer NOT NULL DEFAULT 0,
  cess_bps          integer NOT NULL DEFAULT 0,
  taxable_paise     bigint NOT NULL DEFAULT 0,
  cgst_paise        bigint NOT NULL DEFAULT 0,
  sgst_paise        bigint NOT NULL DEFAULT 0,
  igst_paise        bigint NOT NULL DEFAULT 0,
  cess_paise        bigint NOT NULL DEFAULT 0,
  line_total_paise  bigint NOT NULL DEFAULT 0,
  batch_id          uuid REFERENCES batches (id),
  custom            jsonb NOT NULL DEFAULT '{}',
  UNIQUE (document_id, line_no)
);

CREATE INDEX document_lines_product_idx ON document_lines (product_id);

CREATE TABLE document_line_serials (
  line_id    uuid NOT NULL REFERENCES document_lines (id) ON DELETE CASCADE,
  serial_id  uuid NOT NULL REFERENCES serials (id),
  PRIMARY KEY (line_id, serial_id)
);

CREATE TABLE document_charges (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id   uuid NOT NULL REFERENCES documents (id) ON DELETE CASCADE,
  name          text NOT NULL,
  amount_paise  bigint NOT NULL,
  tax_rate_bps  integer NOT NULL DEFAULT 0
);

CREATE TABLE document_files (
  document_id  uuid NOT NULL REFERENCES documents (id) ON DELETE CASCADE,
  file_id      uuid NOT NULL REFERENCES files (id),
  PRIMARY KEY (document_id, file_id)
);

CREATE TABLE payments (
  id               uuid PRIMARY KEY,
  direction        text NOT NULL CHECK (direction IN ('in', 'out')),
  party_id         uuid REFERENCES parties (id),
  mode             text NOT NULL CHECK (mode IN (
                     'cash', 'upi', 'card', 'bank', 'cheque', 'wallet', 'credit', 'advance'
                   )),
  amount_paise     bigint NOT NULL CHECK (amount_paise > 0),
  paid_on          date NOT NULL,
  reference        text,
  bank_account_id  uuid,
  notes            text,
  staff_id         uuid REFERENCES staff (id),
  device_id        uuid REFERENCES devices (id),
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX payments_paid_on_idx ON payments (paid_on, mode);

CREATE TABLE payment_allocations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id    uuid NOT NULL REFERENCES payments (id),
  document_id   uuid NOT NULL REFERENCES documents (id),
  amount_paise  bigint NOT NULL CHECK (amount_paise > 0),
  UNIQUE (payment_id, document_id)
);

CREATE TABLE pos_sessions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  counter_id            uuid NOT NULL REFERENCES counters (id),
  staff_id              uuid NOT NULL REFERENCES staff (id),
  opened_at             timestamptz NOT NULL DEFAULT now(),
  closed_at             timestamptz,
  opening_cash_paise    bigint NOT NULL DEFAULT 0,
  closing_cash_paise    bigint,
  expected_cash_paise   bigint
);

-- ---------------------------------------------------------------------------
-- Ledger, bank, expenses
-- ---------------------------------------------------------------------------

CREATE TABLE accounts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code        text NOT NULL UNIQUE,
  name        text NOT NULL,
  type        text NOT NULL CHECK (type IN ('asset', 'liability', 'equity', 'income', 'expense')),
  parent_id   uuid REFERENCES accounts (id),
  party_id    uuid REFERENCES parties (id),
  is_system   boolean NOT NULL DEFAULT false,
  active      boolean NOT NULL DEFAULT true
);

-- bank_account_id is constrained after bank_accounts exists.

CREATE TABLE journals (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  posted_on     date NOT NULL,
  memo          text,
  source_type   text NOT NULL,
  source_id     uuid,
  reversal_of   uuid REFERENCES journals (id),
  period_id     uuid REFERENCES accounting_periods (id),
  created_by    uuid REFERENCES staff (id),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX journals_posted_idx ON journals (posted_on);
CREATE UNIQUE INDEX journals_source_uidx ON journals (source_type, source_id) WHERE source_id IS NOT NULL;

CREATE TABLE journal_lines (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_id    uuid NOT NULL REFERENCES journals (id),
  account_id    uuid NOT NULL REFERENCES accounts (id),
  debit_paise   bigint NOT NULL DEFAULT 0,
  credit_paise  bigint NOT NULL DEFAULT 0,
  CHECK (debit_paise >= 0 AND credit_paise >= 0),
  CHECK (
    (debit_paise > 0 AND credit_paise = 0)
    OR (credit_paise > 0 AND debit_paise = 0)
  )
);

CREATE INDEX journal_lines_account_idx ON journal_lines (account_id, journal_id);

CREATE TABLE bank_accounts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id       uuid NOT NULL UNIQUE REFERENCES accounts (id),
  name             text NOT NULL,
  bank_name        text,
  account_no_enc   text,
  ifsc             text,
  upi_vpa          text,
  active           boolean NOT NULL DEFAULT true
);

ALTER TABLE payments
  ADD CONSTRAINT payments_bank_fk FOREIGN KEY (bank_account_id) REFERENCES bank_accounts (id);

CREATE TABLE bank_statement_lines (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_account_id          uuid NOT NULL REFERENCES bank_accounts (id),
  txn_date                 date NOT NULL,
  amount_paise             bigint NOT NULL,
  description              text,
  imported_hash            text NOT NULL UNIQUE,
  matched_journal_line_id  uuid REFERENCES journal_lines (id)
);

CREATE TABLE expense_categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL UNIQUE,
  account_id  uuid NOT NULL REFERENCES accounts (id)
);

CREATE TABLE recurring_rules (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purpose       text NOT NULL CHECK (purpose IN ('invoice', 'expense', 'reminder')),
  interval      text NOT NULL CHECK (interval IN ('daily', 'weekly', 'monthly', 'yearly')),
  next_run_on   date NOT NULL,
  template      jsonb NOT NULL,
  active        boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE expenses (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id         uuid NOT NULL REFERENCES expense_categories (id),
  branch_id           uuid NOT NULL REFERENCES branches (id),
  party_id            uuid REFERENCES parties (id),
  amount_paise        bigint NOT NULL CHECK (amount_paise >= 0),
  tax_paise           bigint NOT NULL DEFAULT 0,
  spent_on            date NOT NULL,
  pay_mode            text NOT NULL,
  notes               text,
  file_id             uuid REFERENCES files (id),
  recurring_rule_id   uuid REFERENCES recurring_rules (id),
  journal_id          uuid REFERENCES journals (id),
  created_by          uuid REFERENCES staff (id),
  created_at          timestamptz NOT NULL DEFAULT now(),
  deleted_at          timestamptz
);

-- ---------------------------------------------------------------------------
-- Templates, messages, loyalty, dashboard
-- ---------------------------------------------------------------------------

CREATE TABLE print_templates (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  doc_type    text NOT NULL,
  paper       text NOT NULL CHECK (paper IN ('a4', 'a5', 'thermal80', 'thermal58')),
  schema      jsonb NOT NULL,
  is_default  boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX print_templates_one_default_idx
  ON print_templates (doc_type, paper) WHERE is_default;

CREATE TABLE printers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  kind        text NOT NULL CHECK (kind IN ('thermal', 'label', 'a4')),
  connection  text NOT NULL CHECK (connection IN ('usb', 'bluetooth', 'network', 'system')),
  address     text,
  paper       text,
  is_default  boolean NOT NULL DEFAULT false
);

CREATE TABLE message_templates (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel   text NOT NULL CHECK (channel IN ('whatsapp', 'sms', 'email')),
  key       text NOT NULL,
  body      text NOT NULL,
  active    boolean NOT NULL DEFAULT true,
  UNIQUE (channel, key)
);

CREATE TABLE notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id    uuid REFERENCES staff (id),
  title       text NOT NULL,
  body        text NOT NULL,
  kind        text NOT NULL,
  data        jsonb NOT NULL DEFAULT '{}',
  read_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE coupons (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code             text NOT NULL UNIQUE,
  kind             text NOT NULL CHECK (kind IN ('percent', 'flat')),
  value            integer NOT NULL CHECK (value >= 0),
  min_bill_paise   bigint NOT NULL DEFAULT 0,
  starts_on        date,
  ends_on          date,
  active           boolean NOT NULL DEFAULT true
);

CREATE TABLE coupon_redemptions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id     uuid NOT NULL REFERENCES coupons (id),
  document_id   uuid NOT NULL REFERENCES documents (id),
  party_id      uuid REFERENCES parties (id),
  amount_paise  bigint NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE loyalty_entries (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id      uuid NOT NULL REFERENCES parties (id),
  points        integer NOT NULL,
  reason        text NOT NULL,
  document_id   uuid REFERENCES documents (id),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE commission_entries (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id      uuid NOT NULL REFERENCES staff (id),
  document_id   uuid REFERENCES documents (id),
  amount_paise  bigint NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE dashboard_layouts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_key    text,
  staff_id    uuid REFERENCES staff (id),
  layout      jsonb NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CHECK (role_key IS NOT NULL OR staff_id IS NOT NULL)
);

CREATE UNIQUE INDEX dashboard_layouts_role_idx
  ON dashboard_layouts (role_key) WHERE staff_id IS NULL AND role_key IS NOT NULL;
CREATE UNIQUE INDEX dashboard_layouts_staff_idx
  ON dashboard_layouts (staff_id) WHERE staff_id IS NOT NULL;

CREATE TABLE custom_field_defs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity       text NOT NULL CHECK (entity IN ('product', 'party', 'document', 'service')),
  key          text NOT NULL,
  label        text NOT NULL,
  field_type   text NOT NULL CHECK (field_type IN ('text', 'number', 'date', 'dropdown', 'checkbox', 'file')),
  options      jsonb,
  required     boolean NOT NULL DEFAULT false,
  sort         integer NOT NULL DEFAULT 0,
  archived_at  timestamptz,
  UNIQUE (entity, key)
);

CREATE TABLE quick_add_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid REFERENCES products (id),
  label       text NOT NULL,
  sort        integer NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------------
-- Audit, sync support, privacy
-- ---------------------------------------------------------------------------

CREATE TABLE activities (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type  text NOT NULL,
  entity_id    uuid NOT NULL,
  kind         text NOT NULL,
  body         text NOT NULL,
  staff_id     uuid REFERENCES staff (id),
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX activities_entity_idx ON activities (entity_type, entity_id, created_at DESC);

CREATE TABLE audit_logs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id     uuid REFERENCES staff (id),
  action       text NOT NULL,
  entity_type  text NOT NULL,
  entity_id    uuid,
  before       jsonb,
  after        jsonb,
  ip           inet,
  user_agent   text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX audit_logs_entity_idx ON audit_logs (entity_type, entity_id, created_at DESC);

CREATE TABLE scan_events (
  id          uuid PRIMARY KEY,
  staff_id    uuid REFERENCES staff (id),
  device_id   uuid REFERENCES devices (id),
  barcode     text NOT NULL,
  purpose     text NOT NULL CHECK (purpose IN ('lookup', 'bill', 'stocktake', 'label')),
  product_id  uuid REFERENCES products (id),
  outcome     text NOT NULL CHECK (outcome IN ('found', 'created', 'not_found', 'error')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX scan_events_barcode_idx ON scan_events (barcode, created_at DESC);

CREATE TABLE idempotency_keys (
  key            text PRIMARY KEY,
  method         text NOT NULL,
  path           text NOT NULL,
  request_hash   text NOT NULL,
  status_code    integer NOT NULL,
  response       jsonb NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE outbox (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type          text NOT NULL,
  payload       jsonb NOT NULL,
  status        text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  attempts      integer NOT NULL DEFAULT 0,
  available_at  timestamptz NOT NULL DEFAULT now(),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE consent_records (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id        uuid REFERENCES staff (id),
  user_id         uuid NOT NULL,
  permission_type text NOT NULL,
  state           text NOT NULL,
  policy_version  text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE location_events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id     uuid NOT NULL REFERENCES staff (id),
  lat          numeric(9, 6) NOT NULL,
  lng          numeric(9, 6) NOT NULL,
  accuracy_m   numeric(8, 2),
  purpose      text NOT NULL,
  recorded_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE e_invoice_jobs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id   uuid NOT NULL REFERENCES documents (id),
  status        text NOT NULL CHECK (status IN ('pending', 'issued', 'failed', 'cancelled')),
  request       jsonb NOT NULL,
  response      jsonb,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE eway_bills (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id   uuid NOT NULL REFERENCES documents (id),
  status        text NOT NULL,
  vehicle_no    text,
  valid_until   timestamptz,
  payload       jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE gst_return_exports (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind           text NOT NULL CHECK (kind IN ('gstr1', 'gstr3b', 'hsn')),
  period_start   date NOT NULL,
  period_end     date NOT NULL,
  payload        jsonb NOT NULL,
  created_by     uuid REFERENCES staff (id),
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Category modules (present in every tenant, shown when the preset enables them)
-- ---------------------------------------------------------------------------

CREATE TABLE dining_tables (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id   uuid NOT NULL REFERENCES branches (id),
  section     text NOT NULL DEFAULT 'Main',
  name        text NOT NULL,
  seats       integer NOT NULL DEFAULT 4,
  status      text NOT NULL DEFAULT 'free' CHECK (status IN ('free', 'occupied', 'reserved')),
  UNIQUE (branch_id, section, name)
);

CREATE TABLE modifier_groups (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  min_select  integer NOT NULL DEFAULT 0,
  max_select  integer NOT NULL DEFAULT 1
);

CREATE TABLE modifiers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id    uuid NOT NULL REFERENCES modifier_groups (id) ON DELETE CASCADE,
  name        text NOT NULL,
  price_paise bigint NOT NULL DEFAULT 0
);

CREATE TABLE product_modifier_groups (
  product_id  uuid NOT NULL REFERENCES products (id),
  group_id    uuid NOT NULL REFERENCES modifier_groups (id),
  PRIMARY KEY (product_id, group_id)
);

CREATE TABLE kots (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id   uuid NOT NULL REFERENCES documents (id),
  table_id      uuid REFERENCES dining_tables (id),
  status        text NOT NULL CHECK (status IN ('queued', 'preparing', 'ready', 'served', 'cancelled')),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE kot_lines (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kot_id             uuid NOT NULL REFERENCES kots (id) ON DELETE CASCADE,
  document_line_id   uuid REFERENCES document_lines (id),
  qty_milli          bigint NOT NULL,
  note               text,
  status             text NOT NULL DEFAULT 'queued'
);

CREATE TABLE appointments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id     uuid NOT NULL REFERENCES branches (id),
  party_id      uuid REFERENCES parties (id),
  staff_id      uuid REFERENCES staff (id),
  starts_at     timestamptz NOT NULL,
  ends_at       timestamptz NOT NULL,
  status        text NOT NULL CHECK (status IN ('booked', 'done', 'cancelled', 'no_show')),
  notes         text,
  document_id   uuid REFERENCES documents (id)
);

CREATE TABLE job_cards (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id     uuid NOT NULL REFERENCES branches (id),
  party_id      uuid REFERENCES parties (id),
  title         text NOT NULL,
  reference_no  text,
  status        text NOT NULL CHECK (status IN ('open', 'in_progress', 'ready', 'closed', 'cancelled')),
  complaint     text,
  document_id   uuid REFERENCES documents (id),
  opened_at     timestamptz NOT NULL DEFAULT now(),
  closed_at     timestamptz
);

CREATE TABLE job_card_tasks (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_card_id   uuid NOT NULL REFERENCES job_cards (id) ON DELETE CASCADE,
  description   text NOT NULL,
  staff_id      uuid REFERENCES staff (id),
  price_paise   bigint NOT NULL DEFAULT 0,
  status        text NOT NULL DEFAULT 'todo'
);

CREATE TABLE membership_plans (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL,
  duration_days  integer NOT NULL CHECK (duration_days > 0),
  price_paise    bigint NOT NULL CHECK (price_paise >= 0),
  active         boolean NOT NULL DEFAULT true
);

CREATE TABLE memberships (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id     uuid NOT NULL REFERENCES membership_plans (id),
  party_id    uuid NOT NULL REFERENCES parties (id),
  starts_on   date NOT NULL,
  ends_on     date NOT NULL,
  status      text NOT NULL CHECK (status IN ('active', 'expired', 'cancelled'))
);

CREATE TABLE fee_plans (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  total_paise  bigint NOT NULL CHECK (total_paise >= 0)
);

CREATE TABLE fee_schedules (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id      uuid NOT NULL REFERENCES parties (id),
  fee_plan_id   uuid NOT NULL REFERENCES fee_plans (id),
  due_on        date NOT NULL,
  amount_paise  bigint NOT NULL CHECK (amount_paise >= 0),
  document_id   uuid REFERENCES documents (id),
  status        text NOT NULL CHECK (status IN ('due', 'paid', 'waived'))
);

CREATE TABLE rooms (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id   uuid NOT NULL REFERENCES branches (id),
  name        text NOT NULL,
  rent_paise  bigint NOT NULL CHECK (rent_paise >= 0),
  cycle       text NOT NULL CHECK (cycle IN ('daily', 'monthly')),
  UNIQUE (branch_id, name)
);

CREATE TABLE occupancies (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id     uuid NOT NULL REFERENCES rooms (id),
  party_id    uuid NOT NULL REFERENCES parties (id),
  starts_on   date NOT NULL,
  ends_on     date,
  rent_paise  bigint NOT NULL,
  status      text NOT NULL CHECK (status IN ('active', 'ended'))
);

CREATE TABLE trips (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id     uuid NOT NULL REFERENCES branches (id),
  lr_number     text NOT NULL,
  party_id      uuid REFERENCES parties (id),
  from_text     text NOT NULL,
  to_text       text NOT NULL,
  vehicle_no    text,
  freight_paise bigint NOT NULL DEFAULT 0,
  status        text NOT NULL CHECK (status IN ('booked', 'in_transit', 'delivered', 'cancelled')),
  document_id   uuid REFERENCES documents (id),
  UNIQUE (lr_number)
);

CREATE TABLE visits (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id      uuid NOT NULL REFERENCES parties (id),
  staff_id      uuid REFERENCES staff (id),
  visited_at    timestamptz NOT NULL DEFAULT now(),
  notes         text,
  vitals        jsonb NOT NULL DEFAULT '{}',
  document_id   uuid REFERENCES documents (id)
);

CREATE TABLE recipes (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       uuid NOT NULL UNIQUE REFERENCES products (id),
  yield_qty_milli  bigint NOT NULL CHECK (yield_qty_milli > 0)
);

CREATE TABLE recipe_lines (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id              uuid NOT NULL REFERENCES recipes (id) ON DELETE CASCADE,
  ingredient_product_id  uuid NOT NULL REFERENCES products (id),
  qty_milli              bigint NOT NULL CHECK (qty_milli > 0)
);

CREATE TABLE attendance (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id    uuid NOT NULL REFERENCES staff (id),
  punched_at  timestamptz NOT NULL DEFAULT now(),
  kind        text NOT NULL CHECK (kind IN ('in', 'out')),
  lat         numeric(9, 6),
  lng         numeric(9, 6)
);

-- Foreign keys added here because the referenced tables are created earlier in this file.
ALTER TABLE stock_layers
  ADD CONSTRAINT stock_layers_movement_fk
  FOREIGN KEY (source_movement_id) REFERENCES stock_movements (id);

ALTER TABLE stock_movements
  ADD CONSTRAINT stock_movements_document_fk
  FOREIGN KEY (document_id) REFERENCES documents (id);

ALTER TABLE stock_movements
  ADD CONSTRAINT stock_movements_line_fk
  FOREIGN KEY (line_id) REFERENCES document_lines (id);

-- ---------------------------------------------------------------------------
-- Triggers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION reject_mutation() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION '% is immutable', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION protect_confirmed_document() RETURNS trigger AS $$
BEGIN
  IF OLD.status NOT IN ('draft', 'held') THEN
    IF NEW.subtotal_paise IS DISTINCT FROM OLD.subtotal_paise
       OR NEW.grand_total_paise IS DISTINCT FROM OLD.grand_total_paise
       OR NEW.taxable_paise IS DISTINCT FROM OLD.taxable_paise
       OR NEW.cgst_paise IS DISTINCT FROM OLD.cgst_paise
       OR NEW.sgst_paise IS DISTINCT FROM OLD.sgst_paise
       OR NEW.igst_paise IS DISTINCT FROM OLD.igst_paise
       OR NEW.cess_paise IS DISTINCT FROM OLD.cess_paise
       OR NEW.discount_paise IS DISTINCT FROM OLD.discount_paise
       OR NEW.round_off_paise IS DISTINCT FROM OLD.round_off_paise
       OR NEW.party_id IS DISTINCT FROM OLD.party_id
       OR NEW.number IS DISTINCT FROM OLD.number
       OR NEW.display_number IS DISTINCT FROM OLD.display_number
    THEN
      RAISE EXCEPTION 'confirmed document amounts are frozen';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION assert_journal_balanced() RETURNS trigger AS $$
DECLARE
  d bigint;
  c bigint;
  j uuid;
BEGIN
  j := COALESCE(NEW.journal_id, OLD.journal_id);
  SELECT COALESCE(SUM(debit_paise), 0), COALESCE(SUM(credit_paise), 0)
    INTO d, c FROM journal_lines WHERE journal_id = j;
  IF d <> c THEN
    RAISE EXCEPTION 'journal % is unbalanced', j;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER documents_updated BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER products_updated BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER parties_updated BEFORE UPDATE ON parties
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER business_profile_updated BEFORE UPDATE ON business_profile
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER documents_freeze BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION protect_confirmed_document();

CREATE TRIGGER stock_movements_immutable BEFORE UPDATE OR DELETE ON stock_movements
  FOR EACH ROW EXECUTE FUNCTION reject_mutation();
CREATE TRIGGER journals_immutable BEFORE UPDATE OR DELETE ON journals
  FOR EACH ROW EXECUTE FUNCTION reject_mutation();
CREATE TRIGGER journal_lines_immutable BEFORE UPDATE OR DELETE ON journal_lines
  FOR EACH ROW EXECUTE FUNCTION reject_mutation();
CREATE TRIGGER payments_immutable BEFORE UPDATE OR DELETE ON payments
  FOR EACH ROW EXECUTE FUNCTION reject_mutation();
CREATE TRIGGER audit_logs_immutable BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION reject_mutation();

CREATE CONSTRAINT TRIGGER journal_lines_balanced
  AFTER INSERT OR UPDATE OR DELETE ON journal_lines
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION assert_journal_balanced();
