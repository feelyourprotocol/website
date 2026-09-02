# Roadmap Site

VitePress site for **roadmap.feelyourprotocol.org** — strategy, history, and draft concepts for Feel Your Protocol Phase 3: problem & vision, tracks, timeline, [launch week](/roadmap/launch), and outlines of the MCP server, x402, and pricing. Operational MCP docs live on [mcp-docs](https://mcp-docs.feelyourprotocol.org).

It shares the Feel Your Protocol design language (JetBrains Mono, purple/cyan protocol sparks, dot grid) but uses a customized VitePress theme so it reads as the "business" side of the project — separate from the [website docs](https://website-docs.feelyourprotocol.org) and the [explorations website](https://feelyourprotocol.org).

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
├── vision/                       # problem-vision, two-legs, principles
├── roadmap/                      # roadmap.md, timeline.md, launch.md
├── concepts/                     # api-mcp.md, x402.md
├── monetization/                 # pricing.md, token.md
├── infrastructure/               # aws.md
├── go-to-market/                 # distribution.md
├── social/                       # Twitter/thread capture app
├── index.md                      # Home (hero + features)
└── public/                       # robots.txt, fonts/, og/
```

## Visualizations

Both visualizations are **data-driven** so they are lightweight and trivial to re-render when things change:

- **Timeline** (`<Timeline />`) — edit `data/timeline.ts` to add phases/events.
- **Roadmap board** (`<RoadmapBoard />`) — edit `data/roadmap.ts` to add tracks (rows), horizons (columns), and items. Built for 2–5 tracks.

## Micro-versioning

There are no full doc versions. Instead, fast-moving sections embed a `<Changelog :entries="…" />` block with a short manual entry per change. Currently on: **Roadmap** (`roadmap/roadmap.md`), **Launch week** (`roadmap/launch.md`), **Agent API** (`concepts/api-mcp.md`), and **Pricing** (`monetization/pricing.md`).

## SEO & social preview

Meta tags (canonical, Open Graph, Twitter) are injected at build time via `transformHead` in `.vitepress/config.ts`, plus a generated `sitemap.xml`. Same pattern as the docs site.

**Open Graph / Twitter image** — generate at standard 1200×630 from `public/og/render.html`:

```bash
npm run generate:og:roadmap    # from website/ — requires og:setup once
```

Output: `roadmap/public/og/default.webp` — served at `https://roadmap.feelyourprotocol.org/og/default.webp`.

## Twitter / thread images

Reusable cards (hero, launch, timeline, board) — same Vue components + data as the site:

```bash
npm run capture:social              # builds preview + writes PNG/WebP
npm run capture:social -- launch      # single card
npm run social:dev                  # preview at localhost:5175/?card=launch
```

See [social/README.md](./social/README.md). Output: `roadmap/social/out/` (gitignored).

Tests: `npx vitest run roadmap/social/src/__tests__/ og/src/social/__tests__/`

## Subdomain deployment

Nginx block is prepared in `../server-config/config/fyp_nginx` (BLOCK 10–11).

After first deploy, expand the existing certificate to cover the subdomain:

```bash
sudo certbot -d feelyourprotocol.org -d www.feelyourprotocol.org \
  -d docs.feelyourprotocol.org -d website-docs.feelyourprotocol.org \
  -d community-token.feelyourprotocol.org \
  -d roadmap.feelyourprotocol.org -d mcp-docs.feelyourprotocol.org
```
