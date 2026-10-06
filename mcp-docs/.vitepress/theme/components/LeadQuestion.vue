<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <p class="fyp-lead-question" data-testid="lead-question">{{ text }}</p>
</template>
