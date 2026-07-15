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

Content is organized around three taxonomies:

### Explorations

The core content unit. Each exploration represents an interactive widget for a protocol change — EIPs, ERCs, or research topics. Explorations live in `src/explorations/`, one folder per exploration:

```
src/explorations/eip-7883/
├── info.ts         # Metadata: id, title, path, topic, timeline, tags, poweredBy, …
├── MyC.vue         # The interactive widget
└── examples.ts     # Example presets for the widget
```

Each `info.ts` exports a `const INFO` object typed as `Exploration`. The `REGISTRY.ts` imports all `INFO` constants and assembles them into the `EXPLORATIONS` dictionary. The router reads from this dictionary to automatically create routes — no manual route registration needed.

### Topics

Topics are the high-level strategic pillars that group explorations by theme. Each exploration belongs to exactly one topic via the `topic` field in its `info.ts`. Topics are defined in `src/explorations/TOPICS.ts`.

**Topics are a static, curated set — they are not meant to be added as part of regular contributions.** The current topics are:

| ID                 | Title            | Description                                                            |
| ------------------ | ---------------- | ---------------------------------------------------------------------- |
| `scaling`          | Scaling          | Data availability, throughput, and L2 enablement                       |
| `privacy`          | Privacy          | ZK-proofs, homomorphic encryption, private mempools                    |
| `ux`               | UX               | Account abstraction, wallet infrastructure, signature schemes          |
| `security`         | Security         | Validator incentives, cryptographic agility, MEV mitigations           |
| `robustness`       | Robustness       | Gas cost accuracy, EVM semantics hardening, spec clarity               |
| `interoperability` | Interoperability | Cross-chain standards, bridge infrastructure, signature scheme support |

When adding an exploration, pick the topic that best reflects the primary concern of the protocol change.

### Timeline

Timeline is a taxonomy that combines two dimensions: how settled an idea is (from early mention to finalized spec) and where it sits relative to mainnet Ethereum (specific hardfork vs. general readiness stage). Each exploration belongs to exactly one timeline entry via the `timeline` field in its `info.ts`. Timeline entries are defined in `src/explorations/TIMELINE.ts`.

Hardfork entries are named after their Ethereum community event city of origin (e.g. "Fusaka" from Osaka, "Glamsterdam" from Amsterdam). The non-hardfork categories (Ready, Research, Ideas) are static. **New hardfork entries can be added as Ethereum's upgrade schedule evolves.**

### Tags

Tags enrich navigation by adding broader Ethereum technical concepts, protocol-relevant areas, or general technology topics from the blockchain space. Each exploration can have up to 3–4 tags. Tags are defined as a TypeScript enum in `src/explorations/TAGS.ts`.

**Tags grow with contributions** — unlike topics and timeline, new tags can be proposed when adding an exploration. They must follow these rules:

| Rule                                           | Example                                  |
| ---------------------------------------------- | ---------------------------------------- |
| Must be reusable beyond a single exploration   | `EVM` ✅ — `EIP-7883` ❌                 |
| Short form preferred                           | `EVM` ✅ — `Ethereum Virtual Machine` ❌ |
| No redundancy with existing tags               | `Gas Costs` exists → don't add `Gas`     |
| When in doubt, choose the more generic concept | `Gas Costs` ✅ — `Gas Increases` ❌      |

**Format:** Enum keys use CamelCase (`GasCosts`), all-caps for abbreviations (`EVM`). Members must be sorted alphabetically (enforced by lint).

## E-Components

**E-Components** are reusable Ethereum-specific components that encapsulate common exploration patterns. They live in `src/eComponents/` — one folder per pattern, with folder and component names post-fixed with `EC`.

Each E-Component packages a recurring kind of interactive widget: page chrome (`ExplorationC`), example selection, domain-specific inputs, and shared state in a composable. The exploration wires it up via a typed `config.ts`, passes in execution (a `run` callback, an EVM instance, …), and adds exploration-local UI through slots or companion components when the core API is not enough.

```
src/eComponents/<name>EC/
├── <Name>EC.vue          # Main entry point
├── types.ts              # Config interface
├── use<Name>.ts          # Composable: state and logic
└── …                     # Sub-components and utilities as needed
```

Examples in the codebase today include a **precompile testing interface** (`precompileInterfaceEC`) and a **bytecode stepper** (`bytecodeStepperEC`). More will follow as recurring patterns emerge — the set is meant to grow, not stay fixed on any one use case.

For a typical E-Component-backed exploration, `MyC.vue` stays short: config, library setup, one component tag, and optional slot content. See [E-Components](/contributing/e-components) for the integration model and [Available E-Components](/contributing/available-e-components) for per-component API reference.

## UI Components

Generic UI components live in `src/eComponents/ui/` alongside the E-Components they serve. These are reusable building blocks available for any exploration or E-Component:

| Component         | Purpose                                                  |
| ----------------- | -------------------------------------------------------- |
| `ExamplesUIC`     | Example selector dropdown                                |
| `HexDataInputUIC` | Hex data input textarea                                  |
| `ResultBoxUIC`    | Result display box with title, info text, and error text |
| `ActionButtonUIC` | Async action button with loading state and tooltip       |
| `ButtonUIC`       | Icon button with tooltip                                 |
| `TooltipUIC`      | CSS tooltip wrapper                                      |

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
- **`TopicView.vue`** dynamically lists all explorations belonging to a topic (or all explorations on the `/all` route), with URL query parameter filtering by `timeline` and `tag`
- **`HomeView.vue`** dynamically renders all active topics, a tag cloud, and a timeline navigation

### Route-Level Code Splitting

Each exploration is a separate chunk that is loaded on demand. Users only download the libraries needed for the page they visit. This is achieved via `import.meta.glob()` for lazy loading:

```typescript
const componentModules = import.meta.glob('../explorations/*/MyC.vue')
const ExplorationComponent = defineAsyncComponent(
  componentModules[`../explorations/${explorationId}/MyC.vue`],
)
```

### Testing Strategy

The project uses a hybrid testing approach:

- **Unit tests** (Vitest + Vue Test Utils) for component rendering, content verification, and UI logic — fast and focused
- **E2E tests** (Cypress) as lean smoke tests for critical navigation flows and page-level integration

Unit tests live alongside their components in `__tests__/` folders. E2E tests are consolidated in `cypress/e2e/`.

## Video pipeline (short-form)

Vertical exploration videos for YouTube Shorts, Reels, and X are recorded via an
isolated Playwright package in `video/` (same pattern as `og/` for social preview images).

- **Website overlay shell** — `src/video/`, activated with `?fyp-video=1`
- **Content & playbooks** — `video/projects/<id>/` (JSON, separate from the site)
- **Deep-linking** — `?example=<key>` pre-selects example presets on all explorations

See [Video pipeline](/contributing/video-pipeline) for the workflow and
[Authoring a video short](/contributing/video-authoring) for how to write a project.
