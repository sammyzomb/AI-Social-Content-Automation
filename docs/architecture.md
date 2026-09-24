# Architecture

```text
Content Sources
  ↓
AI Content Engine
  - Topic generation
  - Master draft
  - Platform variants
  - CTA / hashtag
  ↓
Quality Engine
  - Duplicate detection
  - Date / price / URL validation
  - Risk classification
  ↓
Social Publisher
  - Postiz (primary candidate)
  - OAuth / Token
  - Scheduler
  - Retry / Publish log
  ↓
Facebook / Instagram / Threads / TikTok / YouTube
  ↓
Analytics
  ↓
AI Optimization
```

## Account model
A unified `social_accounts` table should include:

- account_id
- platform
- account_name
- account_type
- official_flag
- auto_publish_allowed
- content_categories
- daily_limit
- minimum_interval_minutes
- access_token
- refresh_token
- token_expire_at
- status
- last_health_check
- last_error

## Publishing principle
The company-owned AI layer should create, validate and route content. The publishing layer should use official platform APIs where available and should not automate personal Facebook profiles through unofficial browser automation.
