CREATE TABLE IF NOT EXISTS source_items (
  source_id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  url TEXT,
  valid_from TIMESTAMPTZ,
  valid_to TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS social_accounts (
  account_id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  official_flag BOOLEAN NOT NULL DEFAULT FALSE,
  auto_publish_allowed BOOLEAN NOT NULL DEFAULT FALSE,
  content_categories JSONB NOT NULL DEFAULT '[]'::jsonb,
  daily_limit INTEGER NOT NULL DEFAULT 0,
  minimum_interval_minutes INTEGER NOT NULL DEFAULT 0,
  access_token TEXT,
  refresh_token TEXT,
  token_expire_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active',
  last_health_check TIMESTAMPTZ,
  last_error TEXT
);

CREATE TABLE IF NOT EXISTS topics (
  topic_id TEXT PRIMARY KEY,
  pillar TEXT NOT NULL,
  destination TEXT,
  angle TEXT NOT NULL,
  keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  post_id TEXT PRIMARY KEY,
  topic_id TEXT REFERENCES topics(topic_id),
  platform TEXT NOT NULL,
  account_id TEXT REFERENCES social_accounts(account_id),
  caption TEXT NOT NULL,
  cta TEXT,
  hashtags JSONB NOT NULL DEFAULT '[]'::jsonb,
  risk_level TEXT NOT NULL,
  quality_score NUMERIC,
  status TEXT NOT NULL,
  source_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assets (
  asset_id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  source_url TEXT,
  photographer TEXT,
  license_note TEXT,
  local_url TEXT,
  alt_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS schedule (
  post_id TEXT PRIMARY KEY REFERENCES posts(post_id),
  platform TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL,
  retry_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS publish_log (
  publish_id BIGSERIAL PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES posts(post_id),
  platform_post_id TEXT,
  published_at TIMESTAMPTZ,
  url TEXT,
  response_code INTEGER,
  error_message TEXT,
  idempotency_key TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS metrics (
  metric_id BIGSERIAL PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES posts(post_id),
  measured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  impressions BIGINT,
  reach BIGINT,
  clicks BIGINT,
  reactions BIGINT,
  comments BIGINT,
  shares BIGINT,
  conversions BIGINT
);

CREATE TABLE IF NOT EXISTS content_fingerprint (
  fingerprint_id BIGSERIAL PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES posts(post_id),
  title_hash TEXT,
  semantic_key TEXT,
  last_published_at TIMESTAMPTZ
);
