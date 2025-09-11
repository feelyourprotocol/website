<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="grid grid-cols-2">
    <h1 class="green">{{ msg }}</h1>

    <h3>
      <a href="https://vite.dev/" target="_blank" rel="noopener">Imprint</a>
      <a href="https://vuejs.org/" target="_blank" rel="noopener">GitHub</a>
    </h3>
  </div>
</template>

<style scoped>
h1 {}
</style>
