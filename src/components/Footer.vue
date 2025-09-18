<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="grid grid-cols-2 pt-2 border-t-2 border-blue-300 mt-10">
    <h1 class="font-mono text-xs">{{ msg }}</h1>

    <h3 class="font-mono text-xs text-right">
      <a href="https://vite.dev/" target="_blank" rel="noopener">Imprint</a>
      <a href="https://vuejs.org/" target="_blank" rel="noopener" class="ml-3">GitHub</a>
    </h3>
  </div>
</template>
