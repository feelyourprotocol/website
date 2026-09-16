<script setup lang="ts">
defineProps<{
  text: string
  hintClass?: string
}>()
</script>

<template>
  <p
    v-if="text.trim()"
    class="help-hint-inline font-mono text-xs leading-snug text-slate-500"
    :class="hintClass"
  >
    {{ text }}
  </p>
</template>
