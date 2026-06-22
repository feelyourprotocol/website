<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import ActionButtonUIC from '@/eComponents/ui/ActionButtonUIC.vue'
import ExamplesUIC from '@/eComponents/ui/ExamplesUIC.vue'
import ResultBoxUIC from '@/eComponents/ui/resultBox/ResultBoxUIC.vue'
import ExplorationC from '@/explorations/ExplorationC.vue'
import PoweredByC from '@/explorations/PoweredByC.vue'
import { TOPICS } from '@/explorations/TOPICS'
import { useCompanionStatusPublisher } from '@/libs/companionStatus'

import BalExplorerPanel from './BalExplorerPanel.vue'
import { DEFAULT_SCENARIO_ID, exampleMeta, examples } from './examples'
import { INFO as exploration } from './info'
import { runScenario } from './run'
import ScenarioBriefView from './ScenarioBriefView.vue'
import { getAdjacentScenarioId, getScenario, SCENARIO_ORDER } from './scenarios'
import type { ScenarioRunResult } from './scenarios/types'
import { buildTriggerGroups } from './transitions'

const topic = TOPICS[exploration.topic]

const example = ref('')
const errorMsg = ref('')
const result = ref<ScenarioRunResult | null>(null)
const activePath = ref<string | null>(null)

const scenario = computed(() => (example.value ? getScenario(example.value) : undefined))
const meta = computed(() => (example.value ? exampleMeta[example.value] : undefined))

const triggerGroups = computed(() => {
  if (result.value === null) return []
  return buildTriggerGroups(result.value.balJson, result.value.preState)
})

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
  activePath.value = null
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

function setActivePath(path: string | null) {
  activePath.value = path
}

async function runBlock(): Promise<void> {
  if (example.value === '') return
  errorMsg.value = ''
  activePath.value = null
  try {
    result.value = await runScenario(example.value)
  } catch (error) {
    errorMsg.value = error instanceof Error ? error.message : String(error)
    result.value = null
  }
}

async function init() {
  example.value = DEFAULT_SCENARIO_ID
}

watch(
  () => [result.value, triggerGroups.value] as const,
  ([runResult, groups]) => {
    if (runResult) {
      const changeCount = groups.reduce((sum, group) => sum + group.items.length, 0)
      setCompanionStatus({
        label: `Access list · ${changeCount} change${changeCount === 1 ? '' : 's'}`,
        state: 'active',
      })
      return
    }
    setCompanionStatus({
      label: 'Run the block to explore the access list',
      state: 'idle',
    })
  },
  { immediate: true, deep: true },
)

await init()
</script>

<template>
  <ExplorationC asPageTitle explorationId="eip-7928" :exploration="exploration" :topic="topic">
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
        <div class="flex items-center gap-2">
          <ExamplesUIC v-model="example" :examples="examples" :change="selectExample" />
          <ActionButtonUIC
            text="Run block"
            tooltip="Execute block on Amsterdam VM and generate BAL"
            :onClick="runBlock"
          />
        </div>
      </div>

      <template v-if="scenario && meta">
        <ScenarioBriefView
          :scenario="scenario"
          :meta="meta"
          :result="result"
          :has-run="result !== null"
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
    <BalExplorerPanel
      v-if="scenario"
      :topic="topic"
      :groups="triggerGroups"
      :bal-json="result?.balJson"
      :active-path="activePath"
      :has-result="result !== null"
      @hover-path="setActivePath"
    />
  </Teleport>
</template>
