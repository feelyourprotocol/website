<script setup lang="ts">
import { computed } from 'vue'

import type { GasExampleMeta } from './examples'
import type { RunScenarioOutput } from './run'
import { displayGasBars } from './run'
import { formatGas, formatPreStateChips } from './scenarios/helpers'
import type { GasScenarioDefinition } from './scenarios/types'

const props = defineProps<{
  scenario: GasScenarioDefinition
  meta: GasExampleMeta
  result?: RunScenarioOutput | null
  hasRun: boolean
  hardfork: 'amsterdam' | 'osaka'
}>()

const preStateChips = computed(() => formatPreStateChips(props.scenario.preState))

const outcomeLine = computed(() => {
  if (!props.hasRun || !props.result) return null
  const bars = displayGasBars(props.result)
  if (!props.result.txSuccessful) {
    return `${props.result.hardforkLabel}: out of gas at gasLimit ${formatGas(props.result.gasLimit)} — needed about ${formatGas(bars.regular + bars.state)}.`
  }
  return `${props.result.hardforkLabel}: execution ${formatGas(bars.regular)} · state ${formatGas(bars.state)}.`
})
</script>

<template>
  <section class="rounded-lg border-2 e-border-dark overflow-hidden mb-5 bg-white/40">
    <header class="px-4 py-3 e-bg-medium border-b e-border">
      <p class="text-xs font-mono uppercase tracking-widest opacity-50 mb-1">Scenario</p>
      <h2 class="font-semibold e-text text-lg leading-snug">{{ meta.title }}</h2>
      <p class="text-sm leading-relaxed opacity-75 mt-1.5 max-w-3xl">{{ meta.lesson }}</p>
    </header>

    <div class="px-4 py-3 border-b e-border">
      <p class="text-[0.65rem] font-mono uppercase tracking-widest opacity-45 mb-2">
        Accounts before execution
      </p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="chip in preStateChips"
          :key="chip"
          class="text-xs font-mono px-2 py-1 rounded border e-border e-bg-light"
        >
          {{ chip }}
        </span>
      </div>
    </div>

    <div class="px-4 py-3 border-b e-border">
      <p class="text-[0.65rem] font-mono uppercase tracking-widest opacity-45 mb-1">Transaction</p>
      <p class="font-medium e-text text-sm">{{ scenario.txSummary[0]!.label }}</p>
      <p class="text-xs opacity-60 mt-0.5 break-all">{{ scenario.txSummary[0]!.detail }}</p>
    </div>

    <footer
      class="px-4 py-2.5 text-xs font-mono border-t e-border min-h-[3.5rem]"
      :class="
        outcomeLine
          ? result?.txSuccessful
            ? 'e-bg-medium e-text'
            : 'e-bg-dark text-white/90'
          : 'e-bg-medium'
      "
    >
      <p v-if="outcomeLine">{{ outcomeLine }}</p>
      <p v-else class="opacity-50">Run the transaction to compare execution vs state gas.</p>
    </footer>
  </section>
</template>
