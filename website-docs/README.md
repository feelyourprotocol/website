# Website Docs

VitePress site for **website-docs.feelyourprotocol.org** — contributor and agent guide for the Feel Your Protocol **explorations website** (E-Components, explorations, styling, video pipeline).

**Scope:** this folder documents only `src/` and related website tooling. Other deployed sites in the monorepo (docs hub, MCP docs, roadmap, community token) keep dev notes in their own READMEs. See [`.cursor/rules/repo-structure.mdc`](../.cursor/rules/repo-structure.mdc) and [AGENTS.md](../AGENTS.md).

The **[docs hub](https://docs.feelyourprotocol.org)** at `docs.feelyourprotocol.org` is the fleet entrypoint; this site is the deep documentation for the explorations website.

## Local dev

```bash
npm run website-docs:dev    # http://localhost:5173 (VitePress default)
npm run website-docs:build
npm run website-docs:preview
```

## Production

- **URL:** [website-docs.feelyourprotocol.org](https://website-docs.feelyourprotocol.org)
- **Output:** `dist/website-docs/` (rebuilt on deploy via `npm run build:deploy`; `dist/` is not in git)
- **Legacy SEO:** indexed URLs under `docs.feelyourprotocol.org/*` (except the hub landing) permanently redirect here with the same path

## Structure

```
website-docs/
├── .vitepress/          # Theme, config, custom CSS (cyan "Builder's Workshop" skin)
├── guide/               # Getting started, architecture, changelog
├── contributing/        # Explorations, E-Components, video, conventions, AI workflow
├── special-actions/     # One-off operational write-ups (website-related)
└── public/              # llms.txt, robots.txt, OG assets, fonts
```

## Cross-links

Nav links to the docs hub, MCP docs, roadmap, and main website for discovery. Fleet URL constants used by the explorations site live in [`src/libs/docsUrls.ts`](../src/libs/docsUrls.ts) and [`src/libs/roadmapUrls.ts`](../src/libs/roadmapUrls.ts). Dev documentation for those other sites is **not** duplicated here.
