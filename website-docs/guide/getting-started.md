# Getting Started

## What is Feel Your Protocol?

Interactive explorations of Ethereum protocol changes — real library code in the browser. Each **Exploration** is a folder with metadata and a widget, organized by **Topics**, **Timeline**, and **Tags**.

New explorations are typically **agent-scaffolded**; these docs teach you how to brief and review that work. See [Building overview](/building/overview).

**Scope:** this site documents only the explorations website. Roadmap, MCP, and sibling sites have their own READMEs.

## Prerequisites

Node.js v20.19+ or v22.12+, npm.

## Setup

```bash
git clone https://github.com/feelyourprotocol/website.git
cd website
npm install
npm run dev                 # explorations site
npm run website-docs:dev    # this documentation
```

## Quality checks

```bash
npm run lf:ci          # format + lint (CI)
npm run type-check
npx vitest run         # unit tests
```

E2E smoke: `npm run test:e2e` (needs build). Agent finish gates: `.cursor/rules/quality.mdc` and `testing.mdc`.

## Build

```bash
npm run website:build
npm run website-docs:build
```

Full deploy matrix: root [README.md](https://github.com/feelyourprotocol/website/blob/main/README.md).

## Sibling sites

| Folder | Dev docs |
| --- | --- |
| `docs-hub/` | [README](https://github.com/feelyourprotocol/website/blob/main/docs-hub/README.md) |
| `mcp-docs/` | [README](https://github.com/feelyourprotocol/website/blob/main/mcp-docs/README.md) |
| `roadmap/` | [README](https://github.com/feelyourprotocol/website/blob/main/roadmap/README.md) |
| `community-token/` | [README](https://github.com/feelyourprotocol/website/blob/main/community-token/README.md) |

Stay under `src/` and `website-docs/` unless explicitly working on another site.
