<script setup lang="ts">
import type { VideoFocusAreaRef, VideoHighlightMarkDefinition } from '../types'
import VideoHighlightMark from './VideoHighlightMark.vue'

defineProps<{
  setId: string
  marks: VideoHighlightMarkDefinition[]
  focusAreas?: Record<string, VideoFocusAreaRef>
}>()
</script>

<template>
  <div class="video-highlight-layer" :data-testid="`video-highlights-${setId}`">
    <VideoHighlightMark
      v-for="(mark, i) in marks"
      :key="`${mark.target}-${i}`"
      :mark="mark"
      :index="i"
      :focus-areas="focusAreas"
    />
  </div>
</template>
