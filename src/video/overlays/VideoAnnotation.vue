<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import {
  collectTopBannerRects,
  pickCalloutSide,
  resolveTargetSelector,
  targetOverlapsTopBanner,
} from '../annotationTarget'
import type { VideoAnnotationDefinition, VideoFocusAreaRef } from '../types'

const props = defineProps<{
  annotation: VideoAnnotationDefinition
  focusAreas?: Record<string, VideoFocusAreaRef>
}>()

const targetRect = ref<DOMRect | null>(null)
const calloutSide = ref<'top' | 'bottom' | 'left' | 'right'>('bottom')
const suppressedByBanner = ref(false)

const selector = computed(() => resolveTargetSelector(props.annotation.target, props.focusAreas))

function measure() {
  const el = document.querySelector(selector.value)
  if (!el) {
    targetRect.value = null
    return
  }
  const rect = el.getBoundingClientRect()
  if (rect.width <= 0 && rect.height <= 0) {
    targetRect.value = null
    return
  }
  targetRect.value = rect
  calloutSide.value = pickCalloutSide(rect, window.innerHeight, props.annotation.side)
  suppressedByBanner.value = targetOverlapsTopBanner(rect, collectTopBannerRects())
}

const visible = computed(() => targetRect.value !== null && !suppressedByBanner.value)

let observer: ResizeObserver | undefined
let raf = 0

function scheduleMeasure() {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(measure)
}

watch(selector, () => {
  observer?.disconnect()
  observer = new ResizeObserver(scheduleMeasure)
  const el = document.querySelector(selector.value)
  if (el) observer.observe(el)
  scheduleMeasure()
})

let overlayObserver: MutationObserver | undefined

onMounted(() => {
  scheduleMeasure()
  window.addEventListener('scroll', scheduleMeasure, { passive: true, capture: true })
  window.addEventListener('resize', scheduleMeasure, { passive: true })
  observer = new ResizeObserver(scheduleMeasure)
  const el = document.querySelector(selector.value)
  if (el) observer.observe(el)

  const floatLayer = document.querySelector('.video-float-layer')
  if (floatLayer) {
    overlayObserver = new MutationObserver(scheduleMeasure)
    overlayObserver.observe(floatLayer, { childList: true, subtree: true, attributes: true })
  }
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  observer?.disconnect()
  overlayObserver?.disconnect()
  window.removeEventListener('scroll', scheduleMeasure, true)
  window.removeEventListener('resize', scheduleMeasure)
})

const highlightStyle = computed(() => {
  const r = targetRect.value
  if (!r) return { display: 'none' }
  return {
    top: `${r.top}px`,
    left: `${r.left}px`,
    width: `${r.width}px`,
    height: `${r.height}px`,
  }
})

const CALLOUT_GAP = 10

const calloutStyle = computed(() => {
  const r = targetRect.value
  if (!r) return { display: 'none' }
  const side = calloutSide.value
  if (side === 'bottom') {
    return {
      top: `${r.bottom + CALLOUT_GAP}px`,
      left: `${r.left + r.width / 2}px`,
      transform: 'translateX(-50%)',
    }
  }
  if (side === 'top') {
    return {
      top: `${r.top - CALLOUT_GAP}px`,
      left: `${r.left + r.width / 2}px`,
      transform: 'translate(-50%, -100%)',
    }
  }
  if (side === 'right') {
    return {
      top: `${r.top + r.height / 2}px`,
      left: `${r.right + CALLOUT_GAP}px`,
      transform: 'translateY(-50%)',
    }
  }
  return {
    top: `${r.top + r.height / 2}px`,
    left: `${r.left - CALLOUT_GAP}px`,
    transform: 'translate(-100%, -50%)',
  }
})
</script>

<template>
  <div class="video-annotation-layer" :data-testid="`video-annotation-${annotation.id}`">
    <div
      v-if="visible"
      class="video-annotation-highlight"
      :style="highlightStyle"
      aria-hidden="true"
    />
    <div
      v-if="visible"
      class="video-annotation-callout"
      :class="`video-annotation-callout--${calloutSide}`"
      :style="calloutStyle"
    >
      <span class="video-annotation-callout__arrow" aria-hidden="true" />
      <p class="video-annotation-callout__label">{{ annotation.label }}</p>
      <p v-if="annotation.hint" class="video-annotation-callout__hint">{{ annotation.hint }}</p>
    </div>
  </div>
</template>
