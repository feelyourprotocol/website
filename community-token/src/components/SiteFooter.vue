<script setup lang="ts">
const MAIN_SITE_URL = 'https://feelyourprotocol.org'
const DOCS_URL = 'https://docs.feelyourprotocol.org/index.html'
const ROADMAP_URL = 'https://roadmap.feelyourprotocol.org/index.html'
const GITHUB_URL = 'https://github.com/feelyourprotocol/website'
const LAST_UPDATED = 'June 30, 2026'
</script>

<template>
  <footer class="mt-12 border-t border-slate-200 pt-6 pb-4 font-mono text-xs text-slate-500">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <p>
        <span class="text-purple-500">◆</span>
        Feel Your Protocol — open-source protocol explorations
      </p>
      <p class="flex flex-wrap gap-x-3 gap-y-1">
        <a :href="MAIN_SITE_URL" target="_blank" rel="noopener" class="hover:text-slate-700"
          >feelyourprotocol.org</a
        >
        <span class="text-slate-300">·</span>
        <a :href="DOCS_URL" target="_blank" rel="noopener" class="hover:text-slate-700">Docs</a>
        <span class="text-slate-300">·</span>
        <a :href="ROADMAP_URL" target="_blank" rel="noopener" class="hover:text-slate-700"
          >Roadmap</a
        >
        <span class="text-slate-300">·</span>
        <a :href="GITHUB_URL" target="_blank" rel="noopener" class="hover:text-slate-700">GitHub</a>
      </p>
    </div>
    <p class="mt-3 text-[0.65rem] leading-relaxed text-slate-400">
      This subdomain documents the relationship between an independently launched community token
      and the Feel Your Protocol open-source project. It is not investment advice.
    </p>
    <p class="mt-1.5 text-[0.65rem] text-slate-400">Last updated: {{ LAST_UPDATED }}</p>
  </footer>
</template>
