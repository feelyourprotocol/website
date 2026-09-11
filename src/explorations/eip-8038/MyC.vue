<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import ActionButtonUIC from '@/eComponents/ui/ActionButtonUIC.vue'
import ExamplesUIC from '@/eComponents/ui/ExamplesUIC.vue'
import ResultBoxUIC from '@/eComponents/ui/resultBox/ResultBoxUIC.vue'
import SegmentedToggleUIC from '@/eComponents/ui/SegmentedToggleUIC.vue'
import ExplorationC from '@/explorations/ExplorationC.vue'
import PoweredByC from '@/explorations/PoweredByC.vue'
import { TOPICS } from '@/explorations/TOPICS'
import { resolveInitialExample } from '@/libs/exampleFromQuery'
import { useExplorationExampleQuery } from '@/libs/useExplorationExampleQuery'

import ComponentBreakdownView from './ComponentBreakdownView.vue'
import { DEFAULT_SCENARIO_ID, exampleMeta, examples } from './examples'
import { INFO as exploration } from './info'
import { previewComponents, runScenario, type RunScenarioOutput } from './run'
import ScenarioBriefView from './ScenarioBriefView.vue'
import { getScenario } from './scenarios'
import type { HardforkChoice } from './types'

const topic = TOPICS[exploration.topic]
const exampleQuery = useExplorationExampleQuery()

const example = ref('')
const hardfork = ref<HardforkChoice>('amsterdam')
const errorMsg = ref('')
const result = ref<RunScenarioOutput | null>(null)

const scenario = computed(() => (example.value ? getScenario(example.value) : undefined))
const meta = computed(() => (example.value ? exampleMeta[example.value] : undefined))

const osakaComponents = computed(() =>
  example.value ? previewComponents(example.value, 'osaka') : undefined,
)
const amsterdamComponents = computed(() =>
  example.value ? previewComponents(example.value, 'amsterdam') : undefined,
)

function resetRunState() {
  result.value = null
  errorMsg.value = ''
}

function selectExample() {
  if (example.value === '') return
  resetRunState()
}

function setHardfork(next: HardforkChoice) {
  if (hardfork.value === next) return
  hardfork.value = next
  resetRunState()
}

function onHardforkInput(value: string) {
  if (value === 'amsterdam' || value === 'osaka') setHardfork(value)
}

const hardforkOptions = [
  { value: 'amsterdam', label: 'Amsterdam', testId: 'hardfork-amsterdam' },
  { value: 'osaka', label: 'Osaka', testId: 'hardfork-osaka' },
]

async function runProgram(): Promise<void> {
  if (example.value === '') return
  errorMsg.value = ''
  try {
    result.value = await runScenario(example.value, hardfork.value)
  } catch (error) {
    errorMsg.value = error instanceof Error ? error.message : String(error)
    result.value = null
  }
}

async function init() {
  example.value = resolveInitialExample(examples, DEFAULT_SCENARIO_ID, exampleQuery)
}

watch(example, (next, prev) => {
  if (prev !== '' && next !== prev) {
    hardfork.value = 'amsterdam'
  }
})

await init()
</script>

<template>
  <ExplorationC asPageTitle explorationId="eip-8038" :exploration="exploration" :topic="topic">
    <template #content>
      <div class="flex flex-wrap items-center justify-end gap-2 mb-4">
        <SegmentedToggleUIC
          :model-value="hardfork"
          :options="hardforkOptions"
          group-label="Hardfork"
          test-id="hardfork-toggle"
          @update:model-value="onHardforkInput"
        />
        <ExamplesUIC
          v-model="example"
          :examples="examples"
          :change="selectExample"
          select-min-width-class="min-w-[13.5rem] max-md:min-w-0 justify-between"
        />
        <div
          class="shrink-0 max-md:[&_.e-action-button]:min-h-9 max-md:[&_.e-action-button]:px-2 max-md:[&_.e-action-button]:py-1.5 max-md:[&_.e-action-button]:text-xs"
        >
          <ActionButtonUIC
            test-id="run-program"
            text="Run"
            tooltip="Run the program and split touch, change, and create"
            :onClick="runProgram"
          />
        </div>
      </div>

      <template v-if="scenario && meta && osakaComponents && amsterdamComponents">
        <ScenarioBriefView
          :scenario="scenario"
          :meta="meta"
          :result="result"
          :has-run="result !== null"
        />

        <ComponentBreakdownView
          :has-run="result !== null"
          :hardfork="hardfork"
          :osaka="osakaComponents"
          :amsterdam="amsterdamComponents"
          :program-gas="result?.programGas ?? 0n"
          :osaka-program-gas="scenario.expectedProgramGas.osaka"
          :amsterdam-program-gas="scenario.expectedProgramGas.amsterdam"
          :state-gas="result?.stateGas ?? 0n"
        />

        <ResultBoxUIC v-if="errorMsg" title="Error" :left="true" :errorText="errorMsg" />
      </template>

      <PoweredByC
        :poweredBy="exploration.poweredBy"
        :creatorName="exploration.creatorName"
        :creatorURL="exploration.creatorURL"
      />
    </template>
  </ExplorationC>
</template>
