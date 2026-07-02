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

## Deployment

Production builds (`dist/website`, `dist/docs`, `dist/community-token`, `dist/roadmap`) are **not** in the repo — the server runs `npm run build:deploy` after `git pull`. See `server-config/deployment/fyp_deploy.sh`.

## Documentation

Full **website docs** (contributor guide & architecture) are at **[docs.feelyourprotocol.org](https://docs.feelyourprotocol.org/index.html)**. API docs will follow on a separate subdomain.

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

## Cross-site constants

Shared fleet URLs (roadmap origin, project X handle, etc.) live in [`src/libs/roadmapUrls.ts`](./src/libs/roadmapUrls.ts). **Project X is @FeelEthereum** — not `@feelyourprotocol` (domain name ≠ handle). VitePress configs duplicate the X URL with a comment pointing there.

## License

[MIT](LICENSE)
