<script setup lang="ts">
import { computed } from 'vue'

import VideoListFlashOverlay from './overlays/VideoListFlashOverlay.vue'
import VideoOutroCard from './overlays/VideoOutroCard.vue'
import VideoPunchOverlay from './overlays/VideoPunchOverlay.vue'
import VideoSplitOverlay from './overlays/VideoSplitOverlay.vue'
import VideoTitleCard from './overlays/VideoTitleCard.vue'
import type { VideoOverlayDefinition, VideoOverlayPlacement } from './types'

const props = defineProps<{
  overlay: VideoOverlayDefinition
  placement?: VideoOverlayPlacement
}>()

const resolvedType = computed(() => {
  const t = props.overlay.type
  if (t === 'title') return 'title-card'
  if (t === 'outro') return 'outro-card'
  if (t === 'highlight' || t === 'banner') return 'punch'
  if (t === 'body' || t === 'callout') return props.overlay.segments?.length ? 'split' : 'split'
  if (t === 'list') return 'list-flash'
  return t
})
</script>

<template>
  <VideoTitleCard v-if="resolvedType === 'title-card'" :overlay="overlay" />
  <VideoOutroCard v-else-if="resolvedType === 'outro-card'" :overlay="overlay" />
  <VideoPunchOverlay
    v-else-if="resolvedType === 'punch'"
    :overlay="overlay"
    :placement="placement"
  />
  <VideoSplitOverlay
    v-else-if="resolvedType === 'split'"
    :overlay="overlay"
    :placement="placement"
  />
  <VideoListFlashOverlay
    v-else-if="resolvedType === 'list-flash'"
    :overlay="overlay"
    :placement="placement"
  />
</template>
