<script setup lang="ts">
import TreasuryPieChart from '@ct/components/TreasuryPieChart.vue'
import {
  ALLOCATION_CHART_2026,
  TREASURY_SECTION,
  TREASURY_SNAPSHOT_2026,
  TREASURY_URL,
  TREASURY_WALLET_URL,
} from '@ct/content/treasury'

const inTreasuryEur =
  TREASURY_SNAPSHOT_2026.claimedEur - TREASURY_SNAPSHOT_2026.withdrawnEur
</script>

<template>
  <section
    id="treasury"
    class="ct-section-anchor ct-card overflow-hidden border-slate-200 p-4 md:p-5"
  >
    <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <h2 class="text-base font-bold tracking-wide text-slate-800">
        {{ TREASURY_SECTION.title }}
      </h2>
      <p class="font-mono text-[0.65rem] text-slate-400">{{ TREASURY_SECTION.lead }}</p>
    </div>

    <p class="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 font-mono text-[0.65rem]">
      <a
        :href="TREASURY_WALLET_URL"
        target="_blank"
        rel="noopener"
        class="text-purple-600 underline decoration-purple-200 underline-offset-2 hover:text-purple-800"
      >
        Wallet ↗
      </a>
      <a
        :href="TREASURY_URL"
        target="_blank"
        rel="noopener"
        class="text-cyan-700 underline decoration-cyan-200 underline-offset-2 hover:text-cyan-900"
      >
        GitHub ↗
      </a>
    </p>

    <dl class="mt-3 grid grid-cols-3 gap-2">
      <div class="rounded-md border border-slate-100 bg-slate-50/80 px-2 py-1.5">
        <dt class="font-mono text-[0.6rem] uppercase tracking-wider text-slate-400">Claimed</dt>
        <dd class="font-mono text-xs font-bold text-slate-800">
          {{ TREASURY_SNAPSHOT_2026.claimedEur.toLocaleString('en-GB') }} €
        </dd>
      </div>
      <div class="rounded-md border border-slate-100 bg-slate-50/80 px-2 py-1.5">
        <dt class="font-mono text-[0.6rem] uppercase tracking-wider text-slate-400">Withdrawn</dt>
        <dd class="font-mono text-xs font-bold text-slate-800">
          {{ TREASURY_SNAPSHOT_2026.withdrawnEur.toLocaleString('en-GB') }} €
        </dd>
      </div>
      <div class="rounded-md border border-purple-100 bg-purple-50/50 px-2 py-1.5">
        <dt class="font-mono text-[0.6rem] uppercase tracking-wider text-purple-500">In treasury</dt>
        <dd class="font-mono text-xs font-bold text-purple-800">
          {{ inTreasuryEur.toLocaleString('en-GB') }} €
        </dd>
      </div>
    </dl>

    <div class="mt-3 border-t border-slate-100 pt-3">
      <TreasuryPieChart :spec="ALLOCATION_CHART_2026" compact />
    </div>
  </section>
</template>
