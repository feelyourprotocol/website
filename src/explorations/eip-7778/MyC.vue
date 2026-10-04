<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import ActionButtonUIC from '@/eComponents/ui/ActionButtonUIC.vue'
import ExamplesUIC from '@/eComponents/ui/ExamplesUIC.vue'
import ResultBoxUIC from '@/eComponents/ui/resultBox/ResultBoxUIC.vue'
import ScenarioStepNavUIC from '@/eComponents/ui/ScenarioStepNavUIC.vue'
import SegmentedToggleUIC from '@/eComponents/ui/SegmentedToggleUIC.vue'
import WidgetChromeUIC from '@/eComponents/ui/WidgetChromeUIC.vue'
import ExplorationC from '@/explorations/ExplorationC.vue'
import { TOPICS } from '@/explorations/TOPICS'
import { resolveInitialExample } from '@/libs/exampleFromQuery'
import { useExplorationExampleQuery } from '@/libs/useExplorationExampleQuery'

import { DEFAULT_SCENARIO_ID, exampleMeta, examples } from './examples'
import { INFO as exploration } from './info'
import PayLedgerView from './PayLedgerView.vue'
import { type HardforkChoice, runScenario, type RunScenarioOutput } from './run'
import ScenarioBriefView from './ScenarioBriefView.vue'
import { getAdjacentScenarioId, getScenario, SCENARIO_ORDER } from './scenarios'

const topic = TOPICS[exploration.topic]
const exampleQuery = useExplorationExampleQuery()

const example = ref('')
const hardfork = ref<HardforkChoice>('glamsterdam')
const errorMsg = ref('')
const result = ref<RunScenarioOutput | null>(null)

const scenario = computed(() => (example.value ? getScenario(example.value) : undefined))
const meta = computed(() => (example.value ? exampleMeta[example.value] : undefined))

const stepPosition = computed(() => {
  if (!example.value) return ''
  const index = SCENARIO_ORDER.indexOf(example.value as (typeof SCENARIO_ORDER)[number])
  return index === -1 ? '' : `Step ${index + 1} of ${SCENARIO_ORDER.length}`
})

const canGoPrev = computed(() => getAdjacentScenarioId(example.value, -1) !== undefined)
const canGoNext = computed(() => getAdjacentScenarioId(example.value, 1) !== undefined)

function resetRunState() {
  result.value = null
  errorMsg.value = ''
}

function selectExample() {
  if (example.value === '') return
  resetRunState()
}

function navigate(direction: -1 | 1) {
  const nextId = getAdjacentScenarioId(example.value, direction)
  if (nextId === undefined) return
  example.value = nextId
  resetRunState()
}

function setHardfork(next: HardforkChoice) {
  if (hardfork.value === next) return
  hardfork.value = next
  resetRunState()
}

function onHardforkInput(value: string) {
  if (value === 'glamsterdam' || value === 'fusaka') setHardfork(value)
}

const hardforkOptions = [
  { value: 'glamsterdam', label: 'Glamsterdam', testId: 'hardfork-glamsterdam' },
  { value: 'fusaka', label: 'Fusaka', testId: 'hardfork-fusaka' },
]

async function runTxAction(): Promise<void> {
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
    hardfork.value = 'glamsterdam'
  }
})

await init()
</script>

<template>
  <ExplorationC asPageTitle explorationId="eip-7778" :exploration="exploration" :topic="topic">
    <template #content>
      <WidgetChromeUIC>
        <template #steps>
          <ScenarioStepNavUIC
            :label="stepPosition"
            :can-go-prev="canGoPrev"
            :can-go-next="canGoNext"
            @prev="navigate(-1)"
            @next="navigate(1)"
          />
        </template>
        <template #toggles>
          <SegmentedToggleUIC
            :model-value="hardfork"
            :options="hardforkOptions"
            group-label="Hardfork"
            test-id="hardfork-toggle"
            @update:model-value="onHardforkInput"
          />
        </template>
        <template #examples>
          <ExamplesUIC
            v-model="example"
            :examples="examples"
            :change="selectExample"
            select-min-width-class="min-w-[13.5rem] max-md:min-w-0 justify-between"
          />
        </template>
        <template #run>
          <ActionButtonUIC
            test-id="run-tx"
            text="Run tx"
            tooltip="Execute the transaction and compare your bill with the block"
            :onClick="runTxAction"
          />
        </template>
      </WidgetChromeUIC>

      <template v-if="scenario && meta">
        <ScenarioBriefView
          :scenario="scenario"
          :meta="meta"
          :result="result"
          :has-run="result !== null"
        />

        <PayLedgerView
          :has-run="result !== null"
          :pay="result?.pay ?? 0n"
          :block="result?.block ?? 0n"
          :tx-successful="result?.txSuccessful ?? true"
        />

        <ResultBoxUIC v-if="errorMsg" title="Error" :left="true" :errorText="errorMsg" />
      </template>
    </template>
  </ExplorationC>
</template>
