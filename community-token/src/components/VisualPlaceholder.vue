<script setup lang="ts">
defineProps<{
  label?: string
  class?: string
}>()
</script>

<template>
  <aside
    :class="[
      'ct-card flex flex-col items-center justify-center border-dashed border-amber-200 bg-gradient-to-br from-amber-50/80 to-white p-5 text-center',
      $props.class,
    ]"
    aria-label="Community token visual placeholder"
  >
    <div
      class="mb-4 flex size-20 items-center justify-center rounded-2xl border border-amber-200 bg-white shadow-inner"
    >
      <span class="font-mono text-2xl text-amber-500/70">◇</span>
    </div>
    <p class="font-mono text-xs uppercase tracking-[0.18em] text-amber-700/80">
      {{ label ?? 'Visual identity' }}
    </p>
    <p class="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
      Logo or symbol will be integrated here in a follow-up step.
    </p>
  </aside>
</template>
