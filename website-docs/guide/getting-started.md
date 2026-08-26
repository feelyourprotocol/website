# Getting Started

## What is Feel Your Protocol?

Feel Your Protocol is an interactive website that lets you explore Ethereum protocol changes hands on. Instead of just reading specifications, you can interact with real Ethereum library code running directly in the browser.

Each protocol change — called an **Exploration** — gets its own page with a dedicated interactive widget. Explorations cover EIPs, ERCs, and protocol research. They are organized through three taxonomies: **Topics** (static strategic pillars like "Scaling" or "UX"), **Timeline** (maturity and hardfork placement like "Fusaka" or "Research"), and **Tags** (reusable technical concepts like "EVM" or "Precompiles") — making it easy to discover and navigate related protocol changes.

Broader project direction (Phase 3 API, MCP server) lives on the public [roadmap site](https://roadmap.feelyourprotocol.org/index.html). **This documentation covers only the explorations website** — how it is built and how to add or change explorations.

## Prerequisites

- [Node.js](https://nodejs.org/) v20.19+ or v22.12+
- npm (comes with Node.js)

## Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/feelyourprotocol/website.git
cd website
npm install
```

## Development

Start the explorations website dev server:

```bash
npm run dev
```

To edit **these** contributor docs locally:

```bash
npm run website-docs:dev
```

Other sites in this repo (docs hub, MCP docs, roadmap, community token) have their own READMEs with dev commands. See [Repo layout](#repo-layout-sibling-sites) below.

## Quality Checks

```bash
npm run lf           # format + lint (auto-fix)
npm run lf:ci        # lint + format check (CI mode, no auto-fix)
npm run type-check   # TypeScript type checking (vue-tsc)
```

## Testing

```bash
npx vitest run       # unit tests (single run)
npm run test:unit    # unit tests (watch mode)
npm run test:e2e     # E2E tests (Cypress, requires build first)
```

## Building

```bash
npm run website:build          # dist/website (explorations site)
npm run website-docs:build     # dist/website-docs (this documentation)
```

Production deploy rebuilds every site target from the repo root (`npm run build:deploy`). That full matrix is documented in the root [README.md](https://github.com/feelyourprotocol/website/blob/main/README.md) for maintainers — not repeated here.

`dist/` is not committed — production output is rebuilt on deploy.

## Project Structure

```
website/
├── src/
│   ├── explorations/              # Explorations (the core content)
│   │   ├── REGISTRY.ts            # Exploration registry and types
│   │   ├── TOPICS.ts              # Topic definitions and colors
│   │   ├── TIMELINE.ts            # Timeline taxonomy (hardforks + maturity stages)
│   │   ├── TAGS.ts                # Tag enum (technical concepts)
│   │   ├── ExplorationC.vue       # Shared exploration wrapper component
│   │   ├── PoweredByC.vue         # Shared creator + "powered by" component
│   │   ├── NoExplorationsC.vue    # Empty state component
│   │   ├── eip-7594/              # One folder per exploration
│   │   │   ├── info.ts            #   Metadata (title, topic, timeline, tags, …)
│   │   │   ├── MyC.vue            #   Interactive widget component
│   │   │   ├── examples.ts        #   Example presets
│   │   │   └── data/              #   Optional data files
│   │   ├── eip-7883/
│   │   └── eip-7951/
│   ├── eComponents/               # Reusable Ethereum-specific components (E-Components)
│   │   ├── ui/                    # Generic UI components (UIC)
│   │   └── precompileInterfaceEC/ # Precompile interface E-Component
│   │       ├── PrecompileInterfaceEC.vue
│   │       ├── PrecompileInterfaceResultEC.vue
│   │       ├── PrecompileValueInputEC.vue
│   │       ├── usePrecompileState.ts
│   │       ├── types.ts
│   │       └── run.ts
│   ├── libs/                      # Shared computation logic
│   │   └── tagCloud.ts            # Tag cloud weight computation
│   ├── views/                     # Route views
│   │   ├── HomeView.vue
│   │   ├── TopicView.vue          # Topic + /all view with filtering
│   │   ├── ExplorationView.vue
│   │   ├── TimelineNaviView.vue   # Timeline navigation component
│   │   ├── TagCloudView.vue       # Tag cloud navigation component
│   │   └── __tests__/             # Unit tests
│   └── router/                    # Vue Router config
├── website-docs/                  # This site — explorations contributor docs (VitePress)
├── cypress/                       # E2E tests
└── .github/workflows/             # CI workflows
```

### Repo layout (sibling sites)

The same git repository also builds other Feel Your Protocol sites (docs hub, MCP docs, roadmap, community token) for deployment convenience. **Their development documentation lives only in each folder's README** — not in website-docs:

| Folder | README |
| --- | --- |
| `docs-hub/` | [docs-hub/README.md](https://github.com/feelyourprotocol/website/blob/main/docs-hub/README.md) |
| `mcp-docs/` | [mcp-docs/README.md](https://github.com/feelyourprotocol/website/blob/main/mcp-docs/README.md) |
| `roadmap/` | [roadmap/README.md](https://github.com/feelyourprotocol/website/blob/main/roadmap/README.md) |
| `community-token/` | [community-token/README.md](https://github.com/feelyourprotocol/website/blob/main/community-token/README.md) |

Agents and contributors working on explorations should stay under `src/` and `website-docs/` unless explicitly tasked with another site.
