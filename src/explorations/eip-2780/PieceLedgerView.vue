<script setup lang="ts">
import type { IntrinsicPieces } from './pieces'

const props = defineProps<{
  pieces: IntrinsicPieces
  hasRun: boolean
  measured?: bigint
  success: boolean
}>()

function formatGas(value: bigint): string {
  return value.toLocaleString('en-US')
}

function pieceLabel(value: bigint | null, split: boolean): string {
  if (!split) return 'Inside the flat 21,000'
  if (value === null) return 'Not charged'
  return formatGas(value)
}

const measuredLabel = () => {
  if (!props.hasRun || props.measured === undefined) return '—'
  return formatGas(props.measured)
}

const mismatch = () =>
  props.hasRun && props.measured !== undefined && props.measured !== props.pieces.total
</script>

<template>
  <div
    data-testid="piece-ledger"
    class="rounded-lg border e-border overflow-hidden"
    :data-has-run="hasRun ? 'true' : 'false'"
    :data-split="pieces.split ? 'true' : 'false'"
  >
    <div class="px-4 py-3 border-b e-border min-h-[2.75rem]">
      <p class="text-[0.65rem] font-mono uppercase tracking-widest opacity-45">
        {{ pieces.split ? 'Intrinsic pieces' : 'Flat intrinsic' }}
      </p>
    </div>

    <div class="px-4 py-4 space-y-3 text-sm">
      <div class="flex justify-between gap-3 min-h-6">
        <span class="opacity-70">Sender</span>
        <span data-testid="piece-base" class="font-mono e-text font-semibold">
          {{ pieceLabel(pieces.base, pieces.split) }}
        </span>
      </div>
      <div class="flex justify-between gap-3 min-h-6">
        <span class="opacity-70">Recipient touch</span>
        <span data-testid="piece-recipient" class="font-mono e-text font-semibold">
          {{ pieceLabel(pieces.recipient, pieces.split) }}
        </span>
      </div>
      <div class="flex justify-between gap-3 min-h-6">
        <span class="opacity-70">Value and transfer log</span>
        <span data-testid="piece-value" class="font-mono e-text font-semibold">
          {{ pieceLabel(pieces.value, pieces.split) }}
        </span>
      </div>
      <div class="flex justify-between gap-3 border-t e-border pt-3 min-h-6">
        <span class="opacity-70">Schedule total</span>
        <span data-testid="piece-total" class="font-mono e-text font-semibold">
          {{ formatGas(pieces.total) }}
        </span>
      </div>
      <div class="flex justify-between gap-3 min-h-6">
        <span class="opacity-70">Charged by the run</span>
        <span
          data-testid="piece-measured"
          class="font-mono font-semibold"
          :class="hasRun ? 'e-text' : 'opacity-40'"
          :data-mismatch="mismatch() ? 'true' : 'false'"
          :data-success="hasRun && success ? 'true' : 'false'"
        >
          {{ measuredLabel() }}
        </span>
      </div>
      <p class="text-[0.65rem] font-mono opacity-55 min-h-[2rem]">
        <template v-if="!hasRun">Run the transaction to fill the charged total.</template>
        <template v-else-if="mismatch()">
          The charged total does not match the schedule. The numbers above are what the spec prices;
          the run is what this client charged.
        </template>
        <template v-else-if="!success">The transaction did not succeed.</template>
        <template v-else-if="pieces.split && pieces.total === 21000n">
          The charged total matches the pieces. A normal send is still 21,000.
        </template>
        <template v-else-if="pieces.split && pieces.total === 12000n">
          The charged total matches the pieces. A self-send keeps only the 12,000.
        </template>
        <template v-else-if="pieces.split">
          The charged total matches the pieces. No value moved, so this call is 15,000.
        </template>
        <template v-else>Fusaka still charges one flat 21,000 for each of these shapes.</template>
      </p>
    </div>
  </div>
</template>
