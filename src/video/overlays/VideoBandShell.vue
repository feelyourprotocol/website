<script setup lang="ts">
defineProps<{
  testId: string
  contentClass?: string
}>()
</script>

<template>
  <div class="video-card-band">
    <div class="video-card-band__peek video-card-band__peek--top" aria-hidden="true" />
    <div
      class="video-card-band__content"
      :class="contentClass"
      :data-testid="testId"
    >
      <slot />
    </div>
    <div class="video-card-band__peek video-card-band__peek--bottom" aria-hidden="true" />
  </div>
</template>
