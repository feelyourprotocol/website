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
├── config.ts        # E-Component config (when using an E-Component)
├── *.vue            # Optional companion components
├── *.ts             # Optional helpers (builders, domain logic)
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
import { Tag } from '@/explorations/TAGS'

export const INFO: Exploration = {
  id: 'eip-XXXX',
  path: '/eip-XXXX-short-description',
  title: 'Human-Readable Title',
  seoDescription:
    'Interactive Ethereum explainer for EIP-XXXX — plain-language summary with key search terms and what the widget demonstrates.',
  infoURL: 'https://eips.ethereum.org/EIPS/eip-XXXX',
  topic: 'scaling',
  timeline: 'fusaka',
  tags: [Tag.EVM, Tag.GasCosts],
  creatorName: 'YourName',
  creatorURL: 'https://x.com/YourHandle',
  introText: '<b>What does this change?</b> ' + 'A brief introduction to the protocol change.',
  usageText: 'Instructions on how to use the interactive widget below.',
  poweredBy: [{ name: 'EthereumJS', href: 'https://github.com/ethereumjs/ethereumjs-monorepo' }],
}
```

### Field Reference

| Field         | Required | Description                                                                                                                                                                                                                                                         |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`          | Yes      | Unique identifier, matches the folder name                                                                                                                                                                                                                          |
| `path`        | Yes      | URL path for the exploration page                                                                                                                                                                                                                                   |
| `title`       | Yes      | Display title                                                                                                                                                                                                                                                       |
| `seoDescription` | Recommended | Plain-text discovery copy (~120–160 chars) for search engines and static prerender. See [Discovery & SEO](#discovery--seo) below. |
| `infoURL`     | Yes      | Link to the specification or reference material                                                                                                                                                                                                                     |
| `topic`       | Yes      | Topic ID this exploration belongs to. Must be one of the fixed set: `scaling`, `privacy`, `ux`, `security`, `robustness`, `interoperability`. Topics are static and not added via contributions — see [Architecture](/guide/architecture#topics) for the full list. |
| `timeline`    | Yes      | Timeline ID for this exploration (e.g. `fusaka`, `glamsterdam`, `ready`, `research`, `ideas`). See [Architecture](/guide/architecture) for details.                                                                                                                 |
| `tags`        | Yes      | Array of `Tag` enum values (max 3–4). Tags are broader technical concepts that must be reusable across explorations. New tags can be proposed — see [Architecture](/guide/architecture#tags) for rules and the current list.                                        |
| `image`       | No       | Imported image for topic overview display — see [Images](/contributing/images) for format, palette, and style guidance                                                                                                                                              |
| `introText`   | No       | HTML-formatted introduction paragraph                                                                                                                                                                                                                               |
| `usageText`   | No       | HTML-formatted usage instructions                                                                                                                                                                                                                                   |
| `creatorName` | No       | Display name of the exploration's creator                                                                                                                                                                                                                           |
| `creatorURL`  | No       | URL to the creator's profile (X/Twitter, GitHub, etc.)                                                                                                                                                                                                              |
| `poweredBy`   | Yes      | Array of `{ name, href }` for library credits                                                                                                                                                                                                                       |

## Discovery & SEO

Feel Your Protocol targets people who heard about an Ethereum protocol change and want to **understand how it behaves** — not generic “what is Ethereum” queries. Discovery copy should match how they search: EIP numbers, acronyms, mechanism names, and “interactive explainer” intent.

### `seoDescription`

Add one plain-text sentence in `info.ts` (~120–160 characters, no HTML). It powers the page meta description, JSON-LD, and the static prerender paragraph crawlers see before JavaScript runs.

**Write for discovery, not the widget UI.** Keep `introText` as the pedagogical question on the page; use `seoDescription` for search-friendly terms.

Good example (EIP-8024):

```
Interactive EVM explainer for EIP-8024 DUPN, SWAPN, and EXCHANGE stack opcodes — step through deep stack access in an Amsterdam-fork EVM in your browser.
```

Include where natural:

- **EIP/ERC number** and plain-language name
- **Synonyms and acronyms** people search for (BAL, PeerDAS, ModExp, secp256r1)
- **“Interactive”** or **“explainer”** — FYP’s differentiator

If omitted, a generic fallback is generated from the title; prefer writing `seoDescription` explicitly.

### Other fields that help discovery

| Field | Role |
| ----- | ---- |
| `path` | Keyword-rich slug (`/eip-8024-stack-opcodes-dupn-swapn-exchange`) |
| `title` | EIP number plus human-readable terms |
| `tags` | Reusable concepts (EVM, BAL, PeerDAS) for future category pages |
| `infoURL` | Canonical spec link (used in structured data) |

Topic pages use their `introText` with an “Ethereum {topic}” document title — explorations inherit topic context via breadcrumbs.

## Step 3: Create `examples.ts`

Define example presets that users can select from a dropdown:

```typescript
import type { Examples } from '@/explorations/REGISTRY'

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

This is your interactive widget. Start by choosing a **building block**:

| Approach          | When to use                                                                      | Docs                                                           |
| ----------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **E-Component**   | An existing E-Component matches your use case (precompile, bytecode stepping, …) | [Available E-Components](/contributing/available-e-components) |
| **Custom widget** | Unique behavior not covered by any E-Component                                   | Option A below                                                 |

Check [Available E-Components](/contributing/available-e-components) first — most explorations can be built by wiring a config, examples, and execution logic, often in under 30 lines.

One primary E-Component per exploration is the supported path today. See [Composing E-Components](/contributing/e-components#composing-e-components) for the longer-term direction.

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
        <PoweredByC
          :poweredBy="exploration.poweredBy"
          :creatorName="exploration.creatorName"
          :creatorURL="exploration.creatorURL"
        />
      </div>
    </template>
  </ExplorationC>
</template>
```

The `ExplorationC` wrapper renders the title, info link, intro text, and usage text from your `info.ts`. You provide the interactive content via the `#content` slot.

### Option B: E-Component

When an existing E-Component fits, your `MyC.vue` wires config, examples, exploration metadata, and execution. Define the config in a separate `config.ts` file — this keeps it testable and separate from library setup.

#### Precompile explorations

If your exploration is about a precompile, use the Precompile Interface E-Component. It handles input management while you provide execution and result display:

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
  Hardfork.Prague,
  Hardfork.Osaka,
  '0a',
)
</script>

<template>
  <PrecompileInterfaceEC
    :config="config"
    :examples="examples"
    :exploration="exploration"
    :run="run"
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

The `useStandardPrecompileRun` helper covers the common EthereumJS pre/post hardfork comparison. For custom execution, provide your own `run` function and `#result` slot.

**Reference:** [EIP-7951](https://github.com/feelyourprotocol/website/blob/main/src/explorations/eip-7951/MyC.vue)

#### Bytecode / opcode explorations

For explorations that step through raw EVM bytecode, use the Bytecode Stepper E-Component. The exploration creates and owns the EVM instance:

```typescript
// config.ts
import type { BytecodeStepperConfig } from '@/eComponents/bytecodeStepperEC/types'

export const config: BytecodeStepperConfig = {
  explorationId: 'eip-XXXX',
  defaultExample: 'basic',
}
```

```vue
<script setup lang="ts">
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'

import BytecodeStepperEC from '@/eComponents/bytecodeStepperEC/BytecodeStepperEC.vue'

import { config } from './config'
import { examples } from './examples'
import { INFO as exploration } from './info'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
const evm = await createEVM({ common })
</script>

<template>
  <BytecodeStepperEC :config="config" :examples="examples" :exploration="exploration" :evm="evm" />
</template>
```

Example presets use `values[0]` as unprefixed hex bytecode. For programmatic bytecode construction, add helper modules in your exploration folder.

**Reference:** [EIP-8024](https://github.com/feelyourprotocol/website/blob/main/src/explorations/eip-8024/MyC.vue)

See [Available E-Components](/contributing/available-e-components) for the full API reference of each E-Component.

### Extending When the Core E-Component Is Not Enough

E-Components cover repeatable patterns. Explorations often need additional teaching UI, domain helpers, or custom visualization on top. Keep these additions in your **exploration folder** unless a second exploration needs the same thing.

| Need                                                  | Approach                                                                              |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Custom result display                                 | Use the E-Component's scoped slot (e.g. `#result`)                                    |
| Additional panel or region                            | Use a layout slot (e.g. `#below`) and render a companion `.vue` component inside it   |
| React to live runtime state                           | Use the E-Component's inject context from a companion component mounted inside a slot |
| Bytecode builders, domain decode logic, test fixtures | Add `.ts` modules in the exploration folder                                           |

::: warning Slots and inject
Provide/inject only works for **descendants**. Companion components must be mounted inside the E-Component's slot tree — not as siblings placed next to the E-Component in `MyC.vue`.
:::

Keep `MyC.vue` thin: config, library wiring, E-Component tag, and slot content. Push logic into testable modules. See [E-Components — Integration Contract](/contributing/e-components#integration-contract) for the full model.

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

Import libraries in your exploration folder (`MyC.vue`, `config.ts`, helpers) — not in shared E-Component code. This keeps each exploration's dependencies isolated via Vite's code splitting. E-Components accept library instances and callbacks as props instead.

If you need a library that isn't in `package.json` yet, or need a customized version, see [Third-Party Libraries](/contributing/third-party-libraries).

## Step 7: Add Tests

Each exploration should have a `tests.spec.ts` file in its folder. Tests verify that your exploration's metadata, examples, and config are correct.

### What to Test

**All explorations** should test:

- `info.ts` — correct `id`, `path`, `topic`, and `poweredBy`
- `examples.ts` — each example has the right number of values, valid hex data, and a non-empty title

**E-Component explorations** should additionally test:

- `config.ts` — `defaultExample` exists in examples; config fields match expectations
- Execution integration — e.g. round-trip through `run` or `runBytecode` where applicable
- Companion components — if present, test via optional props (avoid requiring full E-Component mount when a slimmer test suffices)

**Precompile explorations** should additionally test:

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
      expect(INFO.topic).toBe('scaling')
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
      expect(INFO.topic).toBe('scaling')
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
- [ ] Created `config.ts` and any companion components/helpers (if using an E-Component with extensions)
- [ ] Added import and entry in `src/explorations/REGISTRY.ts`
- [ ] Installed library dependencies (if needed)
- [ ] All unit tests pass
- [ ] Linting and type checking pass
- [ ] Production build succeeds
