<script setup lang="ts">
import SectionLabel from '@/components/SectionLabel.vue'
import { MCP_DOCS_HOME, ROADMAP_LAUNCH } from '@/libs/roadmapUrls'
</script>

<template>
  <section data-mcp-launch-week class="mb-8">
    <SectionLabel>MCP launch week</SectionLabel>
    <div
      class="rounded-lg border border-violet-300/80 bg-gradient-to-br from-violet-50 to-cyan-50/40 p-4 md:p-5"
    >
      <p class="font-mono text-xs uppercase tracking-wide text-violet-700 mb-2">
        5–9 October 2026 · target
      </p>
      <p class="text-slate-800 text-sm md:text-base leading-relaxed max-w-3xl">
        The deterministic MCP lab is built — the
        <strong>public hosted server</strong> at
        <span class="font-mono text-xs">mcp.feelyourprotocol.org</span>
        opens in launch week. Explore Amsterdam EIPs here today; agents connect at launch.
      </p>
      <div class="flex flex-wrap items-center gap-2 mt-4">
        <a
          :href="ROADMAP_LAUNCH"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center px-3 py-2 min-h-11 rounded-md bg-violet-700 text-white text-sm font-medium no-underline hover:bg-violet-600"
        >
          Launch details
        </a>
        <a
          :href="MCP_DOCS_HOME"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center px-3 py-2 min-h-11 rounded-md border border-slate-400 bg-white text-slate-700 text-sm no-underline hover:bg-slate-50"
        >
          MCP catalogue
        </a>
      </div>
    </div>
  </section>
</template>
