<script setup lang="ts">
import { computed, toRef } from 'vue'

import { resolveTargetSelector } from '../annotationTarget'
import type { VideoFocusAreaRef, VideoHighlightMarkDefinition } from '../types'
import { useTargetRect } from '../useTargetRect'

const props = defineProps<{
  mark: VideoHighlightMarkDefinition
  focusAreas?: Record<string, VideoFocusAreaRef>
  index?: number
}>()

const selector = computed(() => resolveTargetSelector(props.mark.target, props.focusAreas))

const targetRect = useTargetRect(toRef(selector))

const markStyle = computed(() => {
  const r = targetRect.value
  if (!r) return { display: 'none' }
  const padX = props.mark.padX ?? props.mark.pad ?? 10
  const padY = props.mark.padY ?? props.mark.pad ?? 12
  return {
    top: `${r.top - padY}px`,
    left: `${r.left - padX}px`,
    width: `${r.width + padX * 2}px`,
    height: `${r.height + padY * 2}px`,
  }
})
</script>

<template>
  <div v-if="targetRect" class="video-highlight-mark" :style="markStyle" aria-hidden="true" />
</template>
