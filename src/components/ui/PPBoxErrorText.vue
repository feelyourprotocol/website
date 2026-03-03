<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <div class="e-result-text-sm m-5 text-center">
    <p class="text-red-400">
      {{ text }}
    </p>
    <p class="mt-2">(Wrong error? Report on GitHub.)</p>
  </div>
</template>
