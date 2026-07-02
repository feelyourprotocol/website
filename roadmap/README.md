# Roadmap Site

VitePress site for **roadmap.feelyourprotocol.org** — the organizational home and **conceptualization workspace** for Feel Your Protocol Phase 3: problem & vision, milestones, roadmap tracks, timeline, and draft outlines of core concepts (future-protocol Agent API & MCP, x402, pricing/cost model) and infrastructure (AWS). Nothing here documents a shipped API yet.

It shares the Feel Your Protocol design language (JetBrains Mono, purple/cyan protocol sparks, dot grid) but uses a customized VitePress theme so it reads as the "business" side of the project — separate from the [website docs](https://docs.feelyourprotocol.org) and the [explorations website](https://feelyourprotocol.org).

## Development

```bash
# from website/
npm run roadmap:dev
```

## Build & preview

```bash
npm run roadmap:build
npm run roadmap:preview
```

Production output: `dist/roadmap/` (rebuilt on deploy via `npm run build:deploy`; `dist/` is not in git).

## Structure

```
roadmap/
├── .vitepress/
│   ├── config.ts                 # Site config, SEO, nav + sidebar
│   └── theme/
│       ├── index.ts              # Extends default theme; registers global components
│       ├── custom.css            # FYP skin (brand colors, fonts, dot grid) + viz styles
│       └── components/
│           ├── Timeline.vue      # Linear left→right project timeline
│           ├── RoadmapBoard.vue  # Flexible track × horizon board (2–5 tracks)
│           └── Changelog.vue     # Per-section micro-changelog
├── data/
│   ├── timeline.ts               # Timeline phases + events (edit to update)
│   └── roadmap.ts                # Roadmap tracks, horizons, items (edit to update)
├── overview/                     # vision.md, milestones.md
├── roadmap/                      # roadmap.md (board), timeline.md
├── concepts/                     # api-design.md, x402.md, pricing.md
├── infrastructure/               # aws.md
├── index.md                      # Home (hero + features)
└── public/                       # robots.txt, fonts/, og/
```

## Visualizations

Both visualizations are **data-driven** so they are lightweight and trivial to re-render when things change:

- **Timeline** (`<Timeline />`) — edit `data/timeline.ts` to add phases/events.
- **Roadmap board** (`<RoadmapBoard />`) — edit `data/roadmap.ts` to add tracks (rows), horizons (columns), and items. Built for 2–5 tracks.

## Micro-versioning

There are no full doc versions. Instead, fast-moving sections embed a `<Changelog :entries="…" />` block with a short manual entry per change. Currently on: **Roadmap** (`roadmap/roadmap.md`), **API standard** (`concepts/api-design.md`), and **Pricing** (`concepts/pricing.md`).

## SEO & social preview

Meta tags (canonical, Open Graph, Twitter) are injected at build time via `transformHead` in `.vitepress/config.ts`, plus a generated `sitemap.xml`. Same pattern as the docs site.

**Open Graph / Twitter image** — place artwork here (not in git until added):

```
roadmap/public/og/default.webp     (1200 × 630, WebP)
```

Served at `https://roadmap.feelyourprotocol.org/og/default.webp`.

## Subdomain deployment

Nginx block is prepared in `../server-config/config/fyp_nginx` (BLOCK 11–12).

After first deploy, expand the existing certificate to cover the subdomain:

```bash
sudo certbot -d feelyourprotocol.org -d www.feelyourprotocol.org \
  -d docs.feelyourprotocol.org -d community-token.feelyourprotocol.org \
  -d roadmap.feelyourprotocol.org
```
