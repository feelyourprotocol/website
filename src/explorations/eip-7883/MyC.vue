<script setup lang="ts">
import { Hardfork } from '@ethereumjs/common'
import { hexToBigInt } from '@ethereumjs/util'

import PrecompileInterfaceEC from '@/eComponents/precompileInterfaceEC/PrecompileInterfaceEC.vue'
import PrecompileInterfaceResultEC from '@/eComponents/precompileInterfaceEC/PrecompileInterfaceResultEC.vue'
import { useStandardPrecompileRun } from '@/eComponents/precompileInterfaceEC/run'
import type { PrecompileConfig } from '@/eComponents/precompileInterfaceEC/types'
import { padHex, toHex } from '@/eComponents/precompileInterfaceEC/utils'

import { examples } from './examples'
import { INFO as exploration } from './info'

const { run, execResultPre, execResultPost } = useStandardPrecompileRun(
  Hardfork.Prague, Hardfork.Osaka, '05',
)

const config: PrecompileConfig = {
  explorationId: 'eip-7883',
  defaultExample: 'simple',
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
