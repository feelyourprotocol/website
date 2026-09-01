<script setup lang="ts">
defineProps({
  tooltip: String,
})
</script>

<template>
  <span
    :class="tooltip === '' ? 'group-hover:hidden' : 'group-hover:block'"
    class="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full z-50 mb-2 hidden whitespace-nowrap rounded bg-slate-700 px-2 py-1 text-xs text-white shadow-md"
  >
    {{ tooltip }}
  </span>
</template>
