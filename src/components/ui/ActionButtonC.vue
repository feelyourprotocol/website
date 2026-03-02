<script setup lang="ts">
import { nextTick,ref } from 'vue'

import TooltipC from './TooltipC.vue'

const props = defineProps<{
  text: string
  tooltip: string
  onClick: () => Promise<void>
}>()

const buttonText = ref(props.text)
const isLoading = ref(false)

const handleClick = async () => {
  isLoading.value = true
  buttonText.value = 'Loading...'
  await nextTick()
  // Double requestAnimationFrame ensures the browser has painted the update
  await new Promise((resolve) => requestAnimationFrame(resolve))
  await new Promise((resolve) => requestAnimationFrame(resolve))
  // Additional small timeout as a safety net
  await new Promise((resolve) => setTimeout(resolve, 10))
  try {
    await props.onClick()
  } finally {
    isLoading.value = false
    buttonText.value = props.text
  }
}
</script>

<template>
  <button
    @click="handleClick"
    type="button"
    :disabled="isLoading"
    class="group relative inline-flex items-center justify-center border-2 border-white rounded-lg bg-blue-100 p-2 text-xs font-bold text-blue-900 cursor-pointer hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {{ buttonText }}
    <TooltipC :tooltip="tooltip" />
  </button>
</template>
