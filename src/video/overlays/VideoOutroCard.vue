<script setup lang="ts">
import { computed } from 'vue'

import type { VideoOverlayDefinition, VideoOutroCta } from '../types'

import VideoBandShell from './VideoBandShell.vue'

const props = defineProps<{
  overlay: VideoOverlayDefinition
}>()

const ctas = computed((): VideoOutroCta[] => {
  if (props.overlay.ctas?.length) return props.overlay.ctas
  const legacy: VideoOutroCta[] = []
  if (props.overlay.secondary) {
    legacy.push({
      label: 'READ ABOUT THE EIP',
      url: props.overlay.secondary.toUpperCase(),
      variant: 'secondary',
    })
  }
  if (props.overlay.primary && props.overlay.cta) {
    legacy.push({
      label: props.overlay.primary.toUpperCase(),
      url: props.overlay.cta.toUpperCase(),
      variant: 'primary',
    })
  }
  return legacy
})
</script>

<template>
  <VideoBandShell test-id="video-outro-card" content-class="video-card-band__content--outro">
    <p v-if="overlay.closing" class="video-card-band__closing">{{ overlay.closing }}</p>

    <div v-if="ctas.length" class="video-card-band__ctas">
      <div
        v-for="(cta, i) in ctas"
        :key="i"
        class="video-card-band__cta"
        :class="cta.variant === 'secondary' ? 'video-card-band__cta--secondary' : ''"
      >
        <p class="video-card-band__cta-label">{{ cta.label }}</p>
        <p class="video-card-band__cta-url">{{ cta.url }}</p>
      </div>
    </div>
  </VideoBandShell>
</template>
