<script setup lang="ts">
import { computed } from 'vue'

import {
  blobBreakdown,
  chargeExplanation,
  type FloorQuote,
  type HardforkChoice,
  type ShapeId,
} from './schedule'

const props = defineProps<{
  quote: FloorQuote
  shape: ShapeId
  hardfork: HardforkChoice
  hasRun: boolean
  measured?: bigint
  floorWon: boolean
  success: boolean
}>()

const math = computed(() => blobBreakdown(props.shape, props.hardfork))

const workHint = computed(() => {
  const { count, workEach } = math.value
  if (workEach === 0n) return 'No calldata bytes'
  return `${count} × ${workEach}`
})

const floorHint = computed(() => {
  const { count, floorEach } = math.value
  return `${count} × ${floorEach}`
})

const priceRows = computed(() => {
  const quiet = {
    label: 'Almost no work',
    hint: floorHint.value,
    testId: 'floor-data',
    value: props.quote.floorOnData,
    active: props.shape !== 'busy',
  }
  const real = {
    label: 'Real work',
    hint: workHint.value,
    testId: 'ordinary-calldata',
    value: props.quote.ordinaryCalldata,
    active: props.shape === 'busy',
  }
  return props.shape === 'busy' ? [real, quiet] : [quiet, real]
})

const chargeHint = computed(() =>
  props.hasRun && props.measured !== undefined
    ? chargeExplanation(
        props.quote,
        props.measured,
        props.shape === 'busy' ? 'work' : 'floor',
        props.shape === 'access-list' ? 'access list' : 'work',
      )
    : '',
)

function formatGas(value: bigint): string {
  return value.toLocaleString('en-US')
}

const measuredLabel = () => {
  if (!props.hasRun || props.measured === undefined) return '—'
  return formatGas(props.measured)
}

const verdict = () => {
  if (!props.hasRun) return 'Pricing this transaction.'
  if (!props.success) return 'The transaction did not complete.'
  if (props.shape === 'access-list') {
    return props.hardfork === 'glamsterdam'
      ? 'The listed bytes paid the floor. The access-list fee is separate.'
      : 'The listed bytes are not on the floor. Only the access-list fee remains.'
  }
  if (props.floorWon) return 'The floor set the price.'
  return 'Real work set the price. Each byte stayed at 4 or 16.'
}
</script>

<template>
  <div
    data-testid="floor-compare"
    class="rounded-lg border e-border overflow-hidden"
    :data-has-run="hasRun ? 'true' : 'false'"
    :data-floor-won="hasRun && floorWon ? 'true' : 'false'"
  >
    <div class="px-4 py-3 border-b e-border min-h-[2.75rem]">
      <p class="text-[0.65rem] font-mono uppercase tracking-widest opacity-45">
        All of these bytes
      </p>
    </div>

    <div class="px-4 py-4 space-y-3 text-sm">
      <div
        v-for="row in priceRows"
        :key="row.testId"
        class="flex justify-between gap-3 min-h-6 items-baseline"
        :class="row.active ? '' : 'opacity-45'"
      >
        <span>
          {{ row.label }}
          <span class="block text-xs font-mono opacity-70">{{ row.hint }}</span>
        </span>
        <span :data-testid="row.testId" class="font-mono e-text font-semibold">
          {{ formatGas(row.value) }}
        </span>
      </div>
      <div class="flex justify-between gap-3 border-t e-border pt-3 min-h-6">
        <span class="opacity-70">Charged by the run</span>
        <span
          data-testid="charged"
          class="font-mono font-semibold"
          :class="hasRun ? 'e-text' : 'opacity-40'"
          :data-success="hasRun && success ? 'true' : 'false'"
        >
          {{ measuredLabel() }}
        </span>
      </div>
      <p v-if="chargeHint" data-testid="charge-hint" class="text-xs font-mono opacity-70 -mt-1">
        {{ chargeHint }}
      </p>
      <p data-testid="floor-verdict" class="text-[0.65rem] font-mono opacity-70 min-h-[2rem]">
        {{ verdict() }}
      </p>
    </div>
  </div>
</template>
