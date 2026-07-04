<script setup lang="ts">
import type { VideoOverlayDefinition } from '../types'
import VideoBandShell from './VideoBandShell.vue'

defineProps<{
  overlay: VideoOverlayDefinition
}>()
</script>

<template>
  <VideoBandShell test-id="video-title-card">
    <p v-if="overlay.eyebrow" class="video-card-band__eyebrow">{{ overlay.eyebrow }}</p>
    <h1 v-if="overlay.title" class="video-card-band__title">{{ overlay.title }}</h1>
    <p v-else-if="overlay.lines?.[0]" class="video-card-band__title">{{ overlay.lines[0] }}</p>

    <p v-if="overlay.subtitle" class="video-card-band__subtitle">{{ overlay.subtitle }}</p>
    <p v-else-if="overlay.lines?.[1]" class="video-card-band__subtitle">{{ overlay.lines[1] }}</p>

    <div v-if="overlay.hook?.length" class="video-card-band__hook">
      <p
        v-for="(line, i) in overlay.hook"
        :key="i"
        class="video-card-band__hook-line"
        :class="i === overlay.hook!.length - 1 ? 'video-card-band__hook-line--accent' : ''"
      >
        {{ line }}
      </p>
    </div>
    <p
      v-else-if="overlay.question"
      class="video-card-band__hook-line video-card-band__hook-line--accent"
    >
      {{ overlay.question }}
    </p>
  </VideoBandShell>
</template>
