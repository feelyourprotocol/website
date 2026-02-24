# Getting Started

::: warning 🚧 Under Active Development
Both the Feel Your Protocol project and this documentation are in an early stage and under active development. Things may change frequently.
:::

## What is Feel Your Protocol?

Feel Your Protocol is an interactive website that lets you explore Ethereum protocol changes (EIPs) hands on. Instead of just reading specifications, you can interact with real Ethereum library code running directly in the browser.

Each EIP gets its own page with a dedicated widget. For example, the [EIP-7883](https://feelyourprotocol.org/eip-7883-modexp-gas-cost-increase) page lets you experiment with ModExp gas cost changes interactively.

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
├── src/                    # Website source (Vue + Vite)
│   ├── components/
│   │   ├── eips/           # Per-EIP interactive components
│   │   ├── ui/             # Shared UI components
│   │   └── lib/            # Shared logic and utilities
│   ├── views/              # Route views
│   └── router/             # Vue Router config
├── docs/                   # Documentation (VitePress)
│   ├── .vitepress/         # VitePress config
│   ├── guide/              # Guide pages
│   └── contributing/       # Contributing pages
├── dist/
│   ├── website/            # Built website output
│   └── docs/               # Built docs output
└── cypress/                # E2E tests
```
