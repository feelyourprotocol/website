# Adding an Exploration

Each exploration lives in its own folder under `src/explorations/` with a few files. This guide walks you through adding a new one.

## Quick Overview

An exploration folder looks like this:

```
src/explorations/eip-XXXX/
├── info.ts         # Metadata (required)
├── MyC.vue         # Interactive widget (required)
├── examples.ts     # Example presets (recommended)
└── data/           # Optional data files
```

## Step 1: Create the Folder

Create a new folder in `src/explorations/` named after your exploration's ID. Use lowercase, hyphen-separated names:

```bash
mkdir src/explorations/eip-XXXX
```

The ID can be `eip-XXXX`, `erc-XXXX`, or any descriptive identifier for research topics.

## Step 2: Create `info.ts`

This file defines all the metadata for your exploration:

```typescript
import type { Exploration } from '@/explorations/REGISTRY'

export const INFO: Exploration = {
  id: 'eip-XXXX',
  path: '/eip-XXXX-short-description',
  title: 'Human-Readable Title',
  infoURL: 'https://eips.ethereum.org/EIPS/eip-XXXX',
  topic: 'fusaka',
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

### Field Reference

| Field | Required | Description |
|-------|----------|-------------|
| `id` | Yes | Unique identifier, matches the folder name |
| `path` | Yes | URL path for the exploration page |
| `title` | Yes | Display title |
| `infoURL` | Yes | Link to the specification or reference material |
| `topic` | Yes | Topic ID this exploration belongs to (e.g. `'fusaka'`) |
| `image` | No | Imported image for topic overview display |
| `introText` | No | HTML-formatted introduction paragraph |
| `usageText` | No | HTML-formatted usage instructions |
| `poweredBy` | Yes | Array of `{ name, href }` for library credits |

## Step 3: Create `examples.ts`

Define example presets that users can select from a dropdown:

```typescript
import type { Examples } from '@/components/lib/general'

export const examples: Examples = {
  basic: {
    title: 'Basic Example',
    values: ['deadbeef'],
  },
  advanced: {
    title: 'Advanced Example',
    values: ['cafebabe', '0102030405'],
  },
}
```

Each example has a `title` (displayed in the dropdown) and a `values` array (the preset input values).

## Step 4: Create `MyC.vue`

This is your interactive widget. The approach depends on what you are building.

### Option A: Custom Widget

For explorations with unique behavior, build the widget from scratch using shared UI components:

```vue
<script setup lang="ts">
import { ref } from 'vue'

import { PP_BOX_LAYOUT } from '@/components/lib/layout'
import ExamplesC from '@/eComponents/ui/ExamplesC.vue'
import HexDataInputC from '@/eComponents/ui/HexDataInputC.vue'
import ResultBoxC from '@/eComponents/ui/resultBox/ResultBoxC.vue'
import ExplorationC from '@/explorations/ExplorationC.vue'
import PoweredByC from '@/explorations/PoweredByC.vue'
import { TOPICS } from '@/explorations/TOPICS'

import { examples } from './examples'
import { INFO as exploration } from './info'

const topic = TOPICS[exploration.topic]
const data = ref('')
const example = ref('')

async function selectExample() {
  if (example.value === '') return
  data.value = examples[example.value]!.values[0]
}

async function onDataInputFormChange() {
  example.value = ''
}

async function init() {
  example.value = 'basic'
  await selectExample()
}

await init()
</script>

<template>
  <ExplorationC explorationId="eip-XXXX" :exploration="exploration" :topic="topic">
    <template #content>
      <div>
        <ExamplesC v-model="example" :examples="examples" :change="selectExample" />
        <HexDataInputC v-model="data" rows="6" :formChange="onDataInputFormChange" />
        <!-- Your result display here -->
        <PoweredByC :poweredBy="exploration.poweredBy" :topic="topic" />
      </div>
    </template>
  </ExplorationC>
</template>
```

The `ExplorationC` wrapper renders the title, info link, intro text, and usage text from your `info.ts`. You provide the interactive content via the `#content` slot.

### Option B: Precompile Interface E-Component

If your exploration is about a precompile, you can use the Precompile Interface E-Component and get a full-featured widget in ~30 lines:

```vue
<script setup lang="ts">
import { Hardfork } from '@ethereumjs/common'

import PrecompileInterfaceEC from '@/eComponents/precompileInterfaceEC/PrecompileInterfaceEC.vue'
import type { PrecompileConfig } from '@/eComponents/precompileInterfaceEC/types'

import { examples } from './examples'
import { INFO as exploration } from './info'

const config: PrecompileConfig = {
  explorationId: 'eip-XXXX',
  precompileAddress: '0a',
  preHardfork: Hardfork.Prague,
  postHardfork: Hardfork.Osaka,
  defaultExample: 'basic',
  values: [
    { title: 'Input A', urlParam: 'a', expectedLen: 32n },
    { title: 'Input B', urlParam: 'b', expectedLen: 32n },
  ],
}
</script>

<template>
  <PrecompileInterfaceEC :config="config" :examples="examples" :exploration="exploration" />
</template>
```

See [Using E-Components](/contributing/e-components) for the full API reference.

## Step 5: Register in the Registry

Add one import line to `src/explorations/REGISTRY.ts`:

```typescript
import { INFO as eipXXXX } from './eip-XXXX/info'

export const EXPLORATIONS: Explorations = {
  // ... existing explorations
  [eipXXXX.id]: eipXXXX,
}
```

The router reads from `EXPLORATIONS` and automatically creates the route — no manual route configuration needed.

## Step 6: Install Dependencies

If your widget needs additional libraries, install them:

```bash
npm install some-library
```

Import libraries only in your `MyC.vue` — never in shared code. This keeps each exploration's dependencies isolated via Vite's code splitting.

If you need a custom library fork (e.g. with experimental features), see [Library Forks](/contributing/library-forks).

## Step 7: Verify

```bash
npm run dev          # check your exploration locally
npm run lf           # format + lint
npm run type-check   # TypeScript check
npm run build        # verify production build
```

## Checklist

- [ ] Created `src/explorations/<id>/info.ts` with metadata
- [ ] Created `src/explorations/<id>/MyC.vue` with interactive widget
- [ ] Created `src/explorations/<id>/examples.ts` with example presets
- [ ] Added import and entry in `src/explorations/REGISTRY.ts`
- [ ] Installed library dependencies (if needed)
- [ ] Linting and type checking pass
- [ ] Production build succeeds
