<script setup lang="ts">
import SectionAnchorLink from '@ct/components/SectionAnchorLink.vue'
import { FUND_COMMITMENT } from '@ct/content/fund'
</script>

<template>
  <section
    id="fund"
    class="ct-section-anchor ct-card overflow-hidden border-purple-200/80 ring-1 ring-purple-100"
  >
    <header
      class="border-b border-purple-100 bg-gradient-to-r from-purple-50/80 to-cyan-50/40 px-4 py-3 md:px-5"
    >
      <p class="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-purple-600/90">
        {{ FUND_COMMITMENT.subtitle }}
      </p>
      <div class="group mt-1 flex items-baseline gap-2">
        <h2 class="text-lg font-bold tracking-wide text-slate-800 md:text-xl">
          {{ FUND_COMMITMENT.title }}
        </h2>
        <SectionAnchorLink id="fund" />
      </div>
      <p class="mt-2 text-sm leading-relaxed text-slate-600">
        {{ FUND_COMMITMENT.lead }}
      </p>
    </header>

    <div class="px-4 py-4 md:px-5 md:py-5">
      <p class="text-sm leading-relaxed text-slate-600">{{ FUND_COMMITMENT.usesIntro }}</p>
      <ul class="mt-2.5 space-y-2 text-sm leading-relaxed text-slate-600">
        <li v-for="(use, index) in FUND_COMMITMENT.uses" :key="index" class="flex gap-2.5">
          <span class="mt-2 size-1.5 shrink-0 rounded-full bg-cyan-500" aria-hidden="true" />
          <span>{{ use }}</span>
        </li>
      </ul>

      <ul
        class="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-sm leading-relaxed text-slate-500"
      >
        <li v-for="(note, index) in FUND_COMMITMENT.notes" :key="index">{{ note }}</li>
        <li>
          On-chain balances, claims, withdrawals, and the work log live in the
          <a
            href="#treasury"
            class="text-purple-600 underline decoration-purple-200 underline-offset-2 hover:text-purple-800"
            >Treasury</a
          >
          section below.
        </li>
      </ul>

      <p class="mt-4 font-mono text-[0.65rem] leading-relaxed text-slate-400">
        {{ FUND_COMMITMENT.disclaimer }}
      </p>
    </div>
  </section>
</template>
