<script setup lang="ts">
import type { Examples } from '@/components/lib/general'
import { PP_BOX_LAYOUT } from '@/components/lib/layout'
import ExamplesC from '@/components/ui/ExamplesC.vue'
import HexDataInputC from '@/components/ui/HexDataInputC.vue'
import ExplorationC from '@/explorations/ExplorationC.vue'
import PoweredByC from '@/explorations/PoweredByC.vue'
import type { Exploration } from '@/explorations/REGISTRY'
import { TOPICS } from '@/explorations/TOPICS'

import PrecompileResultC from './PrecompileResultC.vue'
import PrecompileValueInput from './PrecompileValueInput.vue'
import type { PrecompileConfig } from './types'
import { usePrecompileState } from './usePrecompileState'

const props = defineProps<{
  config: PrecompileConfig
  examples: Examples
  exploration: Exploration
}>()

const topic = TOPICS[props.exploration.topic]

const {
  data,
  example,
  hexVals,
  bigIntVals,
  byteLengths,
  execResultPre,
  execResultPost,
  inputValues,
  selectExample,
  shareURL,
  onDataInputFormChange,
  onValueInputFormChange,
  init,
} = usePrecompileState(props.config, props.examples)

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
