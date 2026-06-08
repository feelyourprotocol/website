<script setup lang="ts">
import ChangelogBox from '@ct/components/ChangelogBox.vue'
import FundCommitment from '@ct/components/FundCommitment.vue'
import GuidelinesTabs from '@ct/components/GuidelinesTabs.vue'
import SectionAnchorLink from '@ct/components/SectionAnchorLink.vue'
import SiteFooter from '@ct/components/SiteFooter.vue'
import SiteHeader from '@ct/components/SiteHeader.vue'
import TokenInfoCard from '@ct/components/TokenInfoCard.vue'
import TreasurySection from '@ct/components/TreasurySection.vue'
import VisualPlaceholder from '@ct/components/VisualPlaceholder.vue'
import { GUIDELINE_TABS, INTRO } from '@ct/content/topics'
</script>

<template>
  <div class="mx-auto flex min-h-screen max-w-6xl flex-col px-3 py-4 md:px-6 md:py-5">
    <SiteHeader />

    <main class="mt-5 flex flex-1 flex-col">
      <div class="grid flex-1 gap-5 lg:grid-cols-2 lg:items-start">
        <!-- Left: intro + reference info -->
        <div class="flex flex-col gap-4">
          <section id="intro" class="ct-section-anchor ct-card p-5 md:p-6">
            <p class="font-mono text-xs uppercase tracking-[0.2em] text-purple-600/80">
              {{ INTRO.eyebrow }}
            </p>
            <div class="group mt-2 flex items-baseline gap-2">
              <h2 class="text-xl font-bold tracking-wide text-slate-800 md:text-2xl">
                {{ INTRO.title }}
              </h2>
              <SectionAnchorLink id="intro" />
            </div>
            <p class="mt-3 text-sm leading-relaxed text-slate-600">
              {{ INTRO.lead }}
            </p>
            <p
              class="mt-3 rounded-lg border border-purple-100 bg-purple-50/60 px-3 py-2.5 text-sm leading-relaxed text-slate-600"
            >
              {{ INTRO.gratitude }}
            </p>
          </section>

          <TokenInfoCard />

          <VisualPlaceholder class="hidden lg:flex lg:min-h-32 lg:flex-1" />

          <TreasurySection />
        </div>

        <!-- Right: fund commitment + guidelines -->
        <div class="flex flex-col gap-4">
          <FundCommitment />
          <GuidelinesTabs :tabs="GUIDELINE_TABS" />
          <ChangelogBox />
        </div>
      </div>
    </main>

    <SiteFooter class="mt-6 shrink-0" />
  </div>
</template>
