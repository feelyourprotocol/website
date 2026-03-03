<script setup lang="ts">
defineProps<{
  title: string
  left?: boolean
  infoText?: string
  errorText?: string
}>()
</script>

<template>
  <div :class="['e-result-box', left ? 'text-left pre-hardfork' : 'text-right post-hardfork']">
    <div class="mb-2.5">
      <span class="e-result-title">{{ title }}</span>
    </div>
    <slot />
    <div v-if="errorText" class="e-result-text-sm m-5 text-center">
      <p class="text-red-400">{{ errorText }}</p>
      <p class="mt-2">(Wrong error? Report on GitHub.)</p>
    </div>
    <p v-else-if="infoText" class="e-result-text-sm m-5 text-center">{{ infoText }}</p>
  </div>
</template>
