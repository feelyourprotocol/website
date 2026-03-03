<script setup lang="ts">
import TooltipUIC from './TooltipUIC.vue'

defineProps({
  icon: Object,
  tooltip: String,
})
</script>

<template>
  <span class="group relative inline-block">
    <component :is="icon" class="e-button-icon" />
    <TooltipUIC :tooltip="tooltip" />
  </span>
</template>
