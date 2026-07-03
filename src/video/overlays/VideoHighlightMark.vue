<script setup lang="ts">
import { computed, toRef } from 'vue'

import { resolveTargetSelector } from '../annotationTarget'
import { useTargetRect } from '../useTargetRect'
import type { VideoFocusAreaRef, VideoHighlightMarkDefinition } from '../types'

const props = defineProps<{
  mark: VideoHighlightMarkDefinition
  focusAreas?: Record<string, VideoFocusAreaRef>
  index?: number
}>()

const selector = computed(() =>
  resolveTargetSelector(props.mark.target, props.focusAreas),
)

const targetRect = useTargetRect(toRef(selector))

const markStyle = computed(() => {
  const r = targetRect.value
  if (!r) return { display: 'none' }
  const padX = props.mark.pad ?? 2
  const padY = props.mark.pad ?? 1
  return {
    top: `${r.top - padY}px`,
    left: `${r.left - padX}px`,
    width: `${r.width + padX * 2}px`,
    height: `${r.height + padY * 2}px`,
    '--mark-tilt': `${props.mark.tilt ?? ((props.index ?? 0) % 2 === 0 ? -0.55 : 0.45)}deg`,
  }
})
</script>

<template>
  <div v-if="targetRect" class="video-highlight-mark" :style="markStyle" aria-hidden="true" />
</template>
