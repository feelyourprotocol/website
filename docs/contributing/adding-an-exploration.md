# Adding an Exploration

Each exploration lives in its own folder under `src/explorations/` with a few files. This guide walks you through adding a new one.

## Quick Overview

An exploration folder looks like this:

```
src/explorations/eip-XXXX/
├── info.ts          # Metadata (required)
├── MyC.vue          # Interactive widget (required)
├── examples.ts      # Example presets (recommended)
├── tests.spec.ts    # Unit tests (required)
├── config.ts        # Precompile config (for precompile explorations)
└── data/            # Optional data files
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
import ExamplesUIC from '@/eComponents/ui/ExamplesUIC.vue'
import HexDataInputUIC from '@/eComponents/ui/HexDataInputUIC.vue'
import ResultBoxUIC from '@/eComponents/ui/resultBox/ResultBoxUIC.vue'
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
        <ExamplesUIC v-model="example" :examples="examples" :change="selectExample" />
        <HexDataInputUIC v-model="data" rows="6" :formChange="onDataInputFormChange" />
        <!-- Your result display here -->
        <PoweredByC :poweredBy="exploration.poweredBy" :topic="topic" />
      </div>
    </template>
  </ExplorationC>
</template>
```

The `ExplorationC` wrapper renders the title, info link, intro text, and usage text from your `info.ts`. You provide the interactive content via the `#content` slot.

### Option B: Precompile Interface E-Component

If your exploration is about a precompile, you can use the Precompile Interface E-Component. It handles all input management while you provide the execution logic and result display:

First, define your precompile config in a separate `config.ts` file (this keeps the config testable):

```typescript
// config.ts
import type { PrecompileConfig } from '@/eComponents/precompileInterfaceEC/types'

export const config: PrecompileConfig = {
  explorationId: 'eip-XXXX',
  defaultExample: 'basic',
  values: [
    { title: 'Input A', urlParam: 'a', expectedLen: 32n },
    { title: 'Input B', urlParam: 'b', expectedLen: 32n },
  ],
}
```

Then in `MyC.vue`:

```vue
<script setup lang="ts">
import { Hardfork } from '@ethereumjs/common'

import PrecompileInterfaceEC from '@/eComponents/precompileInterfaceEC/PrecompileInterfaceEC.vue'
import PrecompileInterfaceResultEC from '@/eComponents/precompileInterfaceEC/PrecompileInterfaceResultEC.vue'
import { useStandardPrecompileRun } from '@/eComponents/precompileInterfaceEC/run'

import { config } from './config'
import { examples } from './examples'
import { INFO as exploration } from './info'

const { run, execResultPre, execResultPost } = useStandardPrecompileRun(
  Hardfork.Prague, Hardfork.Osaka, '0a',
)
</script>

<template>
  <PrecompileInterfaceEC
    :config="config" :examples="examples" :exploration="exploration" :run="run"
  >
    <template #result>
      <div class="e-grid-double">
        <PrecompileInterfaceResultEC v-model="execResultPre" title="Pre-Osaka" :left="true" />
        <PrecompileInterfaceResultEC v-model="execResultPost" title="Post-Osaka" :left="false" />
      </div>
    </template>
  </PrecompileInterfaceEC>
</template>
```

The `useStandardPrecompileRun` helper covers the common EthereumJS pre/post hardfork comparison. For custom execution (different library, custom precompile, etc.), provide your own `run` function and `#result` slot — see [Available E-Components](/contributing/available-e-components) for the full API reference.

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

## Step 7: Add Tests

Each exploration should have a `tests.spec.ts` file in its folder. Tests verify that your exploration's metadata, examples, and config are correct.

### What to Test

**All explorations** should test:

- `info.ts` — correct `id`, `path`, `topic`, and `poweredBy`
- `examples.ts` — each example has the right number of values, valid hex data, and a non-empty title

**Precompile explorations** should additionally test:

- `config.ts` — `defaultExample` exists in examples, value field count and URL params match expectations
- `assembleData`/`parseData` — if defined, verify they produce correct output and are inverse operations

### Example: Custom Exploration Test

```typescript
import { describe, expect, it } from 'vitest'

import { examples } from '../examples'
import { INFO } from '../info'

describe('EIP-XXXX Exploration', () => {
  describe('info', () => {
    it('has correct metadata', () => {
      expect(INFO.id).toBe('eip-XXXX')
      expect(INFO.path).toContain('eip-XXXX')
      expect(INFO.topic).toBe('fusaka')
      expect(INFO.poweredBy.length).toBeGreaterThan(0)
    })
  })

  describe('examples', () => {
    it('each example has valid hex data', () => {
      const hexRegex = /^[0-9a-f]+$/i
      for (const [key, ex] of Object.entries(examples)) {
        for (const val of ex.values) {
          expect(val, `Value in "${key}" should be valid hex`).toMatch(hexRegex)
        }
      }
    })
  })
})
```

### Example: Precompile Exploration Test

```typescript
import { describe, expect, it } from 'vitest'

import { config } from '../config'
import { examples } from '../examples'
import { INFO } from '../info'

describe('EIP-XXXX Exploration', () => {
  describe('info', () => {
    it('has correct metadata', () => {
      expect(INFO.id).toBe('eip-XXXX')
      expect(INFO.topic).toBe('fusaka')
    })
  })

  describe('config', () => {
    it('references a valid default example', () => {
      expect(examples[config.defaultExample]).toBeDefined()
    })

    it('has correct number of value fields', () => {
      expect(config.values).toHaveLength(2)
    })
  })

  describe('examples', () => {
    it('each example has the right number of values', () => {
      const editableCount = config.values.filter((v) => v.urlParam).length
      for (const [key, ex] of Object.entries(examples)) {
        expect(ex.values, `Example "${key}"`).toHaveLength(editableCount)
      }
    })
  })
})
```

### Running Tests

```bash
npx vitest run                              # run all unit tests
npx vitest run src/explorations/eip-XXXX    # run tests for one exploration
```

## Step 8: Verify

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
- [ ] Created `src/explorations/<id>/tests.spec.ts` with unit tests
- [ ] Added import and entry in `src/explorations/REGISTRY.ts`
- [ ] Installed library dependencies (if needed)
- [ ] All unit tests pass
- [ ] Linting and type checking pass
- [ ] Production build succeeds
