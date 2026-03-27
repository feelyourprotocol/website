<script setup lang="ts">
import type { FrameTxExecutionResult } from '../types'

defineProps<{
  result: FrameTxExecutionResult
  allRevealed: boolean
}>()

function formatWei(val: bigint): string {
  if (val >= 1_000_000_000_000_000n) return (Number(val) / 1e18).toFixed(6) + ' ETH'
  return val.toLocaleString() + ' wei'
}
</script>

<template>
  <div v-if="allRevealed" class="e-result-box">
    <div class="flex items-center gap-2 mb-2">
      <span class="e-result-title">Transaction Summary</span>
      <span
        :class="[
          'text-[10px] font-bold font-mono px-1.5 py-0.5 rounded',
          result.success
            ? 'bg-emerald-600/30 text-emerald-300'
            : 'bg-red-600/30 text-red-300',
        ]"
      >
        {{ result.success ? 'SUCCESS' : 'REJECTED' }}
      </span>
    </div>

    <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-mono text-white/70">
      <span class="text-white/40">tx type</span>
      <span>0x{{ result.txType.toString(16).padStart(2, '0') }} (Frame)</span>

      <span class="text-white/40">gas limit</span>
      <span>{{ result.gasLimit.toLocaleString() }}</span>

      <span class="text-white/40">total gas used</span>
      <span>{{ result.totalGasSpent.toLocaleString() }}</span>

      <span class="text-white/40">frames executed</span>
      <span>{{ result.frameSteps.length }}</span>
    </div>

    <div v-if="result.error" class="mt-2 text-[10px] font-mono text-red-300/90">
      Error: {{ result.error }}
    </div>

    <div v-if="Object.keys(result.recipientBalances).length > 0" class="mt-3 pt-2 border-t border-white/10">
      <span class="text-[10px] font-mono text-white/40 block mb-1">Recipient Balances</span>
      <div
        v-for="(balance, addr) in result.recipientBalances"
        :key="String(addr)"
        class="flex justify-between text-[10px] font-mono text-white/70"
      >
        <span class="truncate max-w-[60%]">{{ addr }}</span>
        <span class="text-emerald-300">{{ formatWei(balance) }}</span>
      </div>
    </div>
  </div>
</template>
