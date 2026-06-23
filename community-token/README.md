# Community Token Site

Standalone mini-site for **community-token.feelyourprotocol.org**.

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

## SEO & social preview (Tier 1)

Same pattern as the main site: meta tags are injected at build time (`scripts/generate-community-token-seo.ts` → `robots.txt`, `sitemap.xml`, Open Graph / Twitter in `index.html`). Dev applies the same tags client-side via `applyPageSeo` in `src/main.ts`.

**Open Graph / Twitter image** — place your artwork here (not in git until you add it):

```
community-token/public/og/default.png
```

| Requirement | Value                                                         |
| ----------- | ------------------------------------------------------------- |
| Format      | **PNG** (real PNG bytes — not JPEG renamed)                   |
| Size        | **1200 × 630** px                                             |
| Served at   | `https://community-token.feelyourprotocol.org/og/default.png` |

Main site equivalent: `public/og/default.png` → `feelyourprotocol.org/og/default.png`. Each subdomain keeps its own copy under its own `public/` folder.

Full deploy build (main site + community token + docs, rebuilt on server — `dist/` is not in git):

```bash
npm run build:deploy
```

## Content (fill in later)

| File                    | Purpose                                                                 |
| ----------------------- | ----------------------------------------------------------------------- |
| `src/content/fund.ts`   | Developer Fund (fee uses + short notes)                                 |
| `src/content/topics.ts` | Intro prose, `HOW_IT_WORKS` box meta, tabbed content (`GUIDELINE_TABS`) |
| `src/content/token.ts`  | Which-token reference (name, symbol, links)                             |

Layout: two columns on large screens — left: intro + token; right: **How fees are used** box (top) + tabbed **How this works** (bottom). Tabs: `Scope`, `Token Relationship`, `Terms`, `Community`.

## Subdomain deployment

Nginx block is prepared in `server-config/config/fyp_nginx` (BLOCK 6–7).

After first deploy:

```bash
sudo certbot certonly --nginx -d community-token.feelyourprotocol.org
# or expand existing cert:
# sudo certbot -d feelyourprotocol.org -d www.feelyourprotocol.org \
#   -d docs.feelyourprotocol.org -d community-token.feelyourprotocol.org
```
