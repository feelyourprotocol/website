<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import { COMPANION_EXPAND_EVENT, type CompanionExpandMode } from '@/video/companionSheetEvents'

const HALF_RATIO = 0.5
const FULL_RATIO = 0.92

function videoCaptureScale(): number {
  if (typeof document === 'undefined' || typeof window === 'undefined') return 1
  if (!document.documentElement.classList.contains('fyp-video-capture')) return 1
  return window.innerWidth / 540
}

function peekPx(): number {
  return Math.round(56 * videoCaptureScale())
}

export type CompanionSnap = 'peek' | 'half' | 'full'

const props = defineProps<{
  label: string
  active: boolean
  pulseKey: number
}>()

const snap = ref<CompanionSnap>('peek')
const viewportHeight = ref(typeof window !== 'undefined' ? window.innerHeight : 800)
const dragging = ref(false)
const dragHeightPx = ref<number | null>(null)
const pulsing = ref(false)

const prefersReducedMotion = ref(false)

function snapHeightPx(target: CompanionSnap): number {
  const vh = viewportHeight.value
  if (target === 'peek') return peekPx()
  if (target === 'half') return Math.round(vh * HALF_RATIO)
  return Math.round(vh * FULL_RATIO)
}

const sheetHeightPx = computed(() => {
  if (dragHeightPx.value !== null) return dragHeightPx.value
  return snapHeightPx(snap.value)
})

function nearestSnap(heightPx: number): CompanionSnap {
  const vh = viewportHeight.value
  const candidates: [CompanionSnap, number][] = [
    ['peek', peekPx()],
    ['half', Math.round(vh * HALF_RATIO)],
    ['full', Math.round(vh * FULL_RATIO)],
  ]
  let best: CompanionSnap = 'peek'
  let bestDist = Infinity
  for (const [name, h] of candidates) {
    const dist = Math.abs(heightPx - h)
    if (dist < bestDist) {
      bestDist = dist
      best = name
    }
  }
  return best
}

function expandToHalf() {
  if (snap.value === 'peek') snap.value = 'half'
}

function expandToFull() {
  snap.value = 'full'
}

function onCompanionExpand(event: Event) {
  const mode = (event as CustomEvent<{ mode: CompanionExpandMode }>).detail?.mode
  if (mode === 'full') expandToFull()
  else if (mode === 'half') expandToHalf()
}

let dragStartY = 0
let dragStartHeight = 0

function onHandlePointerDown(event: PointerEvent) {
  if (prefersReducedMotion.value) return
  dragging.value = true
  dragStartY = event.clientY
  dragStartHeight = sheetHeightPx.value
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

function onHandlePointerMove(event: PointerEvent) {
  if (!dragging.value) return
  const delta = dragStartY - event.clientY
  const vh = viewportHeight.value
  const min = peekPx()
  const max = Math.round(vh * FULL_RATIO)
  dragHeightPx.value = Math.min(max, Math.max(min, dragStartHeight + delta))
}

function onHandlePointerUp(event: PointerEvent) {
  if (!dragging.value) return
  dragging.value = false
  ;(event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId)
  if (dragHeightPx.value !== null) {
    snap.value = nearestSnap(dragHeightPx.value)
  }
  dragHeightPx.value = null
}

function onViewportChange() {
  viewportHeight.value = window.innerHeight
}

function isMobileSheet(): boolean {
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('fyp-video-capture')) {
    return true
  }
  return typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 767px)').matches
}

watch(
  () => props.active,
  (active) => {
    if (!isMobileSheet()) return
    if (active) {
      if (snap.value === 'peek') snap.value = 'half'
      return
    }
    if (snap.value === 'half') snap.value = 'peek'
  },
)

watch(
  () => props.pulseKey,
  (next, prev) => {
    if (prefersReducedMotion.value || prev === undefined || next === prev || !props.active) return
    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(min-width: 768px)').matches
    ) {
      return
    }
    pulsing.value = true
    window.setTimeout(() => {
      pulsing.value = false
    }, 650)
  },
)

onMounted(() => {
  viewportHeight.value = window.innerHeight
  prefersReducedMotion.value =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion.value) snap.value = 'half'
  window.addEventListener('resize', onViewportChange)
  window.addEventListener(COMPANION_EXPAND_EVENT, onCompanionExpand)
})

onUnmounted(() => {
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener(COMPANION_EXPAND_EVENT, onCompanionExpand)
})

defineExpose({ snap, expandToHalf, expandToFull })
</script>

<template>
  <div
    class="companion-sheet flex flex-col min-h-0 max-md:bg-white max-md:border-t max-md:border-slate-200 max-md:shadow-[0_-8px_30px_rgba(15,23,42,0.12)] max-md:rounded-t-xl max-md:overflow-hidden md:contents"
    data-testid="companion-sheet"
    :class="[
      pulsing ? 'companion-sheet-pulse' : '',
      dragging ? '' : 'max-md:transition-[height] max-md:duration-300 max-md:ease-out',
    ]"
    :style="{ height: `${sheetHeightPx}px`, '--companion-peek-h': `${peekPx()}px` }"
  >
    <div
      class="md:hidden shrink-0 touch-none select-none"
      @pointerdown="onHandlePointerDown"
      @pointermove="onHandlePointerMove"
      @pointerup="onHandlePointerUp"
      @pointercancel="onHandlePointerUp"
    >
      <div class="flex justify-center pt-2 pb-1">
        <div class="h-1 w-10 rounded-full bg-slate-300" aria-hidden="true" />
      </div>
      <button
        type="button"
        class="companion-sheet-peek w-full px-3 pb-2 text-left font-mono text-xs leading-snug truncate"
        data-testid="companion-peek"
        :class="active ? 'text-slate-700 font-semibold' : 'text-slate-400'"
        @click="expandToHalf"
      >
        <span v-if="snap === 'peek'">{{ label }}</span>
        <span v-else class="text-slate-500">Companion panel</span>
      </button>
    </div>

    <div
      class="flex-1 min-h-0 overflow-y-auto overscroll-contain md:contents"
      :class="snap === 'peek' ? 'max-md:hidden' : ''"
    >
      <slot />
    </div>
  </div>
</template>
