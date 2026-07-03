<script setup lang="ts">
import { computed } from 'vue'

import type { VideoOverlayDefinition, VideoOverlayPlacement } from '../types'

const props = defineProps<{
  overlay: VideoOverlayDefinition
  placement?: VideoOverlayPlacement
}>()

const positionClass = computed(() => {
  const p = props.placement ?? props.overlay.placement ?? props.overlay.position ?? 'top'
  if (p === 'top-banner') return 'video-punch--top-banner'
  if (p === 'bottom-banner') return 'video-punch--bottom-banner'
  return `video-punch--${p === 'top' || p === 'center' || p === 'bottom' ? p : 'top'}`
})
</script>

<template>
  <div class="video-punch" :class="positionClass">
    <p
      class="video-punch__text"
      :class="overlay.invert ? 'video-punch__text--white' : ''"
    >
      {{ overlay.text }}
    </p>
    <p v-if="overlay.sub" class="video-punch__sub">{{ overlay.sub }}</p>
  </div>
</template>
