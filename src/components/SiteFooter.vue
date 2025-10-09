<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <footer class="grid grid-cols-2 pt-2 mt-10 mb-2">
    <h3 class="font-mono text-xs">{{ msg }}</h3>

    <h3 class="font-mono text-xs text-right">
      <a href="https://vite.dev/" target="_blank" rel="noopener">Imprint</a>
      <a href="https://vuejs.org/" target="_blank" rel="noopener" class="ml-3">GitHub</a>
    </h3>
  </footer>
</template>
