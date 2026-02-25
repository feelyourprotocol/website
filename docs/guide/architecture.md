# Architecture

::: warning 🚧 Under Active Development
Both the Feel Your Protocol project and this documentation are in an early stage and under active development. Things may change frequently.
:::

## Overview

Feel Your Protocol is a Vue 3 application built with Vite. The core idea is simple: each Ethereum EIP gets its own route and interactive component that runs real library code in the browser.

## Tech Stack

- **[Vue 3](https://vuejs.org/)** with Composition API and `<script setup>`
- **[Vite](https://vite.dev/)** for development and production builds
- **[Tailwind CSS v4](https://tailwindcss.com/)** for styling
- **[Vue Router](https://router.vuejs.org/)** with route-level code splitting
- **[VitePress](https://vitepress.dev/)** for documentation
- **[Cypress](https://www.cypress.io/)** for E2E testing
- **[Heroicons](https://heroicons.com/)** for icons (`@heroicons/vue`)

The dancer images on the site are generated using [Midjourney](https://www.midjourney.com/).

## Content Structure

Content is organized around three taxonomies:

- **EIPs** — the core unit. Each EIP gets its own route and interactive widget.
- **Hardforks** (called `hardforks` in code) — group EIPs by network upgrade (e.g. "Fusaka"). Each EIP can optionally belong to a hardfork via `hardforkId`.
- **Topics** (called `topics` in code) — group EIPs by technical area (e.g. "Precompiles"). Each EIP can optionally belong to a topic via `topicId`.

All three are defined in `src/views/lib/structure.ts`. The router reads from this structure to automatically create routes — no manual route registration needed.

## Key Design Decisions

### One Component per EIP

Each EIP has:
- A **view** file (`src/views/eips/EIP{num}View.vue`) — thin wrapper that provides layout
- A **component** file (`src/components/eips/EIP{num}C.vue`) — the actual interactive widget

Only the component file imports EIP-specific library code. This ensures that Vite's code splitting keeps each EIP's dependencies in its own chunk — users only download the libraries needed for the page they visit.

### Route-Level Code Splitting

The router uses `import.meta.glob()` for lazy loading:

```typescript
const eipViews = import.meta.glob('../views/eips/*View.vue')
```

This means each route is a separate chunk that's loaded on demand.

### Library Forks

Some EIP widgets require custom forks of Ethereum libraries (see [Library Forks](./library-forks.md)). The architecture ensures that different forks of the same library can coexist without conflicts, each isolated to its specific EIP route.
