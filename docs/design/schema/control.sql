-- BILLNOTE control-plane schema
-- Design contract for Phase 2. Not applied by itself.
-- One database for the platform. No shop operational data here.

CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Users and login
-- ---------------------------------------------------------------------------

CREATE TABLE users (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name           text NOT NULL,
  email               citext UNIQUE,
  phone_e164          text UNIQUE,
  password_hash       text,
  locale              text NOT NULL DEFAULT 'en',
  status              text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  email_verified_at   timestamptz,
  phone_verified_at   timestamptz,
  totp_secret_enc     text,
  totp_enabled_at     timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  deleted_at          timestamptz,
  CONSTRAINT users_contact_chk CHECK (email IS NOT NULL OR phone_e164 IS NOT NULL),
  CONSTRAINT users_phone_chk CHECK (
    phone_e164 IS NULL OR phone_e164 ~ '^\+[1-9][0-9]{7,14}$'
  )
);

CREATE TABLE otp_challenges (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES users (id),
  destination   text NOT NULL,
  channel       text NOT NULL CHECK (channel IN ('sms', 'email')),
  purpose       text NOT NULL CHECK (purpose IN ('signup', 'login', 'verify')),
  code_hash     text NOT NULL,
  attempts      integer NOT NULL DEFAULT 0,
  expires_at    timestamptz NOT NULL,
  consumed_at   timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX otp_challenges_destination_idx ON otp_challenges (destination, created_at DESC);

CREATE TABLE sessions (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 uuid NOT NULL REFERENCES users (id),
  refresh_token_hash      text NOT NULL,
  family_id               uuid NOT NULL,
  replaced_by_session_id  uuid,
  expires_at              timestamptz NOT NULL,
  revoked_at              timestamptz,
  revoke_reason           text,
  user_agent              text,
  ip                      inet,
  device_label            text,
  platform                text CHECK (platform IN ('web', 'android', 'ios', 'windows', 'macos', 'linux')),
  created_at              timestamptz NOT NULL DEFAULT now(),
  last_used_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX sessions_user_idx ON sessions (user_id, created_at DESC);
CREATE INDEX sessions_family_idx ON sessions (family_id);

CREATE TABLE login_events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES users (id),
  identifier      text NOT NULL,
  success         boolean NOT NULL,
  reason          text,
  ip              inet,
  user_agent      text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX login_events_user_idx ON login_events (user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- Businesses and membership
-- ---------------------------------------------------------------------------

CREATE TABLE businesses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id   uuid NOT NULL REFERENCES users (id),
  legal_name      text NOT NULL,
  display_name    text NOT NULL,
  category_key    text NOT NULL,
  status          text NOT NULL DEFAULT 'provisioning'
                    CHECK (status IN ('provisioning', 'ready', 'failed', 'suspended', 'deleted')),
  cluster_key     text NOT NULL DEFAULT 'primary',
  database_name   text NOT NULL UNIQUE,
  schema_version  integer NOT NULL DEFAULT 0,
  region          text NOT NULL DEFAULT 'ap-south-1',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz
);

CREATE INDEX businesses_owner_idx ON businesses (owner_user_id);

CREATE TABLE memberships (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES users (id),
  business_id   uuid NOT NULL REFERENCES businesses (id),
  status        text NOT NULL DEFAULT 'active' CHECK (status IN ('invited', 'active', 'disabled')),
  perm_version  integer NOT NULL DEFAULT 1,
  is_default    boolean NOT NULL DEFAULT false,
  -- Cached for JWT until the tenant staff/role tables are the source of truth after switch.
  role_key      text NOT NULL DEFAULT 'owner',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, business_id)
);

CREATE INDEX memberships_user_idx ON memberships (user_id) WHERE status = 'active';

CREATE TABLE staff_invites (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   uuid NOT NULL REFERENCES businesses (id),
  destination   text NOT NULL,
  role_key      text NOT NULL,
  token_hash    text NOT NULL,
  expires_at    timestamptz NOT NULL,
  accepted_at   timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Migrations
-- ---------------------------------------------------------------------------

CREATE TABLE tenant_migration_state (
  business_id       uuid PRIMARY KEY REFERENCES businesses (id),
  current_version   integer NOT NULL DEFAULT 0,
  target_version    integer NOT NULL DEFAULT 0,
  status            text NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'running', 'failed')),
  locked_by         text,
  lock_expires_at   timestamptz,
  last_error        text,
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE tenant_migration_runs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   uuid NOT NULL REFERENCES businesses (id),
  version       integer NOT NULL,
  checksum      text NOT NULL,
  status        text NOT NULL CHECK (status IN ('applied', 'failed')),
  started_at    timestamptz NOT NULL,
  finished_at   timestamptz,
  error         text,
  UNIQUE (business_id, version, started_at)
);

CREATE UNIQUE INDEX tenant_migration_runs_applied_uidx
  ON tenant_migration_runs (business_id, version)
  WHERE status = 'applied';

-- ---------------------------------------------------------------------------
-- BILLNOTE subscriptions (the shop paying us)
-- ---------------------------------------------------------------------------

CREATE TABLE plans (
  id                    text PRIMARY KEY,
  name                  text NOT NULL,
  price_monthly_paise  bigint NOT NULL CHECK (price_monthly_paise >= 0),
  price_yearly_paise   bigint NOT NULL CHECK (price_yearly_paise >= 0),
  limits                jsonb NOT NULL,
  features              jsonb NOT NULL,
  active                boolean NOT NULL DEFAULT true
);

CREATE TABLE subscriptions (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id               uuid NOT NULL REFERENCES businesses (id),
  plan_id                   text NOT NULL REFERENCES plans (id),
  status                    text NOT NULL CHECK (status IN ('trialing', 'active', 'past_due', 'cancelled')),
  trial_ends_at             timestamptz,
  current_period_start      timestamptz NOT NULL,
  current_period_end        timestamptz NOT NULL,
  cancel_at_period_end      boolean NOT NULL DEFAULT false,
  razorpay_subscription_id  text,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX subscriptions_one_open_idx
  ON subscriptions (business_id)
  WHERE status IN ('trialing', 'active', 'past_due');

CREATE TABLE subscription_invoices (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id           uuid NOT NULL REFERENCES businesses (id),
  subscription_id       uuid NOT NULL REFERENCES subscriptions (id),
  amount_paise          bigint NOT NULL,
  gst_paise             bigint NOT NULL DEFAULT 0,
  status                text NOT NULL CHECK (status IN ('issued', 'paid', 'void')),
  razorpay_invoice_id   text,
  pdf_object_key        text,
  issued_on             date NOT NULL,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE processed_gateway_events (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider      text NOT NULL,
  event_id      text NOT NULL,
  payload       jsonb NOT NULL,
  received_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, event_id)
);

-- ---------------------------------------------------------------------------
-- App versions, consent, shared barcode cache
-- ---------------------------------------------------------------------------

CREATE TABLE app_releases (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform        text NOT NULL CHECK (platform IN ('android', 'ios', 'web', 'windows', 'macos', 'linux')),
  version         text NOT NULL,
  build_number    integer NOT NULL,
  min_supported   boolean NOT NULL DEFAULT false,
  channel         text NOT NULL DEFAULT 'prod' CHECK (channel IN ('prod', 'staging')),
  release_notes   text NOT NULL DEFAULT '',
  released_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (platform, version, build_number, channel)
);

CREATE TABLE consent_records (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES users (id),
  purpose         text NOT NULL,
  granted         boolean NOT NULL,
  policy_version  text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX consent_records_user_idx ON consent_records (user_id, created_at DESC);

-- Shared catalogue cache. Not shop data. Keyed by barcode.
CREATE TABLE barcode_lookup_cache (
  barcode       text PRIMARY KEY,
  payload       jsonb NOT NULL,
  source        text NOT NULL,
  fetched_at    timestamptz NOT NULL DEFAULT now(),
  expires_at    timestamptz NOT NULL
);

CREATE TABLE idempotency_keys (
  key            text PRIMARY KEY,
  user_id        uuid REFERENCES users (id),
  method         text NOT NULL,
  path           text NOT NULL,
  request_hash   text NOT NULL,
  status_code    integer NOT NULL,
  response       jsonb NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER businesses_updated BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER memberships_updated BEFORE UPDATE ON memberships
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER subscriptions_updated BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
