<script setup lang="ts">
withDefaults(
  defineProps<{
    align?: 'left' | 'right'
  }>(),
  {
    align: 'left',
  },
)
</script>

<template>
  <div :class="['mb-3', align === 'right' ? 'text-right' : 'text-left']">
    <span
      class="text-sm rounded-lg font-mono bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-3 py-1.5"
    >
      <slot />
    </span>
  </div>
</template>
