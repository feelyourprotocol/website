<script setup lang="ts">
import TooltipC from './TooltipC.vue'

defineProps({
  icon: Object,
  tooltip: String,
})
</script>

<template>
  <span class="group relative inline-block">
    <component :is="icon" class="e-button-icon" />
    <TooltipC :tooltip="tooltip" />
  </span>
</template>
