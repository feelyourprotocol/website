<script setup lang="ts">
import { Hardfork } from '@ethereumjs/common'

import { PP_BOX_LAYOUT } from '@/components/lib/layout'
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
    explorationId="eip-7951"
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

        <div :class="PP_BOX_LAYOUT">
          <PrecompileResultC v-model="execResultPre" title="Pre-Osaka" :left="true" />
          <PrecompileResultC v-model="execResultPost" title="Post-Osaka" :left="false" />
        </div>
        <PoweredByC :poweredBy="exploration.poweredBy" :topic="topic" />
      </div>
    </template>
  </ExplorationC>
</template>
