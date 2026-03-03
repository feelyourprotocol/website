<script setup lang="ts">
import { nextTick, ref } from 'vue'

import TooltipC from './TooltipC.vue'

const props = defineProps<{
  text: string
  tooltip: string
  onClick: () => Promise<void>
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
</script>

<template>
  <button @click="handleClick" type="button" :disabled="isLoading" class="group e-action-button">
    {{ buttonText }}
    <TooltipC :tooltip="tooltip" />
  </button>
</template>
