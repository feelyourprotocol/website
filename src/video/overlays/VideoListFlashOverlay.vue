<script setup lang="ts">
import { computed } from 'vue'

import type { VideoOverlayDefinition, VideoOverlayPlacement } from '../types'

const props = defineProps<{
  overlay: VideoOverlayDefinition
  placement?: VideoOverlayPlacement
}>()

const effectivePlacement = computed(
  () => props.placement ?? props.overlay.placement ?? 'top-banner',
)

const bannerClass = computed(() =>
  effectivePlacement.value === 'bottom-banner'
    ? 'video-banner--bottom-banner'
    : 'video-banner--top-banner',
)
</script>

<template>
  <div class="video-banner video-banner--list" :class="bannerClass">
    <p v-if="overlay.headline" class="video-banner__line video-banner__line--accent">
      {{ overlay.headline }}
    </p>
    <p
      v-for="(item, i) in overlay.items"
      :key="i"
      class="video-banner__line video-banner__line--sub"
    >
      {{ item }}
    </p>
  </div>
</template>
