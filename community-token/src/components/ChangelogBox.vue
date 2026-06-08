<script setup lang="ts">
import { CHANGELOG } from '@ct/content/version'
</script>

<template>
  <section id="changelog" class="ct-section-anchor ct-card overflow-hidden">
    <div class="border-b border-slate-100 px-4 py-3 md:px-5">
      <h2 class="font-mono text-sm font-bold uppercase tracking-[0.15em] text-slate-600">
        Changelog
      </h2>
    </div>

    <ol class="divide-y divide-slate-100 px-4 py-1 md:px-5">
      <li
        v-for="entry in CHANGELOG"
        :key="entry.version"
        class="flex items-baseline gap-3 py-2.5 text-sm"
      >
        <span
          class="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.65rem] font-bold text-slate-600"
        >
          {{ entry.version }}
        </span>
        <span class="text-slate-600">{{ entry.summary }}</span>
      </li>
    </ol>
  </section>
</template>
