# Feel Your Protocol

Interactive Ethereum protocol explorer — hands on.

Explore, visualize and understand Ethereum protocol changes (EIPs) by interacting with real library code running directly in the browser.

> **Status: Beta** — Fully functional, but reusable component APIs (E-Components, shared UI) are still settling. See [website-docs changelog](https://website-docs.feelyourprotocol.org/changelog.html) after pulling `main`.

## Quick start (explorations website)

```bash
git clone https://github.com/feelyourprotocol/website.git
cd website
npm install
npm run dev
```

Quality gates before a PR or agent hand-off:

```bash
npm run lf:ci        # lint + format (CI mode)
npm run type-check   # vue-tsc
npx vitest run       # unit tests
```

## For agents and contributors

This repo is a **multi-site monorepo** (one deploy, several subdomains). **Website docs** cover only the explorations site — not roadmap, MCP, or community token development.

| Start here | Purpose |
| --- | --- |
| [AGENTS.md](./AGENTS.md) | Doc map and cursor rules for coding agents |
| [website-docs/](https://website-docs.feelyourprotocol.org/) | Architecture, adding explorations, E-Components, styling, video |
| [website-docs/public/llms.txt](./website-docs/public/llms.txt) | Compact index for LLM context |

Exploration work lives under `src/explorations/`. The primary extension path is [Adding an Exploration](https://website-docs.feelyourprotocol.org/contributing/adding-an-exploration.html).

## Sites in this repo

All production URLs share one server build. Each site has its **own README** for structure, local dev, and deployment notes.

| Site | Production | Source | Dev docs |
| --- | --- | --- | --- |
| Explorations website | [feelyourprotocol.org](https://feelyourprotocol.org) | `src/`, `public/` | [website-docs/](./website-docs/) |
| Website docs | [website-docs.feelyourprotocol.org](https://website-docs.feelyourprotocol.org) | `website-docs/` | [website-docs/README.md](./website-docs/README.md) |
| Docs hub (fleet landing) | [docs.feelyourprotocol.org](https://docs.feelyourprotocol.org) | `docs-hub/` | [docs-hub/README.md](./docs-hub/README.md) |
| MCP server docs | [mcp-docs.feelyourprotocol.org](https://mcp-docs.feelyourprotocol.org) | `mcp-docs/` | [mcp-docs/README.md](./mcp-docs/README.md) |
| Roadmap | [roadmap.feelyourprotocol.org](https://roadmap.feelyourprotocol.org) | `roadmap/` | [roadmap/README.md](./roadmap/README.md) |
| Community token | [community-token.feelyourprotocol.org](https://community-token.feelyourprotocol.org) | `community-token/` | [community-token/README.md](./community-token/README.md) |

Roadmap and community token are public but **maintainer-facing** — their READMEs are not duplicated in website-docs.

## Maintainers

### Local dev (all targets)

```bash
npm run dev                  # explorations website
npm run website-docs:dev     # website contributor docs (VitePress)
npm run docs:dev             # docs hub landing
npm run mcp-docs:dev         # MCP docs (VitePress)
npm run roadmap:dev          # roadmap (VitePress)
npm run community-token:dev  # community token mini-site
```

### Build & deploy

```bash
npm run build          # all sites (+ website type-check)
npm run build:deploy   # all sites (website vite-only; used on server after git pull)
```

Outputs under `dist/` (`website`, `docs`, `website-docs`, `community-token`, `roadmap`, `mcp-docs`) are **not** in git — production runs `npm run build:deploy` after `git pull`. See `server-config/deployment/fyp_deploy.sh` in the private server-config repo.

### Optional tooling

**OG images** (social preview cards) — Playwright in `og/`. Not required for `npm run dev`. Once per machine: `npm run og:setup` then `npm run og:check`. See [og/README.md](./og/README.md).

**Roadmap thread visuals** — `npm run capture:social`. See [roadmap/social/README.md](./roadmap/social/README.md).

## Cross-site constants

Fleet URLs (roadmap origin, project X handle, etc.) live in [`src/libs/roadmapUrls.ts`](./src/libs/roadmapUrls.ts) and [`src/libs/docsUrls.ts`](./src/libs/docsUrls.ts). **Project X is @FeelEthereum** — not `@feelyourprotocol` (domain name ≠ handle).

## License

[MIT](LICENSE)
