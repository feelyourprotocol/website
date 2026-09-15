<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import ReceiptLogsPanelEC from '@/eComponents/receiptLogsEC/ReceiptLogsPanelEC.vue'
import ActionButtonUIC from '@/eComponents/ui/ActionButtonUIC.vue'
import ExamplesUIC from '@/eComponents/ui/ExamplesUIC.vue'
import ResultBoxUIC from '@/eComponents/ui/resultBox/ResultBoxUIC.vue'
import ScenarioStepNavUIC from '@/eComponents/ui/ScenarioStepNavUIC.vue'
import SegmentedToggleUIC from '@/eComponents/ui/SegmentedToggleUIC.vue'
import WidgetChromeUIC from '@/eComponents/ui/WidgetChromeUIC.vue'
import ExplorationC from '@/explorations/ExplorationC.vue'
import PoweredByC from '@/explorations/PoweredByC.vue'
import { TOPICS } from '@/explorations/TOPICS'
import { useCompanionStatusPublisher } from '@/libs/companionStatus'
import { resolveInitialExample } from '@/libs/exampleFromQuery'
import { useExplorationExampleQuery } from '@/libs/useExplorationExampleQuery'

import { DEFAULT_SCENARIO_ID, exampleMeta, examples } from './examples'
import { INFO as exploration } from './info'
import { type HardforkChoice, runScenario, type RunScenarioOutput } from './run'
import ScenarioBriefView from './ScenarioBriefView.vue'
import { getAdjacentScenarioId, getScenario, SCENARIO_ORDER } from './scenarios'

const topic = TOPICS[exploration.topic]
const exampleQuery = useExplorationExampleQuery()

const example = ref('')
const hardfork = ref<HardforkChoice>('amsterdam')
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
const setCompanionStatus = useCompanionStatusPublisher()

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

const hardforkOptions = [
  { value: 'amsterdam', label: 'Amsterdam', testId: 'hardfork-amsterdam' },
  { value: 'osaka', label: 'Osaka', testId: 'hardfork-osaka' },
]

async function runBlock(): Promise<void> {
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

watch(
  () => result.value,
  (runResult) => {
    if (runResult) {
      const count = runResult.transferLogCount
      setCompanionStatus({
        label: `Receipt · ${count} Transfer log${count === 1 ? '' : 's'} (${runResult.hardforkId})`,
        state: 'active',
      })
      return
    }
    setCompanionStatus({
      label: 'Run the block to inspect receipt logs',
      state: 'idle',
    })
  },
  { immediate: true },
)

await init()
</script>

<template>
  <ExplorationC asPageTitle explorationId="eip-7708" :exploration="exploration" :topic="topic">
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
            test-id="run-block"
            text="Run block"
            tooltip="Execute block on the selected hardfork and read receipt logs"
            :onClick="runBlock"
          />
        </template>
      </WidgetChromeUIC>

      <template v-if="scenario && meta">
        <ScenarioBriefView
          :scenario="scenario"
          :meta="meta"
          :result="result"
          :has-run="result !== null"
          :hardfork="hardfork"
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

  <Teleport to="#exploration-right-panel">
    <ReceiptLogsPanelEC
      v-if="scenario"
      :topic="topic"
      :state="result?.receiptLogs ?? null"
      :has-run="result !== null"
      :config="{
        title: 'Receipt logs',
        idleHint: 'Run a scenario to see decoded Transfer logs from the transaction receipt.',
      }"
    />
  </Teleport>
</template>
