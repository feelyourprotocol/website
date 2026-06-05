<script setup lang="ts">
const MAIN_SITE_URL = 'https://feelyourprotocol.org'
</script>

<template>
  <header class="ct-card sticky top-2 z-10 px-4 py-3 md:px-6">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <p class="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-400">
          Feel Your Protocol
        </p>
        <h1 class="text-xl font-bold tracking-wide md:text-2xl">
          <span class="ct-gradient-text">Community Token</span>
        </h1>
      </div>

      <nav class="flex flex-wrap items-center gap-2 font-mono text-xs">
        <a
          :href="MAIN_SITE_URL"
          class="rounded-md border border-slate-300 px-3 py-1.5 text-slate-600 transition hover:border-purple-300 hover:text-purple-700"
          target="_blank"
          rel="noopener"
        >
          Main site ↗
        </a>
        <a
          href="#token-info"
          class="rounded-md border border-slate-300 px-3 py-1.5 text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700"
        >
          Which token
        </a>
        <a
          href="#guidelines"
          class="rounded-md border border-slate-300 px-3 py-1.5 text-slate-600 transition hover:border-purple-300 hover:text-purple-700"
        >
          Guidelines
        </a>
      </nav>
    </div>
  </header>
</template>
