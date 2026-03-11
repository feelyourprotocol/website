<script setup lang="ts">
import type { Component } from 'vue'

import TooltipUIC from './TooltipUIC.vue'

defineProps<{
  icon: Component
  tooltip?: string
}>()
</script>

<template>
  <span class="group relative inline-block">
    <component :is="icon" class="e-button-icon" />
    <TooltipUIC :tooltip="tooltip" />
  </span>
</template>
