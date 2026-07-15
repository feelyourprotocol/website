# Getting Started

## What is Feel Your Protocol?

Feel Your Protocol is an interactive website that lets you explore Ethereum protocol changes hands on. Instead of just reading specifications, you can interact with real Ethereum library code running directly in the browser.

Each protocol change — called an **Exploration** — gets its own page with a dedicated interactive widget. Explorations cover EIPs, ERCs, and protocol research. They are organized through three taxonomies: **Topics** (static strategic pillars like "Scaling" or "UX"), **Timeline** (maturity and hardfork placement like "Fusaka" or "Research"), and **Tags** (reusable technical concepts like "EVM" or "Precompiles") — making it easy to discover and navigate related protocol changes.

**Phase 3** is taking shape on the [roadmap site](https://roadmap.feelyourprotocol.org/index.html): a deterministic API and MCP server for the future Ethereum protocol — upcoming forks, EIPs, and research — with the explorations website as its front door. Nothing there is shipped yet — it is a living conceptualization workspace.

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

Start the website dev server:

```bash
npm run dev
```

Start the docs hub dev server:

```bash
npm run docs:dev
```

Start the website docs dev server:

```bash
npm run website-docs:dev
```

Start the roadmap dev server:

```bash
npm run roadmap:dev
```

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
npm run build          # all five, with website type-check
npm run build:deploy   # all five (website vite-only; used on the server after git pull)

# Individual targets:
npm run website:build           # dist/website
npm run community-token:build   # dist/community-token
npm run docs:build              # dist/docs (docs hub landing)
npm run website-docs:build      # dist/website-docs
npm run roadmap:build           # dist/roadmap
npm run mcp-docs:build          # dist/mcp-docs
```

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
├── website-docs/                  # Website contributor docs (VitePress)
├── docs-hub/                      # Docs fleet landing page (static, Vite)
├── roadmap/                       # Roadmap site (VitePress)
├── mcp-docs/                      # MCP server docs (VitePress)
├── community-token/               # Community token transparency site
├── cypress/                       # E2E tests
└── .github/workflows/             # CI workflows
```
