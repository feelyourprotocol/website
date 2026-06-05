# Community Token Site

Standalone mini-site for **communitytoken.feelyourprotocol.org**.

It shares the Feel Your Protocol design language (JetBrains Mono, purple/cyan sparks, dot grid) but uses its own layout and build output so it reads as a separate space — not a subpage of the main explorations site.

## Development

```bash
# from website/
npm run community-token:dev
# → http://localhost:5174
```

## Build & preview

```bash
npm run community-token:build
npm run community-token:preview
# → http://localhost:4174
```

Production output: `dist/community-token/`

Full deploy build (main site + community token + docs):

```bash
npm run build:deploy
```

## Content (fill in later)

| File | Purpose |
| --- | --- |
| `src/content/fund.ts` | Developer Fund (fee uses + short notes) |
| `src/content/topics.ts` | Intro prose, `HOW_IT_WORKS` box meta, tabbed content (`GUIDELINE_TABS`) |
| `src/content/token.ts` | Which-token reference (name, symbol, links) |

Layout: two columns on large screens — left: intro + token; right: **How fees are used** box (top) + tabbed **How this works** (bottom). Tabs: `Scope`, `Token Relationship`, `Terms`, `Community`.

## Subdomain deployment

Nginx block is prepared in `server-config/config/fyp_nginx` (BLOCK 6–7).

After first deploy:

```bash
sudo certbot certonly --nginx -d communitytoken.feelyourprotocol.org
# or expand existing cert:
# sudo certbot -d feelyourprotocol.org -d www.feelyourprotocol.org \
#   -d docs.feelyourprotocol.org -d communitytoken.feelyourprotocol.org
```
