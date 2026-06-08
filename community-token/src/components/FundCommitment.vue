<script setup lang="ts">
import { FUND_COMMITMENT, TREASURY_URL, TREASURY_WALLET_URL } from '@ct/content/fund'
</script>

<template>
  <section
    id="fund"
    class="ct-section-anchor ct-card overflow-hidden border-purple-200/80 ring-1 ring-purple-100"
  >
    <header class="border-b border-purple-100 bg-gradient-to-r from-purple-50/80 to-cyan-50/40 px-4 py-3 md:px-5">
      <p class="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-purple-600/90">
        {{ FUND_COMMITMENT.subtitle }}
      </p>
      <h2 class="mt-1 text-lg font-bold tracking-wide text-slate-800 md:text-xl">
        {{ FUND_COMMITMENT.title }}
      </h2>
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

      <ul class="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-sm leading-relaxed text-slate-500">
        <li>{{ FUND_COMMITMENT.notes[0] }}</li>
        <li>
          I claim roughly at month&rsquo;s end, for work already done. Fees land in the
          <a
            :href="TREASURY_WALLET_URL"
            target="_blank"
            rel="noopener"
            class="text-purple-600 underline decoration-purple-200 underline-offset-2 hover:text-purple-800"
            >treasury wallet on Base</a
          >; hours, expenses, claims, and withdrawals are tracked in the
          <a
            :href="TREASURY_URL"
            target="_blank"
            rel="noopener"
            class="text-purple-600 underline decoration-purple-200 underline-offset-2 hover:text-purple-800"
            >treasury folder on GitHub</a
          >.
        </li>
      </ul>

      <p class="mt-4 font-mono text-[0.65rem] leading-relaxed text-slate-400">
        {{ FUND_COMMITMENT.disclaimer }}
      </p>
    </div>
  </section>
</template>
