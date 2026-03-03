<script setup lang="ts">
defineProps({
  tooltip: String,
})
</script>

<template>
  <span
    :class="tooltip === '' ? 'group-hover:hidden' : 'group-hover:block'"
    class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10"
  >
    {{ tooltip }}
  </span>
</template>
