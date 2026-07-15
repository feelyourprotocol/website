# Documentation Hub

Static landing page for **docs.feelyourprotocol.org** — the fleet entrypoint to all Feel Your Protocol documentation sites.

Each card has a square illustration header, audience-focused copy, and accent styling that mirrors the destination site's skin. On wide screens (≥1120px) all four cards sit in one row; below that, a 2×2 grid. Illustrations ship at 480px (~1.1 MB total).

Not VitePress. Built with Vite as a minimal static site (same dev/build pattern as `community-token/`).

## Development

```bash
# from website/
npm run docs:dev
```

Preview: http://localhost:5176

## Build

```bash
npm run docs:build
npm run docs:preview   # http://localhost:4176
```

Production output: `dist/docs/` (served on `docs.feelyourprotocol.org`).

## Behaviour on production

- `docs.feelyourprotocol.org/` — this landing page
- `docs.feelyourprotocol.org/*` (any other path) — nginx 301 → `website-docs.feelyourprotocol.org` (legacy SEO URLs)

## Structure

```
docs-hub/
├── index.html          # Single-page fleet overview (four doc cards)
├── main.css            # Shared FYP tokens + card skins mirroring each doc site
└── public/
    ├── favicon.png
    ├── logo.png
    ├── fonts/
    ├── llms.txt
    └── robots.txt
```

## Fleet cards

| Card | Subdomain | Accent |
| --- | --- | --- |
| Website Docs | website-docs.feelyourprotocol.org | Cyan |
| MCP Server Docs | mcp-docs.feelyourprotocol.org | Terminal green |
| Roadmap | roadmap.feelyourprotocol.org | Purple |
| Community Token | community-token.feelyourprotocol.org | Amber |
