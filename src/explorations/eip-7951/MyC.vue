<script setup lang="ts">
import { Hardfork } from '@ethereumjs/common'

import PrecompileInterfaceEC from '@/eComponents/precompileInterfaceEC/PrecompileInterfaceEC.vue'
import PrecompileInterfaceResultEC from '@/eComponents/precompileInterfaceEC/PrecompileInterfaceResultEC.vue'
import { useStandardPrecompileRun } from '@/eComponents/precompileInterfaceEC/run'
import type { PrecompileConfig } from '@/eComponents/precompileInterfaceEC/types'

import { examples } from './examples'
import { INFO as exploration } from './info'

const { run, execResultPre, execResultPost } = useStandardPrecompileRun(
  Hardfork.Prague, Hardfork.Osaka, '100',
)

const config: PrecompileConfig = {
  explorationId: 'eip-7951',
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
