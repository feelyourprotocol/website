<script setup lang="ts">
defineProps({
  icon: Object,
  tooltip: String,
})
</script>

<template>
  <component
    :is="icon"
    class="size-4 inline align-baseline border-blue-900 border-1 text-blue-900 p-0.5 rounded-xs"
  />
  <span
    class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10"
  >
    {{ tooltip }}
  </span>
</template>
