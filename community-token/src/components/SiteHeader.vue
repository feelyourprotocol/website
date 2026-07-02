<script setup lang="ts">
import { SITE_LOGO } from '@ct/content/brand'
import { SITE_VERSION } from '@ct/content/version'

const MAIN_SITE_URL = 'https://feelyourprotocol.org'
const ROADMAP_URL = 'https://roadmap.feelyourprotocol.org/index.html'
</script>

<template>
  <header class="ct-card sticky top-2 z-10 px-4 py-3 md:px-6">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div class="flex min-w-0 items-center gap-3">
        <img
          :src="SITE_LOGO.src"
          :alt="SITE_LOGO.alt"
          :width="SITE_LOGO.width"
          :height="SITE_LOGO.height"
          class="size-[3.5rem] shrink-0 object-contain md:size-[4.25rem]"
        />
        <div class="min-w-0">
          <p class="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-400">
            Feel Your Protocol
          </p>
          <h1 class="flex flex-wrap items-center gap-2 text-xl font-bold tracking-wide md:text-2xl">
            <span class="ct-gradient-text">Community Token</span>
            <span
              class="rounded-md border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-slate-600"
            >
              {{ SITE_VERSION }}
            </span>
          </h1>
        </div>
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
          :href="ROADMAP_URL"
          class="rounded-md border border-slate-300 px-3 py-1.5 text-slate-600 transition hover:border-purple-300 hover:text-purple-700"
          target="_blank"
          rel="noopener"
        >
          Roadmap ↗
        </a>
        <a
          href="#token-info"
          class="rounded-md border border-slate-300 px-3 py-1.5 text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700"
        >
          Which token
        </a>
        <a
          href="#fund"
          class="rounded-md border border-slate-300 px-3 py-1.5 text-slate-600 transition hover:border-purple-300 hover:text-purple-700"
        >
          Fund
        </a>
        <a
          href="#treasury"
          class="rounded-md border border-slate-300 px-3 py-1.5 text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700"
        >
          Treasury
        </a>
        <a
          href="#intro"
          class="rounded-md border border-slate-300 px-3 py-1.5 text-slate-600 transition hover:border-purple-300 hover:text-purple-700"
        >
          How it works
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
