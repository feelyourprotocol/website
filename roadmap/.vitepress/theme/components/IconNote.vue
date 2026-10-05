<script setup lang="ts">
/**
 * Icon beside a short point. Not a card — a marker in running prose.
 *
 *   <IconNote icon="book" title="Learning is the front door">
 *   People arrive to understand a change.
 *   </IconNote>
 */
import { roadmapIcon } from '../icons'

defineProps<{
  icon: string
  title: string
}>()
</script>

<template>
  <div class="fyp-icon-note" data-testid="icon-note">
    <span class="fyp-icon-note__mark" aria-hidden="true">
      <component :is="roadmapIcon(icon)" v-if="roadmapIcon(icon)" class="fyp-icon-note__glyph" />
    </span>
    <div class="fyp-icon-note__copy">
      <p class="fyp-icon-note__title">{{ title }}</p>
      <div class="fyp-icon-note__body">
        <slot />
      </div>
    </div>
  </div>
</template>
