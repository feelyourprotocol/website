<script setup lang="ts">
defineProps<{
  title: string
  left?: boolean
}>()
</script>

<template>
  <div :class="['e-result-box', left ? 'text-left pre-hardfork' : 'text-right post-hardfork']">
    <div class="mb-2.5">
      <span class="e-result-title">{{ title }}</span>
    </div>
    <slot />
  </div>
</template>
