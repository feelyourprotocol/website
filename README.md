# Feel Your Protocol

Interactive Ethereum protocol explorer — hands on.

Explore, visualize and understand Ethereum protocol changes (EIPs) by interacting with real library code running directly in the browser.

> **Status: Beta** — The project is fully functional, but the APIs of reusable components (E-Components, UI components) have not fully stabilized yet. Contributions are very welcome — expect some manual back-and-forth during review until the component interfaces settle.

## Quick Start

```bash
git clone https://github.com/feelyourprotocol/website.git
cd website
npm install
npm run dev
```

### OG images (optional, one-time)

Social preview cards for explorations/topics use Playwright in the isolated `og/` package. **Not required for `npm run dev`.** Once per machine:

```bash
npm run og:setup
npm run og:check
```

See [og/README.md](./og/README.md).

### Roadmap Twitter cards

Thread visuals (timeline, roadmap board, hero) — see [roadmap/social/README.md](./roadmap/social/README.md):

```bash
npm run capture:social
```

## Deployment

Production builds (`dist/website`, `dist/docs`, `dist/website-docs`, `dist/community-token`, `dist/roadmap`, `dist/mcp-docs`) are **not** in the repo — the server runs `npm run build:deploy` after `git pull`. See `server-config/deployment/fyp_deploy.sh`.

## Documentation

The **[docs hub](https://docs.feelyourprotocol.org)** is the entry point to all FYP documentation.

**Website docs** (contributor guide & architecture) live at **[website-docs.feelyourprotocol.org](https://website-docs.feelyourprotocol.org/index.html)**.

**MCP server docs** (concrete tool reference & technical setup) are at **[mcp-docs.feelyourprotocol.org](https://mcp-docs.feelyourprotocol.org)** — grows as the MCP server ships.

### Local dev

```bash
npm run docs:dev           # docs hub landing → http://localhost:5176
npm run website-docs:dev   # website contributor docs (VitePress)
npm run mcp-docs:dev       # MCP docs (VitePress)
npm run roadmap:dev        # roadmap (VitePress)
```

## Community Token Site

Guidelines and transparency page for the independently launched community token:

- **Production:** [community-token.feelyourprotocol.org](https://community-token.feelyourprotocol.org) (after deploy)
- **Local dev:** `npm run community-token:dev` → http://localhost:5174

See [community-token/README.md](./community-token/README.md) for content structure and deployment notes.

## Roadmap Site

Organizational home — vision, milestones, roadmap tracks, timeline, and core concept/infrastructure outlines:

- **Production:** [roadmap.feelyourprotocol.org](https://roadmap.feelyourprotocol.org) (after deploy)
- **Local dev:** `npm run roadmap:dev`

See [roadmap/README.md](./roadmap/README.md) for structure, the data-driven visualizations, and deployment notes.

## MCP Docs Site

Concrete reference for the Feel Your Protocol MCP server — tool docs and technical setup (present-tense, as capabilities ship):

- **Production:** [mcp-docs.feelyourprotocol.org](https://mcp-docs.feelyourprotocol.org) (after deploy)
- **Local dev:** `npm run mcp-docs:dev`

See [mcp-docs/README.md](./mcp-docs/README.md) for structure, the terminal-green skin, and deployment notes.

## Cross-site constants

Shared fleet URLs (roadmap origin, project X handle, etc.) live in [`src/libs/roadmapUrls.ts`](./src/libs/roadmapUrls.ts). **Project X is @FeelEthereum** — not `@feelyourprotocol` (domain name ≠ handle). VitePress configs duplicate the X URL with a comment pointing there.

## License

[MIT](LICENSE)
