<script setup lang="ts">
import { Hardfork } from '@ethereumjs/common'

import PrecompileExplorationC from '@/eComponents/precompile/PrecompileExplorationC.vue'
import type { PrecompileConfig } from '@/eComponents/precompile/types'

import { examples } from './examples'
import { INFO as exploration } from './info'

const config: PrecompileConfig = {
  explorationId: 'eip-7951',
  precompileAddress: '100',
  preHardfork: Hardfork.Prague,
  postHardfork: Hardfork.Osaka,
  defaultExample: 'valid',
  showBigInt: false,
  values: [
    { title: 'Hash', urlParam: 'hash', expectedLen: 32n },
    { title: 'SigR', urlParam: 'sigr', expectedLen: 32n },
    { title: 'SigS', urlParam: 'sigs', expectedLen: 32n },
    { title: 'PubX', urlParam: 'pubx', expectedLen: 32n },
    { title: 'PubY', urlParam: 'puby', expectedLen: 32n },
  ],
}
</script>

<template>
  <PrecompileExplorationC :config="config" :examples="examples" :exploration="exploration" />
</template>
