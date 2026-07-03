<script setup lang="ts">
import { computed } from 'vue'

import { autoSplitText } from '../splitText'
import type { VideoOverlayDefinition, VideoOverlayPlacement } from '../types'

const props = defineProps<{
  overlay: VideoOverlayDefinition
  placement?: VideoOverlayPlacement
}>()

const SLOT_ORDER: Array<'a' | 'b' | 'c'> = ['a', 'b', 'c']

function sizeClass(size: NonNullable<typeof props.overlay.segments>[number]['size'] = 'lg'): string {
  if (size === 'hero') return 'video-split__text--hero'
  if (size === 'xl') return 'video-split__text--xl'
  if (size === 'md') return 'video-banner__line--sub'
  return 'video-split__text--lg'
}

const effectivePlacement = computed(
  () => props.placement ?? props.overlay.placement ?? 'top-banner',
)

const useBannerLayout = computed(() => {
  if (props.overlay.layout === 'scatter') return false
  if (props.overlay.layout === 'banner') return true
  const p = effectivePlacement.value
  return p === 'top-banner' || p === 'bottom-banner'
})

const segments = computed(() => {
  if (props.overlay.segments?.length) return props.overlay.segments
  if (props.overlay.text) return autoSplitText(props.overlay.text)
  return []
})

const bannerClass = computed(() =>
  effectivePlacement.value === 'bottom-banner'
    ? 'video-banner--bottom-banner'
    : 'video-banner--top-banner',
)
</script>

<template>
  <div
    v-if="useBannerLayout"
    class="video-banner"
    :class="bannerClass"
    data-testid="video-banner"
  >
    <p
      v-for="(seg, i) in segments"
      :key="i"
      class="video-banner__line"
      :class="[
        sizeClass(seg.size),
        seg.emphasis ? 'video-banner__line--accent' : '',
        i > 0 ? 'video-banner__line--sub' : '',
      ]"
    >
      {{ seg.text }}
    </p>
  </div>
  <div v-else class="video-split">
    <div
      v-for="(seg, i) in segments"
      :key="i"
      class="video-split__part"
      :class="`video-split__part--${seg.slot ?? SLOT_ORDER[i] ?? 'a'}`"
    >
      <p
        class="video-split__text"
        :class="[
          sizeClass(seg.size),
          seg.emphasis ? 'video-split__text--accent' : '',
        ]"
      >
        {{ seg.text }}
      </p>
    </div>
  </div>
</template>
