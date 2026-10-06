<script setup lang="ts">
import { mcpIcon } from '../icons'

defineProps<{
  icon: string
  title: string
}>()
</script>

<template>
  <div class="fyp-icon-note" data-testid="icon-note">
    <span class="fyp-icon-note__mark" aria-hidden="true">
      <component :is="mcpIcon(icon)" v-if="mcpIcon(icon)" class="fyp-icon-note__glyph" />
    </span>
    <div class="fyp-icon-note__copy">
      <p class="fyp-icon-note__title">{{ title }}</p>
      <div class="fyp-icon-note__body">
        <slot />
      </div>
    </div>
  </div>
</template>
