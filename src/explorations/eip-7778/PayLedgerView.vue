<script setup lang="ts">
import { computed } from 'vue'

import { formatGas } from './helpers'

const props = defineProps<{
  hasRun: boolean
  pay: bigint
  block: bigint
  txSuccessful: boolean
}>()

const split = computed(() => props.hasRun && props.txSuccessful && props.pay !== props.block)
const matched = computed(() => props.hasRun && props.txSuccessful && props.pay === props.block)

const status = computed(() => {
  if (!props.hasRun) return 'Run to compare what you pay with what the block counts.'
  if (!props.txSuccessful) return 'The transaction did not finish.'
  if (props.pay === props.block) return 'Same number — your bill and the block agree.'
  return 'You pay less. The block still counts the full charge.'
})
</script>

<template>
  <section data-testid="pay-ledger" class="mb-5">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[8.5rem]">
      <div class="rounded-lg border-2 e-border-dark px-4 py-4 e-bg-light">
        <p class="text-[0.65rem] font-mono uppercase tracking-widest opacity-50 mb-2">You pay</p>
        <p
          data-testid="pay-value"
          class="font-mono text-3xl font-semibold e-text tabular-nums min-h-[2.5rem]"
        >
          {{ hasRun && txSuccessful ? formatGas(pay) : '—' }}
        </p>
      </div>
      <div
        class="rounded-lg border-2 px-4 py-4"
        :class="split ? 'e-border-dark e-bg-medium' : 'e-border-dark e-bg-light'"
      >
        <p class="text-[0.65rem] font-mono uppercase tracking-widest opacity-50 mb-2">
          The block counts
        </p>
        <p
          data-testid="block-value"
          class="font-mono text-3xl font-semibold e-text tabular-nums min-h-[2.5rem]"
        >
          {{ hasRun && txSuccessful ? formatGas(block) : '—' }}
        </p>
      </div>
    </div>
    <p
      data-testid="pay-status"
      class="mt-3 text-sm min-h-[1.5rem]"
      :class="matched ? 'opacity-70' : 'e-text'"
    >
      {{ status }}
    </p>
  </section>
</template>
