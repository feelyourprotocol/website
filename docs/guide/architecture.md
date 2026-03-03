# Architecture

## Overview

Feel Your Protocol is a Vue 3 application built with Vite. The core idea is simple: each Ethereum protocol change gets its own interactive widget that runs real library code in the browser.

## Tech Stack

- **[Vue 3](https://vuejs.org/)** with Composition API and `<script setup>`
- **[Vite](https://vite.dev/)** for development and production builds
- **[Tailwind CSS v4](https://tailwindcss.com/)** for styling
- **[Vue Router](https://router.vuejs.org/)** with route-level code splitting
- **[VitePress](https://vitepress.dev/)** for documentation
- **[Vitest](https://vitest.dev/)** + **[Vue Test Utils](https://test-utils.vuejs.org/)** for unit testing
- **[Cypress](https://www.cypress.io/)** for E2E testing
- **[Heroicons](https://heroicons.com/)** for icons (`@heroicons/vue`)

## Content Model

Content is organized around two concepts:

### Explorations

The core content unit. Each exploration represents an interactive widget for a protocol change — EIPs, ERCs, or research topics. Explorations live in `src/explorations/`, one folder per exploration:

```
src/explorations/eip-7883/
├── info.ts         # Metadata: id, title, path, topic, introText, poweredBy, …
├── MyC.vue         # The interactive widget
└── examples.ts     # Example presets for the widget
```

Each `info.ts` exports a `const INFO` object typed as `Exploration`. The `REGISTRY.ts` imports all `INFO` constants and assembles them into the `EXPLORATIONS` dictionary. The router reads from this dictionary to automatically create routes — no manual route registration needed.

### Topics

Topics group explorations by theme (e.g. "Fusaka" for an upcoming hardfork). Each exploration belongs to exactly one topic via the `topic` field in its `info.ts`. Topics are defined in `src/explorations/TOPICS.ts`.

## E-Components

**E-Components** are reusable Ethereum-specific components that encapsulate common patterns across explorations. They live in `src/eComponents/` and follow a naming convention: folder and component names are post-fixed with `EC`.

The first E-Component is `precompileInterfaceEC`, which provides a complete precompile exploration interface — input parsing, hardfork comparison, result display — as a single component backed by a composable:

```
src/eComponents/precompileInterfaceEC/
├── PrecompileInterfaceEC.vue      # Full-featured precompile exploration template
├── PrecompileInterfaceResultEC.vue # Result display (pre/post hardfork comparison)
├── PrecompileValueInputEC.vue     # Value input with byte length validation
├── usePrecompileState.ts          # Composable: all state and logic
├── types.ts                       # PrecompileConfig and PrecompileValueDef interfaces
└── run.ts                         # EVM precompile execution utility
```

Using the Precompile Interface E-Component, a precompile exploration widget can be as short as 30 lines — just a config object and a single component tag. See [Using E-Components](/contributing/e-components) for details.

## UI Components

Generic UI components live in `src/eComponents/ui/` alongside the E-Components they serve. These are reusable building blocks available for any exploration or E-Component:

| Component | Purpose |
|-----------|---------|
| `ExamplesUIC` | Example selector dropdown |
| `HexDataInputUIC` | Hex data input textarea |
| `ResultBoxUIC` | Result display box with title, info text, and error text |
| `ActionButtonUIC` | Async action button with loading state and tooltip |
| `ButtonUIC` | Icon button with tooltip |
| `TooltipUIC` | CSS tooltip wrapper |

Import them from `@/eComponents/ui/`:

```typescript
import ResultBoxUIC from '@/eComponents/ui/resultBox/ResultBoxUIC.vue'
import ExamplesUIC from '@/eComponents/ui/ExamplesUIC.vue'
```

## Key Design Decisions

### Folder-per-Exploration

Each exploration is fully self-contained in its own folder. This means:

- Contributors can focus on a single folder
- Adding a new exploration requires creating a folder and adding one import to `REGISTRY.ts`
- Each exploration's dependencies are isolated

### Dynamic Views

There are no static per-exploration or per-topic view files. Instead:

- **`ExplorationView.vue`** dynamically loads the correct `MyC.vue` using `import.meta.glob()` and `defineAsyncComponent()` based on the route name
- **`TopicView.vue`** dynamically lists all explorations belonging to a topic
- **`HomeView.vue`** dynamically renders all topics defined in `TOPICS.ts`

### Route-Level Code Splitting

Each exploration is a separate chunk that is loaded on demand. Users only download the libraries needed for the page they visit. This is achieved via `import.meta.glob()` for lazy loading:

```typescript
const componentModules = import.meta.glob('../explorations/*/MyC.vue')
const ExplorationComponent = defineAsyncComponent(
  componentModules[`../explorations/${explorationId}/MyC.vue`]
)
```

### Testing Strategy

The project uses a hybrid testing approach:

- **Unit tests** (Vitest + Vue Test Utils) for component rendering, content verification, and UI logic — fast and focused
- **E2E tests** (Cypress) as lean smoke tests for critical navigation flows and page-level integration

Unit tests live alongside their components in `__tests__/` folders. E2E tests are consolidated in `cypress/e2e/`.
