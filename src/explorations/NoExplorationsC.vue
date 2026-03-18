<script setup lang="ts">
defineProps<{ message?: string }>()
</script>

<template>
  <div class="rounded-md border border-slate-300 bg-white px-5 py-6 text-center">
    <p class="text-2xl mb-2">🕵️</p>
    <p class="text-sm text-slate-500">
      {{
        message ??
        "No explorations here yet — but who knows, maybe you'll be the one to add the first!"
      }}
    </p>
  </div>
</template>
