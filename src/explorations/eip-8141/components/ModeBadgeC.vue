<script setup lang="ts">
import type { FrameMode } from '../types'

defineProps<{ mode: FrameMode }>()

const colors: Record<FrameMode, string> = {
  VERIFY: 'bg-amber-600 text-white',
  SENDER: 'bg-blue-600 text-white',
  DEFAULT: 'bg-slate-500 text-white',
}
</script>

<template>
  <span :class="[colors[mode], 'inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase']">
    {{ mode }}
  </span>
</template>
