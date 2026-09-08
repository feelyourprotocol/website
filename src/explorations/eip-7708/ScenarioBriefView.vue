<script setup lang="ts">
import { computed } from 'vue'

import type { TransferExampleMeta } from './examples'
import type { RunScenarioOutput } from './run'
import { formatPreStateChips } from './scenarios/helpers'
import type { TransferScenarioDefinition } from './scenarios/types'

const props = defineProps<{
  scenario: TransferScenarioDefinition
  meta: TransferExampleMeta
  result?: RunScenarioOutput | null
  hasRun: boolean
  hardfork: 'amsterdam' | 'osaka'
}>()

const preStateChips = computed(() => formatPreStateChips(props.scenario.preState))

const outcomeLine = computed(() => {
  if (!props.hasRun || !props.result) return null
  const { transferLogCount, hardforkLabel } = props.result
  if (transferLogCount === 0) {
    return `${hardforkLabel}: no EIP-7708 Transfer logs in the receipt.`
  }
  return `${hardforkLabel}: ${transferLogCount} EIP-7708 Transfer log${transferLogCount === 1 ? '' : 's'}.`
})

const expectationMet = computed(() => {
  if (!props.hasRun || !props.result || props.hardfork !== 'amsterdam') return null
  return props.result.transferLogCount === props.scenario.expectedTransferLogsOnAmsterdam
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
      <p class="text-xs opacity-60 mt-0.5">{{ scenario.txSummary[0]!.detail }}</p>
    </div>

    <footer
      class="px-4 py-2.5 text-xs font-mono border-t e-border min-h-[4.5rem]"
      :class="
        outcomeLine
          ? expectationMet === false
            ? 'e-bg-dark text-white/90'
            : 'e-bg-medium e-text'
          : 'e-bg-medium'
      "
    >
      <p v-if="outcomeLine">{{ outcomeLine }}</p>
      <p v-else class="opacity-50">Run the block to inspect receipt logs.</p>
      <span
        class="block mt-1 min-h-[1.25rem]"
        :class="expectationMet === false ? 'opacity-80' : 'invisible'"
      >
        Expected {{ scenario.expectedTransferLogsOnAmsterdam }} Transfer log(s) on Amsterdam — check
        the scenario or hardfork.
      </span>
      <span
        class="block mt-1 min-h-[1.25rem]"
        :class="hardfork === 'osaka' && hasRun ? 'opacity-70' : 'invisible'"
      >
        Switch to Amsterdam on the same scenario to see EIP-7708 logs appear.
      </span>
    </footer>
  </section>
</template>
