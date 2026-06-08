<script setup lang="ts">
import type { FrameDefinition, FrameStepResult } from '../types'
import ModeBadgeC from './ModeBadgeC.vue'

const props = defineProps<{
  frame: FrameDefinition
  index: number
  stepResult?: FrameStepResult
  isActive: boolean
  executed: boolean
}>()

const emit = defineEmits<{
  (e: 'update:dataHex', value: string): void
}>()

function onDataInput(event: Event) {
  const value = (event.target as HTMLTextAreaElement).value.replace(/[^0-9a-fA-F]/g, '')
  emit('update:dataHex', value)
}
</script>

<template>
  <div
    :class="[
      'e-result-box transition-all duration-200',
      isActive ? 'ring-2 ring-amber-400/50' : '',
    ]"
  >
    <div class="flex items-center gap-2 mb-2">
      <span class="e-result-title">Frame #{{ index }}</span>
      <ModeBadgeC :mode="frame.mode" />
      <span class="text-[10px] text-white/60 font-mono ml-auto">
        gas: {{ frame.gasLimit.toLocaleString() }}
      </span>
    </div>

    <p class="text-[11px] text-white/80 font-mono mb-2">
      {{ frame.label }}
      <span v-if="frame.targetLabel" class="text-white/50">
        &rarr; {{ frame.targetLabel }}
      </span>
    </p>

    <p class="text-[10px] text-white/50 font-mono mb-2">{{ frame.description }}</p>

    <div v-if="frame.mode !== 'VERIFY'" class="mb-2">
      <label class="text-[10px] text-white/40 font-mono block mb-0.5">Frame Data (hex)</label>
      <textarea
        v-if="!executed"
        :value="frame.dataHex"
        @input="onDataInput"
        rows="2"
        class="w-full bg-white/10 text-white/90 text-[10px] font-mono rounded p-1.5 border border-white/20 focus:border-amber-400/50 focus:outline-none resize-none"
        placeholder="auto-generated from example"
      />
      <p v-else class="text-[10px] text-white/60 font-mono break-all">
        {{ frame.dataHex || '(auto-generated)' }}
      </p>
    </div>
    <div v-else-if="frame.dataHex === ''" class="mb-2">
      <p class="text-[10px] text-white/40 font-mono italic">
        Signature data computed at execution time
      </p>
    </div>

    <div
      v-if="stepResult"
      :class="[
        'mt-2 pt-2 border-t border-white/10',
        stepResult.status === 1 ? 'text-emerald-300' : 'text-red-300',
      ]"
    >
      <div class="flex items-center gap-2 mb-1">
        <span class="text-sm">{{ stepResult.status === 1 ? '&#10003;' : '&#10007;' }}</span>
        <span class="text-[11px] font-bold font-mono">
          {{ stepResult.status === 1 ? 'Success' : 'Failed' }}
        </span>
        <span class="text-[10px] text-white/50 font-mono ml-auto">
          gas used: {{ stepResult.gasUsed.toLocaleString() }}
        </span>
      </div>
      <p class="text-[10px] font-mono text-white/70">{{ stepResult.observation }}</p>
    </div>
  </div>
</template>
