# Architecture

::: warning Under Active Development
Both the Feel Your Protocol project and this documentation are in an early stage and under active development. Things may change frequently.
:::

## Overview

Feel Your Protocol is a Vue 3 application built with Vite. The core idea is simple: each Ethereum protocol change gets its own interactive widget that runs real library code in the browser.

## Tech Stack

- **[Vue 3](https://vuejs.org/)** with Composition API and `<script setup>`
- **[Vite](https://vite.dev/)** for development and production builds
- **[Tailwind CSS v4](https://tailwindcss.com/)** for styling
- **[Vue Router](https://router.vuejs.org/)** with route-level code splitting
- **[VitePress](https://vitepress.dev/)** for documentation
- **[Cypress](https://www.cypress.io/)** for E2E testing
- **[Heroicons](https://heroicons.com/)** for icons (`@heroicons/vue`)

## Content Structure

Content is organized around two concepts:

- **Explorations** — the core unit. Each exploration represents an interactive widget for a protocol change (EIP, ERC, or other research topic). Explorations live in `src/explorations/`.
- **Topics** — group explorations by theme (e.g. "Fusaka" for an upcoming hardfork). Each exploration can belong to zero or more topics via the `topics` array. Topics are defined in `src/explorations/TOPICS.ts`.

### The `src/explorations/` Folder

This is the heart of the project. Each exploration is a self-contained folder:

```
src/explorations/
├── REGISTRY.ts            # Assembles all explorations, exports EXPLORATIONS dict
├── TOPICS.ts              # Topic definitions
├── ExplorationC.vue       # Shared wrapper component (title, description, buttons)
├── PoweredByC.vue         # Shared "powered by" footer
├── eip-7594/
│   ├── info.ts            # Metadata: id, title, path, infoURL, introText, usageText, …
│   └── MyC.vue            # The interactive widget
├── eip-7883/
│   ├── info.ts
│   └── MyC.vue
└── eip-7951/
    ├── info.ts
    └── MyC.vue
```

Each `info.ts` exports a `const INFO` object typed as `Exploration`. The `REGISTRY.ts` imports all `INFO` constants and assembles them into the `EXPLORATIONS` dictionary. The router reads from this to automatically create routes — no manual route registration needed.

### Exploration Metadata (`info.ts`)

Each exploration's `info.ts` contains all its metadata as a flat object:

```typescript
import type { Exploration } from '../REGISTRY'

export const INFO: Exploration = {
  id: 'eip-XXXX',
  path: '/eip-XXXX-short-description',
  title: 'Human-Readable Title',
  infoURL: 'https://eips.ethereum.org/EIPS/eip-XXXX',
  topics: ['fusaka'],
  image: 'fusaka.webp',
  introText: 'HTML-formatted introduction.',
  usageText: 'HTML-formatted usage instructions.',
  poweredBy: [
    { name: 'Library Name', href: 'https://github.com/...' },
  ],
}
```

## Key Design Decisions

### Folder-per-Exploration

Each exploration is fully self-contained in its own folder with `info.ts` (metadata) and `MyC.vue` (widget). This means:

- Contributors can focus on a single folder
- Adding a new exploration is a matter of creating a folder and adding one import to `REGISTRY.ts`
- Each exploration's dependencies are isolated

### Dynamic Views

There are no static per-exploration or per-topic view files. Instead:

- **`ExplorationView.vue`** dynamically loads the correct `MyC.vue` using `import.meta.glob()` and `defineAsyncComponent()` based on the route name
- **`TopicView.vue`** dynamically lists all explorations belonging to a topic

This keeps the views lean and avoids boilerplate when adding new content.

### Route-Level Code Splitting

The `ExplorationView.vue` uses `import.meta.glob()` for lazy loading:

```typescript
const componentModules = import.meta.glob('../explorations/*/MyC.vue')
const ExplorationComponent = defineAsyncComponent(
  componentModules[`../explorations/${explorationId}/MyC.vue`]
)
```

Each exploration is a separate chunk that's loaded on demand. Users only download the libraries needed for the page they visit.

### Library Forks

Some exploration widgets require custom forks of Ethereum libraries (see [Library Forks](./library-forks.md)). The architecture ensures that different forks of the same library can coexist without conflicts, each isolated to its specific exploration route.
