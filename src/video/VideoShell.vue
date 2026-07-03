<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'

import VideoAnnotation from './overlays/VideoAnnotation.vue'
import VideoHighlights from './overlays/VideoHighlights.vue'
import VideoOverlay from './VideoOverlay.vue'
import {
  installVideoBridge,
  readVideoConfigFromWindow,
  resolveActiveAnnotation,
  resolveActiveHighlightSet,
  resolveActiveOverlay,
} from './videoBridge'
import type {
  ActiveVideoAnnotation,
  ActiveVideoHighlightSet,
  ActiveVideoOverlay,
  ShowOverlayOptions,
} from './types'
import './video.css'

const activeOverlay = shallowRef<ActiveVideoOverlay | null>(null)
const activeAnnotation = shallowRef<ActiveVideoAnnotation | null>(null)
const activeHighlightSet = shallowRef<ActiveVideoHighlightSet | null>(null)
const config = ref(readVideoConfigFromWindow())

const themeVars = computed(() => {
  const theme = config.value?.theme
  if (!theme) return {}
  return { '--video-accent': theme.accent }
})

const isFullScreenCard = computed(() => {
  const type = activeOverlay.value?.definition.type
  return type === 'title-card' || type === 'title' || type === 'outro-card' || type === 'outro'
})

const showGuideLayers = computed(() => !isFullScreenCard.value)

function showOverlay(id: string, options?: ShowOverlayOptions) {
  activeOverlay.value = resolveActiveOverlay(config.value, id, options)
}

function hideOverlay() {
  activeOverlay.value = null
}

function showAnnotation(id: string) {
  activeAnnotation.value = resolveActiveAnnotation(config.value, id)
}

function hideAnnotation() {
  activeAnnotation.value = null
}

function showHighlightSet(id: string) {
  activeHighlightSet.value = resolveActiveHighlightSet(config.value, id)
}

function hideHighlights() {
  activeHighlightSet.value = null
}

function isReady() {
  return document.querySelector('[data-testid="exploration-ready"]') !== null
}

let uninstallBridge: (() => void) | undefined

watch(isFullScreenCard, (full) => {
  document.documentElement.classList.toggle('fyp-video-band-active', full)
  const type = activeOverlay.value?.definition.type
  if (full && (type === 'title-card' || type === 'title')) {
    window.scrollTo(0, 0)
  }
})

onMounted(() => {
  config.value = readVideoConfigFromWindow()
  uninstallBridge = installVideoBridge({
    onShowOverlay: showOverlay,
    onHideOverlay: hideOverlay,
    onShowAnnotation: showAnnotation,
    onHideAnnotation: hideAnnotation,
    onShowHighlightSet: showHighlightSet,
    onHideHighlights: hideHighlights,
    isReady,
  })
})

onUnmounted(() => {
  document.documentElement.classList.remove('fyp-video-band-active')
  uninstallBridge?.()
})
</script>

<template>
  <div
    class="video-shell pointer-events-none fixed inset-0 z-50"
    data-testid="video-shell"
    aria-hidden="true"
    :style="themeVars"
  >
    <VideoOverlay v-if="activeOverlay && isFullScreenCard" :overlay="activeOverlay.definition" />
    <div v-else-if="activeOverlay" class="video-float-layer">
      <VideoOverlay
        :overlay="activeOverlay.definition"
        :placement="activeOverlay.placement"
      />
    </div>
    <VideoHighlights
      v-if="showGuideLayers && activeHighlightSet"
      :set-id="activeHighlightSet.id"
      :marks="activeHighlightSet.marks"
      :focus-areas="config?.focusAreas"
    />
    <VideoAnnotation
      v-if="showGuideLayers && activeAnnotation"
      :annotation="activeAnnotation!.definition"
      :focus-areas="config?.focusAreas"
    />
  </div>
</template>
