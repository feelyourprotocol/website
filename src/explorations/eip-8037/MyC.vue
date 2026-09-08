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

import { DEFAULT_SCENARIO_ID, exampleMeta, examples } from './examples'
import GasBarsView from './GasBarsView.vue'
import { INFO as exploration } from './info'
import {
  displayGasBars,
  type GasLimitMode,
  type HardforkChoice,
  runScenario,
  type RunScenarioOutput,
} from './run'
import ScenarioBriefView from './ScenarioBriefView.vue'
import { getAdjacentScenarioId, getScenario, SCENARIO_ORDER } from './scenarios'
import { CLASSIC_GAS_LIMIT } from './scenarios/constants'
import { formatGas } from './scenarios/helpers'

const topic = TOPICS[exploration.topic]
const exampleQuery = useExplorationExampleQuery()

const example = ref('')
const hardfork = ref<HardforkChoice>('amsterdam')
const gasLimitMode = ref<GasLimitMode>('recommended')
const errorMsg = ref('')
const result = ref<RunScenarioOutput | null>(null)

const scenario = computed(() => (example.value ? getScenario(example.value) : undefined))
const meta = computed(() => (example.value ? exampleMeta[example.value] : undefined))
const bars = computed(() => (result.value ? displayGasBars(result.value) : null))

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
  if (value === 'amsterdam' || value === 'osaka') setHardfork(value)
}

function setGasLimitMode(next: GasLimitMode) {
  if (gasLimitMode.value === next) return
  gasLimitMode.value = next
  resetRunState()
}

function onGasLimitInput(value: string) {
  if (value === 'classic' || value === 'recommended') setGasLimitMode(value)
}

const hardforkOptions = [
  { value: 'amsterdam', label: 'Amsterdam', testId: 'hardfork-amsterdam' },
  { value: 'osaka', label: 'Osaka', testId: 'hardfork-osaka' },
]

const gasLimitOptions = computed(() => [
  { value: 'classic', label: formatGas(CLASSIC_GAS_LIMIT), testId: 'gas-limit-classic' },
  { value: 'recommended', label: 'Recommended', testId: 'gas-limit-recommended' },
])

async function runTxAction(): Promise<void> {
  if (example.value === '') return
  errorMsg.value = ''
  try {
    result.value = await runScenario(example.value, hardfork.value, gasLimitMode.value)
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
    gasLimitMode.value = 'recommended'
  }
})

await init()
</script>

<template>
  <ExplorationC asPageTitle explorationId="eip-8037" :exploration="exploration" :topic="topic">
    <template #content>
      <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="e-select px-2 py-1 text-xs disabled:opacity-40"
            :disabled="!canGoPrev"
            @click="navigate(-1)"
          >
            ← prev
          </button>
          <span v-if="stepPosition" class="font-mono text-xs opacity-70">{{ stepPosition }}</span>
          <button
            type="button"
            class="e-select px-2 py-1 text-xs disabled:opacity-40"
            :disabled="!canGoNext"
            @click="navigate(1)"
          >
            next →
          </button>
        </div>
        <div class="flex flex-wrap items-center justify-end gap-2 max-md:w-full">
          <SegmentedToggleUIC
            :model-value="hardfork"
            :options="hardforkOptions"
            group-label="Hardfork"
            test-id="hardfork-toggle"
            @update:model-value="onHardforkInput"
          />
          <SegmentedToggleUIC
            :model-value="gasLimitMode"
            :options="gasLimitOptions"
            group-label="Gas limit"
            test-id="gas-limit-toggle"
            @update:model-value="onGasLimitInput"
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
              test-id="run-tx"
              text="Run tx"
              tooltip="Execute the transaction and compare execution vs state gas"
              :onClick="runTxAction"
            />
          </div>
        </div>
      </div>

      <template v-if="scenario && meta">
        <ScenarioBriefView
          :scenario="scenario"
          :meta="meta"
          :result="result"
          :has-run="result !== null"
          :hardfork="hardfork"
        />

        <GasBarsView
          class="mb-5"
          :has-run="result !== null"
          :regular="bars?.regular ?? 0n"
          :state="bars?.state ?? 0n"
          :gas-limit="result?.gasLimit ?? CLASSIC_GAS_LIMIT"
          :tx-successful="result?.txSuccessful ?? true"
          :gas-limit-mode="gasLimitMode"
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
