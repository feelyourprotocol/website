# MCP Docs Site

VitePress site for **mcp-docs.feelyourprotocol.org** — the **concrete, present-tense** documentation home for the Feel Your Protocol MCP server: tool reference, technical setup, and operational guides for humans and AI agents.

For vision, strategy, and draft concepts, see the [roadmap site](https://roadmap.feelyourprotocol.org). This site documents **what we have** (or are shipping step by step).

## Development

```bash
# from website/
npm run mcp-docs:dev
```

## Build & preview

```bash
npm run mcp-docs:build
npm run mcp-docs:preview
```

Production output: `dist/mcp-docs/` (rebuilt on deploy via `npm run build:deploy`; `dist/` is not in git).

## Structure

```
mcp-docs/
├── .vitepress/
│   ├── config.ts                 # Site config, SEO, nav + sidebar
│   └── theme/
│       ├── index.ts              # "Machine Room" skin; registers Changelog
│       ├── custom.css            # Terminal-green FYP skin
│       └── components/
│           └── Changelog.vue     # Per-section micro-changelog
├── guide/
│   ├── overview.md               # What we are building, status, repos
│   └── roadmap-relationship.md   # Roadmap vs MCP docs vs server-config
├── index.md                      # Home (hero + features)
└── public/                       # robots.txt, llms.txt, fonts/, og/
```

## Visual skin

Uses shared tokens from `shared/vitepress/fyp-tokens.css` with class **`fyp-site-mcp`** — terminal-green accent, mono-led headings, green-tinted dot grid. Distinct from:

- **docs** — cyan "Builder's Workshop"
- **roadmap** — purple "Strategy HQ"

## Micro-versioning

Fast-moving sections embed `<Changelog :entries="…" />` with a short manual entry per change (same pattern as roadmap).

## SEO & social preview

Meta tags (canonical, Open Graph, Twitter) are injected at build time via `transformHead` in `.vitepress/config.ts`, plus a generated `sitemap.xml`.

**Open Graph image** — generate at 1200×630 from `public/og/render.html` (add `generate:og:mcp-docs` to the `og/` package when needed). Until then, copy or generate `public/og/default.webp` before first social share.

## Subdomain deployment

Nginx blocks are in the private `server-config` repo (`config/fyp_nginx`, BLOCK 10–11).

After first deploy, expand the certificate:

```bash
sudo certbot -d feelyourprotocol.org -d www.feelyourprotocol.org \
  -d docs.feelyourprotocol.org -d website-docs.feelyourprotocol.org \
  -d community-token.feelyourprotocol.org \
  -d roadmap.feelyourprotocol.org -d mcp-docs.feelyourprotocol.org
```

DNS: add an `A` (or `CNAME`) record for `mcp-docs.feelyourprotocol.org` pointing at the Strato V-Server (same as other FYP subdomains).

## Sensitive config

Real nginx snippets, deploy paths, and secrets stay in **`feelyourprotocol/server-config`** (private). This public site describes shapes and outcomes only.
