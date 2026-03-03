# Available E-Components

This page lists all E-Components that are ready to use in your explorations. For background on how E-Components work and how to create new ones, see [E-Components](/contributing/e-components).

## Precompile Interface (`precompileInterfaceEC`)

A complete interface for exploring EVM precompiles. It handles:

- Example selection and URL sharing
- Hex data input with parsing and validation
- Individual value inputs with byte length tracking
- Side-by-side pre/post hardfork comparison (running the precompile on two different EVM versions)
- Result display with gas cost and output data

**Files:**

```
src/eComponents/precompileInterfaceEC/
├── PrecompileInterfaceEC.vue          # Main component
├── PrecompileInterfaceResultEC.vue    # Result display (pre/post comparison)
├── PrecompileValueInputEC.vue         # Value input with byte length validation
├── usePrecompileState.ts              # Composable: all state and logic
├── types.ts                           # PrecompileConfig and PrecompileValueDef
└── run.ts                             # EVM precompile execution utility
```

**Used by:** [EIP-7951](https://github.com/feelyourprotocol/website/blob/main/src/explorations/eip-7951/MyC.vue) (secp256r1), [EIP-7883](https://github.com/feelyourprotocol/website/blob/main/src/explorations/eip-7883/MyC.vue) (ModExp gas cost)

### Basic Usage

A precompile exploration needs just a config object and a single component tag:

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

### `PrecompileConfig` Reference

```typescript
interface PrecompileConfig {
  explorationId: string
  precompileAddress: string
  preHardfork: Hardfork
  postHardfork: Hardfork
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
| `precompileAddress` | Yes | Hex address of the precompile (e.g. `'05'` for ModExp) |
| `preHardfork` | Yes | Hardfork for the "before" comparison |
| `postHardfork` | Yes | Hardfork for the "after" comparison |
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
