# Getting Started

## What is Feel Your Protocol?

Feel Your Protocol is an interactive website that lets you explore Ethereum protocol changes hands on. Instead of just reading specifications, you can interact with real Ethereum library code running directly in the browser.

Each protocol change — called an **Exploration** — gets its own page with a dedicated interactive widget. Explorations cover EIPs, ERCs, and protocol research. They are grouped into **Topics** — high-level strategic pillars like "Scaling" or "UX" — making it easy to discover related protocol changes.

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

Start the docs dev server:

```bash
npm run docs:dev
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
npm run build          # website → dist/website
npm run docs:build     # docs → dist/docs
```

## Project Structure

```
website/
├── src/
│   ├── explorations/              # Explorations (the core content)
│   │   ├── REGISTRY.ts            # Exploration registry and types
│   │   ├── TOPICS.ts              # Topic definitions and types
│   │   ├── ExplorationC.vue       # Shared exploration wrapper component
│   │   ├── PoweredByC.vue         # Shared "powered by" component
│   │   ├── eip-7594/              # One folder per exploration
│   │   │   ├── info.ts            #   Metadata (title, description, links, …)
│   │   │   ├── MyC.vue            #   Interactive widget component
│   │   │   ├── examples.ts        #   Example presets
│   │   │   └── data/              #   Optional data files
│   │   ├── eip-7883/
│   │   └── eip-7951/
│   ├── eComponents/               # Reusable Ethereum-specific components (E-Components)
│   │   └── precompileInterfaceEC/ # Precompile interface E-Component
│   │       ├── PrecompileInterfaceEC.vue
│   │       ├── PrecompileInterfaceResultEC.vue
│   │       ├── PrecompileValueInputEC.vue
│   │       ├── usePrecompileState.ts
│   │       ├── types.ts
│   │       └── run.ts
│   ├── components/                # Shared UI components and utilities
│   │   ├── ui/                    # Generic UI components
│   │   └── lib/                   # Shared logic and utilities
│   ├── views/                     # Route views
│   │   ├── HomeView.vue
│   │   ├── TopicView.vue
│   │   ├── ExplorationView.vue
│   │   └── __tests__/             # Unit tests
│   └── router/                    # Vue Router config
├── docs/                          # Documentation (VitePress)
├── cypress/                       # E2E tests
└── .github/workflows/             # CI workflows
```
