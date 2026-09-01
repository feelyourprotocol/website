<script setup lang="ts">
import type { Component } from 'vue'

import HelpHintUIC from './HelpHintUIC.vue'

defineProps<{
  icon: Component
  tooltip?: string
  ariaLabel?: string
}>()
</script>

<template>
  <HelpHintUIC
    :text="tooltip ?? ''"
    tier="decorative"
    host-class="inline-flex items-center"
    trigger-class="inline-flex"
  >
    <component :is="icon" class="e-button-icon" :aria-label="ariaLabel ?? tooltip" />
  </HelpHintUIC>
</template>
