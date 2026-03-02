<script setup lang="ts">
import { Hardfork } from '@ethereumjs/common'
import { hexToBigInt } from '@ethereumjs/util'

import { padHex, toHex } from '@/components/lib/byteFormUtils'
import ExamplesC from '@/components/ui/ExamplesC.vue'
import HexDataInputC from '@/components/ui/HexDataInputC.vue'
import PrecompileResultC from '@/eComponents/precompile/PrecompileResultC.vue'
import PrecompileValueInput from '@/eComponents/precompile/PrecompileValueInput.vue'
import type { PrecompileConfig } from '@/eComponents/precompile/types'
import { usePrecompileState } from '@/eComponents/precompile/usePrecompileState'
import ExplorationC from '@/explorations/ExplorationC.vue'
import PoweredByC from '@/explorations/PoweredByC.vue'
import { TOPICS } from '@/explorations/TOPICS'

import { examples } from './examples'
import { INFO as exploration } from './info'

const topic = TOPICS[exploration.topic]

const config: PrecompileConfig = {
  explorationId: 'eip-7883',
  precompileAddress: '05',
  preHardfork: Hardfork.Prague,
  postHardfork: Hardfork.Osaka,
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

const {
  data, example,
  hexVals, bigIntVals, byteLengths,
  execResultPre, execResultPost,
  inputValues,
  selectExample, shareURL,
  onDataInputFormChange, onValueInputFormChange,
  init,
} = usePrecompileState(config, examples)

await init()
</script>

<template>
  <ExplorationC
    explorationId="eip-7883"
    :exploration="exploration"
    :topic="topic"
    :shareURL="shareURL"
  >
    <template #content>
      <div>
        <ExamplesC v-model="example" :examples="examples" :change="selectExample" />
        <HexDataInputC v-model="data" rows="6" :formChange="onDataInputFormChange" />

        <PrecompileValueInput
          v-for="val in inputValues"
          :key="val.title"
          v-model="hexVals[val.index]"
          :title="val.title"
          :input="onValueInputFormChange"
          :len="byteLengths[val.index]"
          :expectedLen="val.expectedLen"
          :bigIntVal="bigIntVals[val.index]"
        />

        <div class="grid grid-cols-2 gap-1 mt-2.5">
          <PrecompileResultC v-model="execResultPre" title="Pre-Osaka" :left="true" />
          <PrecompileResultC v-model="execResultPost" title="Post-Osaka" :left="false" />
        </div>
        <PoweredByC :poweredBy="exploration.poweredBy" :topic="topic" />
      </div>
    </template>
  </ExplorationC>
</template>
