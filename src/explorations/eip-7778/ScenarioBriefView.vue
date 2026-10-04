<script setup lang="ts">
import { computed } from 'vue'

import type { RefundExampleMeta } from './examples'
import { formatGas, formatPreStateChips } from './helpers'
import type { RunScenarioOutput } from './run'
import type { RefundScenarioDefinition } from './types'

const props = defineProps<{
  scenario: RefundScenarioDefinition
  meta: RefundExampleMeta
  result?: RunScenarioOutput | null
  hasRun: boolean
}>()

const preStateChips = computed(() => formatPreStateChips(props.scenario.preState))

const outcomeLine = computed(() => {
  if (!props.hasRun || !props.result) return null
  if (!props.result.txSuccessful) {
    return `${props.result.hardforkLabel}: the transaction failed${props.result.exceptionError ? ` (${props.result.exceptionError})` : ''}.`
  }
  const pay = formatGas(props.result.pay)
  const block = formatGas(props.result.block)
  if (props.result.pay === props.result.block) {
    return `${props.result.hardforkLabel}: you pay ${pay}. The block counts the same.`
  }
  return `${props.result.hardforkLabel}: you pay ${pay}. The block counts ${block}.`
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
      <p class="font-medium e-text text-sm">{{ scenario.programSummary[0]!.label }}</p>
      <p class="text-xs opacity-60 mt-0.5 break-all">{{ scenario.programSummary[0]!.detail }}</p>
    </div>

    <footer
      class="px-4 py-2.5 text-xs font-mono border-t e-border min-h-[3.5rem]"
      :class="outcomeLine ? 'e-bg-medium e-text' : 'e-bg-medium'"
    >
      <p v-if="outcomeLine">{{ outcomeLine }}</p>
      <p v-else class="opacity-50">Run the transaction to compare your bill with the block.</p>
    </footer>
  </section>
</template>
