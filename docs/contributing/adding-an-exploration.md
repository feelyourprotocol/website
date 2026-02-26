# Adding an Exploration

::: warning Under Active Development
Both the Feel Your Protocol project and this documentation are in an early stage and under active development. Things may change frequently.
:::

## Overview

Each exploration lives in its own folder under `src/explorations/` with two files: `info.ts` (metadata) and `MyC.vue` (interactive widget). This guide walks you through adding a new one.

## Step 1: Create the Exploration Folder

Create a new folder in `src/explorations/` named after your exploration's ID. The ID should be lowercase and hyphen-separated (e.g. `eip-XXXX`, `erc-XXXX`, or any descriptive identifier):

```bash
mkdir src/explorations/eip-XXXX
```

## Step 2: Create `info.ts`

Create `src/explorations/eip-XXXX/info.ts` with your exploration's metadata:

```typescript
import type { Exploration } from '../REGISTRY'

export const INFO: Exploration = {
  id: 'eip-XXXX',
  path: '/eip-XXXX-short-description',
  title: 'Human-Readable Title',
  infoURL: 'https://eips.ethereum.org/EIPS/eip-XXXX',
  topics: ['fusaka'],
  image: 'fusaka.webp',
  introText:
    '<b>What does this change?</b> ' +
    'A brief introduction to the protocol change.',
  usageText:
    'Instructions on how to use the interactive widget below.',
  poweredBy: [
    { name: 'EthereumJS', href: 'https://github.com/ethereumjs/ethereumjs-monorepo' },
  ],
}
```

**Fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique identifier, matches the folder name |
| `path` | Yes | URL path for the exploration page |
| `title` | Yes | Display title |
| `infoURL` | Yes | Link to the specification or reference material |
| `topics` | No | Array of topic IDs this exploration belongs to |
| `image` | No | Image filename from `src/assets/` (e.g. `fusaka.webp`) |
| `introText` | No | HTML-formatted introduction paragraph |
| `usageText` | No | HTML-formatted usage instructions |
| `poweredBy` | No | Array of `{ name, href }` for library credits |

## Step 3: Create `MyC.vue`

Create `src/explorations/eip-XXXX/MyC.vue` with your interactive widget. Use `ExplorationC` as the wrapper component for consistent layout:

```vue
<script setup lang="ts">
import ExplorationC from '../ExplorationC.vue'
import PoweredByC from '../PoweredByC.vue'
import { INFO } from './info'

const exploration = INFO
const poweredBy = exploration.poweredBy ?? []
</script>

<template>
  <div>
    <ExplorationC :explorationId="exploration.id" :exploration="exploration">
      <template v-slot:content>
        <!-- Your interactive widget here -->
        <p>Widget content goes here.</p>
      </template>
    </ExplorationC>
    <PoweredByC :poweredBy="poweredBy" />
  </div>
</template>
```

The `ExplorationC` wrapper automatically renders the title, info link, intro text and usage text from your `info.ts`. You only need to provide the interactive content via the `content` slot.

For shared UI components (hex inputs, result displays, etc.), import from `../../components/ui/` and `../../components/precompiles/`. Browse existing explorations for examples.

## Step 4: Register in the Registry

Add one import line to `src/explorations/REGISTRY.ts`:

```typescript
import { INFO as eipXXXX } from './eip-XXXX/info'

export const EXPLORATIONS: Explorations = {
  // ... existing explorations
  [eipXXXX.id]: eipXXXX,
}
```

That's it for registration. The router reads from `EXPLORATIONS` and automatically creates the route — no manual route configuration needed.

## Step 5: Add Library Dependencies

If your widget needs an Ethereum library (or a custom fork), install it and import it only in your `MyC.vue` file:

```bash
npm install some-library
```

If you need a library fork, see the [Library Forks](../guide/library-forks.md) guide. Key rule: **only import fork-specific libraries in your `MyC.vue`**, never in shared code. This keeps each exploration's dependencies isolated via Vite's code splitting.

## Step 6: Add Tests

Add a Cypress E2E test in `cypress/e2e/` to verify basic widget functionality. Name it after your exploration ID (e.g. `eip-XXXX.cy.ts`).

## Step 7: Build and Verify

```bash
npm run build        # verify production build works
npm run test:e2e     # run E2E tests
```

## Quick Checklist

- [ ] Created `src/explorations/<id>/info.ts` with metadata
- [ ] Created `src/explorations/<id>/MyC.vue` with interactive widget
- [ ] Added import and entry in `src/explorations/REGISTRY.ts`
- [ ] Added library dependencies (if needed)
- [ ] Added E2E test
- [ ] Build passes (`npm run build`)
