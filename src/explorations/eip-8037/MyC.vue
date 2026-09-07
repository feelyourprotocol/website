<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import ActionButtonUIC from '@/eComponents/ui/ActionButtonUIC.vue'
import ExamplesUIC from '@/eComponents/ui/ExamplesUIC.vue'
import ResultBoxUIC from '@/eComponents/ui/resultBox/ResultBoxUIC.vue'
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

function setGasLimitMode(next: GasLimitMode) {
  if (gasLimitMode.value === next) return
  gasLimitMode.value = next
  resetRunState()
}

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
          <div
            class="inline-flex shrink-0 rounded-md border e-border e-bg-medium p-0.5 text-xs font-mono max-md:px-0.5"
            role="group"
            aria-label="Hardfork"
            data-testid="hardfork-toggle"
          >
            <button
              type="button"
              class="rounded px-2.5 py-1 transition-colors"
              :class="
                hardfork === 'amsterdam'
                  ? 'e-bg-dark font-semibold text-white'
                  : 'e-text opacity-70'
              "
              :aria-pressed="hardfork === 'amsterdam'"
              data-testid="hardfork-amsterdam"
              @click="setHardfork('amsterdam')"
            >
              Amsterdam
            </button>
            <button
              type="button"
              class="rounded px-2.5 py-1 transition-colors"
              :class="
                hardfork === 'osaka' ? 'e-bg-dark font-semibold text-white' : 'e-text opacity-70'
              "
              :aria-pressed="hardfork === 'osaka'"
              data-testid="hardfork-osaka"
              @click="setHardfork('osaka')"
            >
              Osaka
            </button>
          </div>
          <div
            class="inline-flex shrink-0 rounded-md border e-border e-bg-medium p-0.5 text-xs font-mono"
            role="group"
            aria-label="Gas limit"
            data-testid="gas-limit-toggle"
          >
            <button
              type="button"
              class="rounded px-2.5 py-1 transition-colors"
              :class="
                gasLimitMode === 'classic'
                  ? 'e-bg-dark font-semibold text-white'
                  : 'e-text opacity-70'
              "
              :aria-pressed="gasLimitMode === 'classic'"
              data-testid="gas-limit-classic"
              @click="setGasLimitMode('classic')"
            >
              {{ formatGas(CLASSIC_GAS_LIMIT) }}
            </button>
            <button
              type="button"
              class="rounded px-2.5 py-1 transition-colors"
              :class="
                gasLimitMode === 'recommended'
                  ? 'e-bg-dark font-semibold text-white'
                  : 'e-text opacity-70'
              "
              :aria-pressed="gasLimitMode === 'recommended'"
              data-testid="gas-limit-recommended"
              @click="setGasLimitMode('recommended')"
            >
              Recommended
            </button>
          </div>
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
          v-if="result && bars"
          class="mb-5"
          :regular="bars.regular"
          :state="bars.state"
          :gas-limit="result.gasLimit"
          :tx-successful="result.txSuccessful"
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
