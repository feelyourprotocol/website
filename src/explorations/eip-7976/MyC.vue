<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import ExamplesUIC from '@/eComponents/ui/ExamplesUIC.vue'
import ResultBoxUIC from '@/eComponents/ui/resultBox/ResultBoxUIC.vue'
import ScenarioStepNavUIC from '@/eComponents/ui/ScenarioStepNavUIC.vue'
import SegmentedToggleUIC from '@/eComponents/ui/SegmentedToggleUIC.vue'
import WidgetChromeUIC from '@/eComponents/ui/WidgetChromeUIC.vue'
import ExplorationC from '@/explorations/ExplorationC.vue'
import { fypHardforkToggleOptions } from '@/explorations/forkCatalog'
import { TOPICS } from '@/explorations/TOPICS'
import { resolveInitialExample } from '@/libs/exampleFromQuery'
import { useExplorationExampleQuery } from '@/libs/useExplorationExampleQuery'

import BytePriceStage from './BytePriceStage.vue'
import { DEFAULT_SHAPE_ID, examples, SHAPE_META } from './examples'
import FloorCompareView from './FloorCompareView.vue'
import { INFO as exploration } from './info'
import { runShape, type ShapeRun } from './run'
import { floorQuote, type HardforkChoice, isShapeId, SHAPE_ORDER } from './schedule'

const topic = TOPICS[exploration.topic]
const exampleQuery = useExplorationExampleQuery()

const example = ref('')
const hardfork = ref<HardforkChoice>('glamsterdam')
const errorMsg = ref('')
const result = ref<ShapeRun | null>(null)
let runToken = 0

const meta = computed(() => (isShapeId(example.value) ? SHAPE_META[example.value] : undefined))
const quote = computed(() =>
  isShapeId(example.value) ? floorQuote(example.value, hardfork.value) : undefined,
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

function selectExample() {
  // Pricing runs from the example watch.
}

async function showResult() {
  if (!isShapeId(example.value)) return
  const token = ++runToken
  const shape = example.value
  const fork = hardfork.value
  errorMsg.value = ''
  try {
    const next = await runShape(shape, fork)
    if (token !== runToken) return
    result.value = next
  } catch (error) {
    if (token !== runToken) return
    errorMsg.value = error instanceof Error ? error.message : String(error)
    result.value = null
  }
}

function navigate(direction: -1 | 1) {
  if (!isShapeId(example.value)) return
  const next = SHAPE_ORDER[SHAPE_ORDER.indexOf(example.value) + direction]
  if (next === undefined) return
  example.value = next
}

function setHardfork(next: HardforkChoice) {
  if (hardfork.value === next) return
  hardfork.value = next
}

function onHardforkInput(value: string) {
  if (value === 'glamsterdam' || value === 'fusaka') setHardfork(value)
}

const hardforkOptions = fypHardforkToggleOptions()

async function init() {
  example.value = resolveInitialExample(examples, DEFAULT_SHAPE_ID, exampleQuery)
}

watch(example, (next, prev) => {
  if (prev !== '' && next !== prev) hardfork.value = 'glamsterdam'
})

watch([example, hardfork], () => {
  void showResult()
})

await init()
</script>

<template>
  <ExplorationC asPageTitle explorationId="eip-7976" :exploration="exploration" :topic="topic">
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
      </WidgetChromeUIC>

      <template v-if="quote && meta && isShapeId(example)">
        <BytePriceStage :shape="example" :hardfork="hardfork" />
        <FloorCompareView
          class="mb-5"
          :quote="quote"
          :shape="example"
          :hardfork="hardfork"
          :has-run="result !== null"
          :measured="result?.gasUsed"
          :floor-won="result?.floorWon ?? false"
          :success="result?.success ?? true"
        />
        <ResultBoxUIC v-if="errorMsg" title="Error" :left="true" :errorText="errorMsg" />
      </template>
    </template>
  </ExplorationC>
</template>
