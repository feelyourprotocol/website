<script setup lang="ts">
import { computed } from 'vue'

import { CLASSIC_GAS_LIMIT } from './scenarios/constants'
import { formatGas } from './scenarios/helpers'

const props = defineProps<{
  regular: bigint
  state: bigint
  gasLimit: bigint
  txSuccessful: boolean
}>()

const scaleMax = computed(() => {
  const values = [props.regular, props.state, CLASSIC_GAS_LIMIT, props.gasLimit]
  let max = 0n
  for (const value of values) {
    if (value > max) max = value
  }
  return max === 0n ? 1n : max
})

function pct(value: bigint): number {
  return Number((value * 10_000n) / scaleMax.value) / 100
}

const classicPct = computed(() => pct(CLASSIC_GAS_LIMIT))
const regularPct = computed(() => pct(props.regular))
const statePct = computed(() => pct(props.state))
</script>

<template>
  <div data-testid="gas-bars" class="rounded-lg border e-border overflow-hidden">
    <div class="px-4 py-3 border-b e-border flex flex-wrap items-baseline justify-between gap-2">
      <p class="text-[0.65rem] font-mono uppercase tracking-widest opacity-45">Gas dimensions</p>
      <p class="text-xs font-mono opacity-70">
        gasLimit {{ formatGas(gasLimit) }}
        <span v-if="!txSuccessful" class="e-text font-semibold"> · out of gas</span>
      </p>
    </div>

    <div class="px-4 py-4 space-y-4">
      <div>
        <div class="flex justify-between text-xs font-mono mb-1">
          <span class="opacity-70">Execution</span>
          <span class="e-text font-semibold">{{ formatGas(regular) }}</span>
        </div>
        <div class="relative h-4 rounded e-bg-medium overflow-hidden">
          <div class="h-full e-bg-dark" :style="{ width: `${regularPct}%` }" />
          <div
            class="absolute top-0 bottom-0 border-l-2 border-dashed e-border-dark"
            :style="{ left: `${classicPct}%` }"
            title="21,000 marker"
          />
        </div>
      </div>

      <div>
        <div class="flex justify-between text-xs font-mono mb-1">
          <span class="opacity-70">State</span>
          <span class="e-text font-semibold">{{ formatGas(state) }}</span>
        </div>
        <div class="relative h-4 rounded e-bg-medium overflow-hidden">
          <div
            class="h-full"
            :style="{ width: `${statePct}%`, backgroundColor: 'var(--e-accent)' }"
          />
          <div
            class="absolute top-0 bottom-0 border-l-2 border-dashed e-border-dark"
            :style="{ left: `${classicPct}%` }"
            title="21,000 marker"
          />
        </div>
      </div>

      <p class="text-[0.65rem] font-mono opacity-55">
        Dashed line = 21,000 (classic transfer limit). Scale max
        {{ formatGas(scaleMax) }}.
      </p>
    </div>
  </div>
</template>
