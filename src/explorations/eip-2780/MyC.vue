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

import { DEFAULT_SHAPE_ID, examples, SHAPE_META } from './examples'
import { INFO as exploration } from './info'
import PieceLedgerView from './PieceLedgerView.vue'
import { type HardforkChoice, intrinsicPieces, isShapeId, SHAPE_ORDER } from './pieces'
import { runShape, type ShapeRun } from './run'

const topic = TOPICS[exploration.topic]
const exampleQuery = useExplorationExampleQuery()

const example = ref('')
const hardfork = ref<HardforkChoice>('glamsterdam')
const errorMsg = ref('')
const result = ref<ShapeRun | null>(null)

const meta = computed(() => (isShapeId(example.value) ? SHAPE_META[example.value] : undefined))
const schedule = computed(() =>
  isShapeId(example.value) ? intrinsicPieces(example.value, hardfork.value) : undefined,
)

const stepPosition = computed(() => {
  if (!isShapeId(example.value)) return ''
  const index = SHAPE_ORDER.indexOf(example.value)
  return `Step ${index + 1} of ${SHAPE_ORDER.length}`
})

const canGoPrev = computed(() => {
  if (!isShapeId(example.value)) return false
  return SHAPE_ORDER.indexOf(example.value) > 0
})

const canGoNext = computed(() => {
  if (!isShapeId(example.value)) return false
  return SHAPE_ORDER.indexOf(example.value) < SHAPE_ORDER.length - 1
})

function resetRunState() {
  result.value = null
  errorMsg.value = ''
}

function selectExample() {
  if (example.value === '') return
  resetRunState()
}

function navigate(direction: -1 | 1) {
  if (!isShapeId(example.value)) return
  const next = SHAPE_ORDER[SHAPE_ORDER.indexOf(example.value) + direction]
  if (next === undefined) return
  example.value = next
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
  if (!isShapeId(example.value)) return
  errorMsg.value = ''
  try {
    result.value = await runShape(example.value, hardfork.value)
  } catch (error) {
    errorMsg.value = error instanceof Error ? error.message : String(error)
    result.value = null
  }
}

async function init() {
  example.value = resolveInitialExample(examples, DEFAULT_SHAPE_ID, exampleQuery)
}

watch(example, (next, prev) => {
  if (prev !== '' && next !== prev) hardfork.value = 'glamsterdam'
})

await init()
</script>

<template>
  <ExplorationC asPageTitle explorationId="eip-2780" :exploration="exploration" :topic="topic">
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
            tooltip="Run the transaction and check the charged total"
            :onClick="runTxAction"
          />
        </template>
      </WidgetChromeUIC>

      <template v-if="schedule && meta">
        <p class="text-sm leading-relaxed mb-4 min-h-[4.5rem]">{{ meta.lesson }}</p>
        <PieceLedgerView
          class="mb-5"
          :pieces="schedule"
          :has-run="result !== null"
          :measured="result?.gasUsed"
          :success="result?.success ?? true"
        />
        <ResultBoxUIC v-if="errorMsg" title="Error" :left="true" :errorText="errorMsg" />
      </template>
    </template>
  </ExplorationC>
</template>
