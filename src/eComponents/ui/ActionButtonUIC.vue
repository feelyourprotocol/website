<script setup lang="ts">
import { nextTick, ref } from 'vue'

import type { HelpHintTier } from './helpHint/resolveHelpHintMode'
import HelpHintUIC from './HelpHintUIC.vue'

const props = defineProps<{
  text: string
  tooltip: string
  onClick: () => Promise<void>
  testId?: string
  hintTier?: HelpHintTier
}>()

const buttonText = ref(props.text)
const isLoading = ref(false)

async function handleClick() {
  isLoading.value = true
  buttonText.value = 'Loading...'
  await nextTick()
  await new Promise((resolve) => requestAnimationFrame(resolve))
  await new Promise((resolve) => requestAnimationFrame(resolve))
  await new Promise((resolve) => setTimeout(resolve, 10))
  try {
    await props.onClick()
  } finally {
    isLoading.value = false
    buttonText.value = props.text
  }
}

const accessibleLabel = props.tooltip ? `${props.text}. ${props.tooltip}` : props.text
</script>

<template>
  <HelpHintUIC
    :text="tooltip"
    :tier="hintTier ?? 'useful'"
    host-class="inline-flex flex-col items-stretch gap-1"
    inline-class="text-right"
  >
    <button
      @click="handleClick"
      type="button"
      :disabled="isLoading"
      class="e-action-button"
      :data-testid="testId"
      :aria-label="accessibleLabel"
    >
      {{ buttonText }}
    </button>
  </HelpHintUIC>
</template>
