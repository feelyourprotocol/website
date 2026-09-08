<script setup lang="ts">
import { computed } from 'vue'

import type { GasLimitMode } from './run'
import { CLASSIC_GAS_LIMIT, EXECUTION_HEADROOM_GAS_LIMIT } from './scenarios/constants'
import { formatGas } from './scenarios/helpers'

const props = defineProps<{
  hasRun: boolean
  regular: bigint
  state: bigint
  gasLimit: bigint
  txSuccessful: boolean
  gasLimitMode: GasLimitMode
}>()

/** Idle scale — tall enough for every scenario’s post-run bars so layout does not shift. */
const IDLE_SCALE_MAX = EXECUTION_HEADROOM_GAS_LIMIT

const scaleMax = computed(() => {
  if (!props.hasRun) return IDLE_SCALE_MAX
  const values = [props.regular, props.state, CLASSIC_GAS_LIMIT, props.gasLimit]
  let max = 0n
  for (const value of values) {
    if (value > max) max = value
  }
  return max === 0n ? 1n : max
})

function barPct(value: bigint): number {
  if (!props.hasRun || value === 0n) return 0
  const raw = Number((value * 10_000n) / scaleMax.value) / 100
  return raw > 0 && raw < 1.5 ? 1.5 : raw
}

function markerPct(value: bigint): number {
  return Number((value * 10_000n) / scaleMax.value) / 100
}

const classicPct = computed(() => markerPct(CLASSIC_GAS_LIMIT))
const regularPct = computed(() => barPct(props.regular))
const statePct = computed(() => barPct(props.state))

const gasLimitLabel = computed(() => {
  if (props.hasRun) return formatGas(props.gasLimit)
  return props.gasLimitMode === 'classic' ? formatGas(CLASSIC_GAS_LIMIT) : 'Recommended'
})

const showOutOfGas = computed(() => props.hasRun && !props.txSuccessful)
</script>

<template>
  <div
    data-testid="gas-bars"
    class="rounded-lg border e-border overflow-hidden"
    :data-has-run="hasRun ? 'true' : 'false'"
  >
    <div
      class="px-4 py-3 border-b e-border flex flex-wrap items-baseline justify-between gap-2 min-h-[2.75rem]"
    >
      <p class="text-[0.65rem] font-mono uppercase tracking-widest opacity-45">Gas dimensions</p>
      <p class="text-xs font-mono opacity-70">
        Gas limit {{ gasLimitLabel }}
        <span v-if="showOutOfGas" class="e-text font-semibold"> · out of gas</span>
      </p>
    </div>

    <div class="px-4 py-4 space-y-4">
      <div>
        <div class="flex justify-between text-xs font-mono mb-1">
          <span class="opacity-70">Execution</span>
          <span class="e-text font-semibold" :class="hasRun ? '' : 'opacity-40'">
            {{ hasRun ? formatGas(regular) : '—' }}
          </span>
        </div>
        <div class="relative h-4 rounded e-bg-medium overflow-hidden">
          <div
            class="h-full e-bg-dark transition-[width] duration-150"
            :style="{ width: `${regularPct}%` }"
          />
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
          <span class="e-text font-semibold" :class="hasRun ? '' : 'opacity-40'">
            {{ hasRun ? formatGas(state) : '—' }}
          </span>
        </div>
        <div class="relative h-4 rounded e-bg-medium overflow-hidden">
          <div
            class="h-full transition-[width] duration-150"
            :style="{ width: `${statePct}%`, backgroundColor: 'var(--e-accent)' }"
          />
          <div
            class="absolute top-0 bottom-0 border-l-2 border-dashed e-border-dark"
            :style="{ left: `${classicPct}%` }"
            title="21,000 marker"
          />
        </div>
      </div>

      <p class="text-[0.65rem] font-mono opacity-55 min-h-[2rem]">
        <template v-if="hasRun">
          Dashed line = 21,000 (classic transfer limit). Scale max
          {{ formatGas(scaleMax) }}.
        </template>
        <template v-else>
          Dashed line = 21,000 (classic transfer limit). Run tx to fill execution and state bars.
        </template>
      </p>
    </div>
  </div>
</template>
