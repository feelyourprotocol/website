<script setup lang="ts">
defineProps<{
  label?: string
  canGoPrev: boolean
  canGoNext: boolean
}>()

const emit = defineEmits<{
  prev: []
  next: []
}>()
</script>

<template>
  <button
    type="button"
    class="e-select px-2 py-1 text-xs disabled:opacity-40"
    data-testid="scenario-step-prev"
    :disabled="!canGoPrev"
    @click="emit('prev')"
  >
    ← prev
  </button>
  <span v-if="label" class="font-mono text-xs opacity-70" data-testid="scenario-step-label">{{
    label
  }}</span>
  <button
    type="button"
    class="e-select px-2 py-1 text-xs disabled:opacity-40"
    data-testid="scenario-step-next"
    :disabled="!canGoNext"
    @click="emit('next')"
  >
    next →
  </button>
</template>
