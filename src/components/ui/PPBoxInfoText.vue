<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <p class="e-result-text-sm m-5 text-center">{{ text }}</p>
</template>
