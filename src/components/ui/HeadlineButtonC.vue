<script setup lang="ts">
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/solid'

import TooltipC from './TooltipC.vue'

defineProps({
  url: String,
})
</script>

<template>
  <span class="group relative inline-block">
    <a :href="url" target="_blank">
      <ArrowTopRightOnSquareIcon class="size-6 inline align-baseline e-text" />
    </a>
    <TooltipC :tooltip="url ?? ''" />
  </span>
</template>
