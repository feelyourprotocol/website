# Getting Started

::: warning Under Active Development
Both the Feel Your Protocol project and this documentation are in an early stage and under active development. Things may change frequently.
:::

## What is Feel Your Protocol?

Feel Your Protocol is an interactive website that lets you explore Ethereum protocol changes hands on. Instead of just reading specifications, you can interact with real Ethereum library code running directly in the browser.

Each protocol change — called an **Exploration** — gets its own page with a dedicated interactive widget. For example, the [EIP-7883](https://feelyourprotocol.org/eip-7883-modexp-gas-cost-increase) page lets you experiment with ModExp gas cost changes interactively.

Explorations are grouped into **Topics** (e.g. "Fusaka" for the upcoming hardfork), making it easy to discover related protocol changes.

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

## Building

Build both the website and documentation:

```bash
npm run build          # website → dist/website
npm run docs:build     # docs → dist/docs
```

## Project Structure

```
website/
├── src/
│   ├── explorations/          # Explorations (the core content)
│   │   ├── REGISTRY.ts        # Exploration registry, types, helper functions
│   │   ├── TOPICS.ts          # Topic definitions and types
│   │   ├── ExplorationC.vue   # Shared exploration wrapper component
│   │   ├── PoweredByC.vue     # Shared "powered by" component
│   │   ├── eip-7594/          # One folder per exploration
│   │   │   ├── info.ts        #   Metadata (title, description, links, …)
│   │   │   └── MyC.vue        #   Interactive widget component
│   │   ├── eip-7883/
│   │   │   ├── info.ts
│   │   │   └── MyC.vue
│   │   └── eip-7951/
│   │       ├── info.ts
│   │       └── MyC.vue
│   ├── components/            # Shared UI and utility components
│   │   ├── ui/                # Generic UI components
│   │   ├── precompiles/       # Precompile-related shared components
│   │   └── lib/               # Shared logic and utilities
│   ├── views/                 # Route views
│   │   ├── HomeView.vue
│   │   ├── TopicView.vue
│   │   ├── ExplorationView.vue
│   │   └── TopicIntroView.vue
│   └── router/                # Vue Router config
├── docs/                      # Documentation (VitePress)
├── cypress/                   # E2E tests
└── dist/                      # Build output
    ├── website/
    └── docs/
```
