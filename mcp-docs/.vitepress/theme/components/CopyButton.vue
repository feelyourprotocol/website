<script setup lang="ts">
import { useCopy } from '../composables/useCopy'

const props = withDefaults(
  defineProps<{
    text: string
    label?: string
    copiedLabel?: string
  }>(),
  { label: 'Copy', copiedLabel: 'Copied' },
)

const { copied, copy } = useCopy()
</script>

<template>
  <button
    type="button"
    class="fyp-copy-btn"
    :class="{ 'fyp-copy-btn--done': copied }"
    data-testid="copy-button"
    :aria-label="copied ? props.copiedLabel : `${props.label} to clipboard`"
    @click="copy(props.text)"
  >
    {{ copied ? props.copiedLabel : props.label }}
  </button>
</template>
