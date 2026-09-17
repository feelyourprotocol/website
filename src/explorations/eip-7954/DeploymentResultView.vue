<script setup lang="ts">
import { computed } from 'vue'

import type { DeploymentOutcome, RunScenarioOutput } from './run'
import {
  type DeploymentScenario,
  GLAMSTERDAM_INITCODE_LIMIT,
  GLAMSTERDAM_RUNTIME_LIMIT,
  limitsForDimension,
} from './scenarios'

const props = defineProps<{
  scenario: DeploymentScenario
  result?: RunScenarioOutput | null
}>()

const limits = computed(() => limitsForDimension(props.scenario.dimension))
const hasRun = computed(() => props.result !== null && props.result !== undefined)
const newLimit = computed(() =>
  props.scenario.dimension === 'runtime-code'
    ? GLAMSTERDAM_RUNTIME_LIMIT
    : GLAMSTERDAM_INITCODE_LIMIT,
)
const targetWidth = computed(() => Math.min(100, (props.scenario.sizeBytes / newLimit.value) * 100))
const oldMarker = computed(() => (limits.value.fusaka / newLimit.value) * 100)

function formatSize(bytes: number): string {
  if (bytes % 1024 === 0) return `${bytes / 1024} KiB`
  return `${(bytes / 1024).toFixed(3)} KiB (${bytes.toLocaleString('en-US')} bytes)`
}

function outcomeText(outcome: DeploymentOutcome | undefined): string {
  if (outcome === undefined) return 'Run to test'
  if (!outcome.accepted) return `Rejected · ${outcome.error ?? 'deployment failed'}`
  if (props.scenario.dimension === 'runtime-code') {
    return `Accepted · ${formatSize(outcome.deployedCodeBytes)} deployed`
  }
  return 'Accepted · initcode executed'
}
</script>

<template>
  <section
    data-testid="deployment-results"
    :data-has-run="hasRun ? 'true' : 'false'"
    class="rounded-lg border-2 e-border-dark overflow-hidden mb-5 bg-white/40 min-h-[20rem]"
  >
    <header class="px-4 py-3 e-bg-medium border-b e-border">
      <p class="text-xs font-mono uppercase tracking-widest opacity-50 mb-1">
        {{
          scenario.dimension === 'runtime-code' ? 'Deployed runtime code' : 'Deployment initcode'
        }}
      </p>
      <h2 class="font-semibold e-text text-lg leading-snug">{{ scenario.title }}</h2>
      <p class="text-sm leading-relaxed opacity-75 mt-1.5 max-w-3xl">{{ scenario.lesson }}</p>
    </header>

    <div class="px-4 py-4 border-b e-border">
      <div class="flex items-baseline justify-between gap-3 mb-2">
        <span class="text-[0.65rem] font-mono uppercase tracking-widest opacity-50">Target</span>
        <strong class="font-mono text-sm e-text">{{ formatSize(scenario.sizeBytes) }}</strong>
      </div>
      <div class="relative h-3 rounded-full e-bg-light border e-border overflow-visible">
        <div
          class="h-full e-bg-dark rounded-full"
          :style="{ width: `${targetWidth}%` }"
          aria-hidden="true"
        />
        <div
          class="absolute -top-1 h-5 border-l-2 e-border-dark"
          :style="{ left: `${oldMarker}%` }"
          aria-hidden="true"
        />
      </div>
      <div class="relative h-7 mt-1 text-[0.65rem] font-mono opacity-60">
        <span class="absolute -translate-x-1/2" :style="{ left: `${oldMarker}%` }">
          Fusaka {{ formatSize(limits.fusaka) }}
        </span>
        <span class="absolute right-0">Glamsterdam {{ formatSize(limits.glamsterdam) }}</span>
      </div>
    </div>

    <div class="grid gap-3 p-4 sm:grid-cols-2">
      <article class="rounded-md border e-border overflow-hidden min-h-[6.5rem]">
        <div class="px-3 py-2 border-b e-border text-xs font-mono font-semibold">Fusaka</div>
        <p
          class="px-3 py-3 text-sm min-h-[4.25rem]"
          :class="
            result?.fusaka
              ? result.fusaka.accepted
                ? 'e-bg-medium e-text'
                : 'e-bg-dark text-white'
              : 'opacity-45'
          "
          data-testid="outcome-fusaka"
        >
          {{ outcomeText(result?.fusaka) }}
        </p>
      </article>

      <article class="rounded-md border e-border overflow-hidden min-h-[6.5rem]">
        <div class="px-3 py-2 border-b e-border text-xs font-mono font-semibold">Glamsterdam</div>
        <p
          class="px-3 py-3 text-sm min-h-[4.25rem]"
          :class="
            result?.glamsterdam
              ? result.glamsterdam.accepted
                ? 'e-bg-medium e-text'
                : 'e-bg-dark text-white'
              : 'opacity-45'
          "
          data-testid="outcome-glamsterdam"
        >
          {{ outcomeText(result?.glamsterdam) }}
        </p>
      </article>
    </div>
  </section>
</template>
