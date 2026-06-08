<script setup lang="ts">
import ActionButtonUIC from '@/eComponents/ui/ActionButtonUIC.vue'
import ExamplesUIC from '@/eComponents/ui/ExamplesUIC.vue'
import ExplorationC from '@/explorations/ExplorationC.vue'
import PoweredByC from '@/explorations/PoweredByC.vue'
import { TOPICS } from '@/explorations/TOPICS'

import FrameCardC from './components/FrameCardC.vue'
import TxOverviewC from './components/TxOverviewC.vue'
import { useFrameExecution } from './custom/useFrameExecution'
import { examples } from './examples'
import { INFO as exploration } from './info'

const topic = TOPICS[exploration.topic]

const {
  selectedExample,
  frameDefinitions,
  executionResult,
  isExecuting,
  errorMsg,
  currentExample,
  canStep,
  allRevealed,
  visibleSteps,
  selectExample,
  updateFrameData,
  execute,
  stepForward,
  reset,
} = useFrameExecution()

function onExampleChange() {
  selectExample(selectedExample.value)
}
</script>

<template>
  <ExplorationC explorationId="eip-8141" :exploration="exploration" :topic="topic">
    <template #content>
      <div class="flex items-center justify-between mt-3 gap-3">
        <ExamplesUIC v-model="selectedExample" :examples="examples" :change="onExampleChange" />
        <div class="flex items-center gap-2">
          <ActionButtonUIC
            v-if="executionResult"
            tooltip="Reset to initial state"
            text="RESET"
            :onClick="reset"
          />
          <ActionButtonUIC
            tooltip="Execute all frames and reveal step by step"
            :text="isExecuting ? 'Executing...' : 'EXECUTE'"
            :onClick="execute"
          />
        </div>
      </div>

      <p class="text-[11px] text-white/60 font-mono mt-3 mb-4">
        {{ currentExample.description }}
      </p>

      <div v-if="errorMsg && !executionResult" class="e-result-box mb-3">
        <span class="text-red-300 text-[11px] font-mono">{{ errorMsg }}</span>
      </div>

      <div class="flex flex-col gap-3">
        <FrameCardC
          v-for="(frame, i) in frameDefinitions"
          :key="i"
          :frame="frame"
          :index="i"
          :stepResult="visibleSteps.find((s) => s.frameIndex === i)"
          :isActive="
            executionResult !== null &&
            visibleSteps.length > 0 &&
            visibleSteps[visibleSteps.length - 1].frameIndex === i
          "
          :executed="executionResult !== null"
          @update:dataHex="updateFrameData(i, $event)"
        />
      </div>

      <div v-if="executionResult && canStep" class="flex justify-center mt-4">
        <button
          @click="stepForward"
          class="flex items-center gap-1.5 px-4 py-1.5 rounded bg-amber-600/80 hover:bg-amber-500 text-white text-xs font-mono transition-colors"
        >
          <span class="text-base leading-none">&#9654;</span>
          Next Frame
        </button>
      </div>

      <TxOverviewC
        v-if="executionResult"
        :result="executionResult"
        :allRevealed="allRevealed"
        class="mt-4"
      />

      <PoweredByC
        :poweredBy="exploration.poweredBy"
        :creatorName="exploration.creatorName"
        :creatorURL="exploration.creatorURL"
      />
    </template>
  </ExplorationC>
</template>
