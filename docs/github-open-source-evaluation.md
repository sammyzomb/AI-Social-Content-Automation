# Open-source Evaluation

## 1. Postiz
Repository: `gitroomhq/postiz-app`

**Position:** Primary candidate.

Recommended use:
- account connection
- OAuth/token handling
- scheduling
- retry
- multi-platform publishing

Important: review AGPL-3.0 obligations before production use.

## 2. BrightBean Studio
Repository: `brightbeanxyz/brightbean-studio`

**Position:** Secondary candidate / comparison POC.

Strengths:
- multi-platform account management
- Docker deployment
- OAuth/token health model

## 3. TryPost
Repository: `trypostit/trypost`

**Position:** Backup / research candidate.

## 4. social-mcp
Repository: `IhsanKabir/social-mcp`

**Position:** AI-agent integration reference; not primary because TikTok coverage is incomplete.

## 5. Mixpost
**Position:** Mature alternative, but commercial/license conditions should be reviewed before adoption.

## Recommended architecture
Build the company-specific AI Content Engine and Quality Engine in this repository, then connect to Postiz as the primary publishing engine. Keep BrightBean Studio as the comparison fallback.
