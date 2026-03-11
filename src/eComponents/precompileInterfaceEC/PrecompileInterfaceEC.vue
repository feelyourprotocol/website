<script setup lang="ts" generic="T">
import type { PrefixedHexString } from '@ethereumjs/util'

import ExamplesUIC from '@/eComponents/ui/ExamplesUIC.vue'
import HexDataInputUIC from '@/eComponents/ui/HexDataInputUIC.vue'
import ExplorationC from '@/explorations/ExplorationC.vue'
import PoweredByC from '@/explorations/PoweredByC.vue'
import type { Examples } from '@/explorations/REGISTRY'
import type { Exploration } from '@/explorations/REGISTRY'
import { TOPICS } from '@/explorations/TOPICS'

import PrecompileValueInputEC from './PrecompileValueInputEC.vue'
import type { PrecompileConfig } from './types'
import { usePrecompileState } from './usePrecompileState'

const props = defineProps<{
  config: PrecompileConfig
  examples: Examples
  exploration: Exploration
  run: (data: PrefixedHexString) => Promise<T>
}>()

defineSlots<{
  result(props: { result: T | undefined }): void
}>()

const topic = TOPICS[props.exploration.topic]

const {
  data,
  example,
  hexVals,
  bigIntVals,
  byteLengths,
  inputValues,
  result,
  selectExample,
  shareURL,
  onDataInputFormChange,
  onValueInputFormChange,
  init,
} = usePrecompileState(props.config, props.examples, props.run)

await init()
</script>

<template>
  <ExplorationC
    :explorationId="config.explorationId"
    :exploration="exploration"
    :topic="topic"
    :shareURL="shareURL"
  >
    <template #content>
      <div>
        <ExamplesUIC v-model="example" :examples="examples" :change="selectExample" />
        <HexDataInputUIC v-model="data" rows="6" :formChange="onDataInputFormChange" />

        <PrecompileValueInputEC
          v-for="val in inputValues"
          :key="val.title"
          v-model="hexVals[val.index]"
          :title="val.title"
          :input="onValueInputFormChange"
          :len="byteLengths[val.index]"
          :expectedLen="val.expectedLen"
          :bigIntVal="bigIntVals[val.index]"
        />

        <slot name="result" :result="result" />
        <PoweredByC :poweredBy="exploration.poweredBy" />
      </div>
    </template>
  </ExplorationC>
</template>
