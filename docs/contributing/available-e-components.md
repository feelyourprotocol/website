# Available E-Components

This page lists all E-Components that are ready to use in your explorations. For background on how E-Components work and how to create new ones, see [E-Components](/contributing/e-components).

## Precompile Interface (`precompileInterfaceEC`)

An interface for exploring EVM precompiles. It handles input management while leaving execution and result display to the exploration:

- Example selection and URL sharing
- Hex data input with parsing and validation
- Individual value inputs with byte length tracking
- **Execution and result display** are provided by the exploration via the `run` prop and `#result` slot

**Files:**

```
src/eComponents/precompileInterfaceEC/
├── PrecompileInterfaceEC.vue          # Main component
├── PrecompileInterfaceResultEC.vue    # Result display (reusable, e.g. pre/post comparison)
├── PrecompileValueInputEC.vue         # Value input with byte length validation
├── usePrecompileState.ts              # Composable: input state and sync logic
├── types.ts                           # PrecompileConfig and PrecompileValueDef
└── run.ts                             # EVM precompile execution utility + useStandardPrecompileRun
```

**Used by:** [EIP-7951](https://github.com/feelyourprotocol/website/blob/main/src/explorations/eip-7951/MyC.vue) (secp256r1), [EIP-7883](https://github.com/feelyourprotocol/website/blob/main/src/explorations/eip-7883/MyC.vue) (ModExp gas cost)

### Basic Usage

A precompile exploration provides a config for input layout, a `run` function for execution, and a `#result` slot for visualization. For the standard EthereumJS pre/post hardfork comparison, use the `useStandardPrecompileRun` helper:

```vue
<script setup lang="ts">
import { Hardfork } from '@ethereumjs/common'

import PrecompileInterfaceEC from '@/eComponents/precompileInterfaceEC/PrecompileInterfaceEC.vue'
import PrecompileInterfaceResultEC from '@/eComponents/precompileInterfaceEC/PrecompileInterfaceResultEC.vue'
import { useStandardPrecompileRun } from '@/eComponents/precompileInterfaceEC/run'
import type { PrecompileConfig } from '@/eComponents/precompileInterfaceEC/types'

import { examples } from './examples'
import { INFO as exploration } from './info'

const { run, execResultPre, execResultPost } = useStandardPrecompileRun(
  Hardfork.Prague, Hardfork.Osaka, '0a',
)

const config: PrecompileConfig = {
  explorationId: 'eip-XXXX',
  defaultExample: 'basic',
  values: [
    { title: 'Input A', urlParam: 'a', expectedLen: 32n },
    { title: 'Input B', urlParam: 'b', expectedLen: 32n },
  ],
}
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

### Component Props

| Prop | Required | Description |
|------|----------|-------------|
| `config` | Yes | Input configuration (see `PrecompileConfig` below) |
| `examples` | Yes | Example presets from `examples.ts` |
| `exploration` | Yes | Exploration metadata from `info.ts` |
| `run` | Yes | Execution function, called with the assembled hex data (without `0x`) on every valid input change |

### `PrecompileConfig` Reference

```typescript
interface PrecompileConfig {
  explorationId: string
  defaultExample: string
  showBigInt?: boolean
  values: PrecompileValueDef[]
  assembleData?: (hexVals: string[], byteLengths: bigint[]) => string
  parseData?: (data: string, byteLengths: bigint[]) => void
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `explorationId` | Yes | Matches the exploration's `id` in `info.ts` |
| `defaultExample` | Yes | Key from `examples.ts` to load on initialization |
| `showBigInt` | No | Show BigInt representations for values (default: per-value setting) |
| `values` | Yes | Array of value definitions (see below) |
| `assembleData` | No | Custom function to assemble raw hex data from individual values |
| `parseData` | No | Custom function to parse raw hex data into individual values |

### `PrecompileValueDef` Reference

```typescript
interface PrecompileValueDef {
  title: string
  urlParam?: string
  expectedLen?: bigint
  initialHex?: string
  showBigInt?: boolean
  showInput?: boolean
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Display label for this value |
| `urlParam` | No | URL query parameter name for sharing (omit for computed values) |
| `expectedLen` | No | Expected byte length for validation |
| `initialHex` | No | Initial hex value (used for length-prefix fields) |
| `showBigInt` | No | Show BigInt representation for this value |
| `showInput` | No | Whether to show the input field (default: `true`, set `false` for computed fields) |

### Custom Data Assembly

By default, individual values are simply concatenated to form the raw hex data. For precompiles with non-trivial data formats (like ModExp, which has length prefixes), provide custom `assembleData` and `parseData` functions:

```typescript
const config: PrecompileConfig = {
  // ...
  values: [
    { title: 'Blen', expectedLen: 32n, initialHex: '00'.repeat(32), showInput: false },
    { title: 'Elen', expectedLen: 32n, initialHex: '00'.repeat(32), showInput: false },
    { title: 'Mlen', expectedLen: 32n, initialHex: '00'.repeat(32), showInput: false },
    { title: 'B', urlParam: 'b' },
    { title: 'E', urlParam: 'e' },
    { title: 'M', urlParam: 'm' },
  ],
  assembleData: (hexVals, byteLengths) =>
    toHex(byteLengths[3], 32 * 2) +
    toHex(byteLengths[4], 32 * 2) +
    toHex(byteLengths[5], 32 * 2) +
    padHex(hexVals[3]) +
    padHex(hexVals[4]) +
    padHex(hexVals[5]),
  parseData: (data, byteLengths) => {
    byteLengths[3] = hexToBigInt(`0x${data.substring(0, 64)}`)
    byteLengths[4] = hexToBigInt(`0x${data.substring(64, 128)}`)
    byteLengths[5] = hexToBigInt(`0x${data.substring(128, 192)}`)
  },
}
```

### Execution: `run` Prop and `#result` Slot

The E-Component separates input management from execution. The exploration provides:

1. A **`run` function** — called automatically with the assembled hex data on every valid input change
2. A **`#result` slot** — renders the execution results however the exploration needs

#### Standard: `useStandardPrecompileRun`

For the common pre/post hardfork comparison using the EthereumJS EVM, use the provided helper:

```typescript
import { useStandardPrecompileRun } from '@/eComponents/precompileInterfaceEC/run'

const { run, execResultPre, execResultPost } = useStandardPrecompileRun(
  Hardfork.Prague, Hardfork.Osaka, '05',
)
```

This returns a `run` function ready to pass as a prop and two reactive refs for the results. Use `PrecompileInterfaceResultEC` in the `#result` slot for the standard gas + hex display.

#### Custom Execution

For explorations that need a different execution mechanism (custom precompile, different library, etc.), define your own `run` function and result state:

```vue
<script setup lang="ts">
import { ref } from 'vue'

import PrecompileInterfaceEC from '@/eComponents/precompileInterfaceEC/PrecompileInterfaceEC.vue'
import ResultBoxUIC from '@/eComponents/ui/resultBox/ResultBoxUIC.vue'

import { myCustomExecution } from './run'

const myResult = ref<string>()

async function run(data: string) {
  myResult.value = await myCustomExecution(data)
}
</script>

<template>
  <PrecompileInterfaceEC
    :config="config" :examples="examples" :exploration="exploration" :run="run"
  >
    <template #result>
      <div class="e-grid-single">
        <ResultBoxUIC title="My Result" :left="true">
          <p v-if="myResult" class="e-result-text-lg">{{ myResult }}</p>
          <p v-else class="e-result-text-md mt-5">Press enter or change input...</p>
        </ResultBoxUIC>
      </div>
    </template>
  </PrecompileInterfaceEC>
</template>
```

The `#result` slot template lives in the exploration's scope, so it naturally accesses your own refs and computed properties.
