<script setup lang="ts">
import { ArrowLongRightIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

import { buildScenarioBrief } from './scenarioBrief'

import type { BalExampleMeta } from './examples'
import type { BalScenarioDefinition, ScenarioRunResult } from './scenarios/types'

const props = defineProps<{
  scenario: BalScenarioDefinition
  meta: BalExampleMeta
  result?: ScenarioRunResult | null
  hasRun: boolean
}>()

const brief = computed(() => buildScenarioBrief(props.scenario, props.meta, props.result))
</script>

<template>
  <section class="rounded-lg border-2 e-border-dark overflow-hidden mb-5 bg-white/40">
    <header class="px-4 py-3 e-bg-medium border-b e-border">
      <p class="text-xs font-mono uppercase tracking-widest opacity-50 mb-1">What runs in this block</p>
      <h2 class="font-semibold e-text text-lg leading-snug">{{ brief.title }}</h2>
      <p class="text-sm leading-relaxed opacity-75 mt-1.5 max-w-3xl">{{ brief.lesson }}</p>
    </header>

    <div class="px-4 py-4 border-b e-border">
      <p class="text-[0.65rem] font-mono uppercase tracking-widest opacity-45 mb-3">Accounts before execution</p>
      <div class="flex flex-wrap items-center gap-2 sm:gap-3">
        <div
          class="rounded-md border e-border px-3 py-2 min-w-[8.5rem] e-bg-light shadow-sm"
        >
          <p class="font-semibold e-text text-sm capitalize">{{ brief.actors[0]!.label }}</p>
          <p class="text-[0.65rem] font-mono opacity-50 mt-0.5">{{ brief.actors[0]!.shortAddress }}</p>
          <ul class="mt-1.5 space-y-0.5">
            <li
              v-for="line in brief.actors[0]!.lines"
              :key="line"
              class="text-xs font-mono opacity-70"
            >
              {{ line }}
            </li>
          </ul>
        </div>

        <div class="flex flex-col items-center gap-0.5 px-1 shrink-0">
          <ArrowLongRightIcon class="size-6 opacity-30" />
          <span class="text-[0.6rem] font-mono uppercase tracking-wide opacity-40 text-center max-w-[5rem] leading-tight">
            {{ brief.actors.length > 1 ? 'call' : 'transfer' }}
          </span>
        </div>

        <div
          v-if="brief.actors.length > 1"
          class="rounded-md border e-border px-3 py-2 min-w-[8.5rem] e-bg-light shadow-sm"
        >
          <p class="font-semibold e-text text-sm capitalize">{{ brief.actors[1]!.label }}</p>
          <p class="text-[0.65rem] font-mono opacity-50 mt-0.5">{{ brief.actors[1]!.shortAddress }}</p>
          <ul class="mt-1.5 space-y-0.5">
            <li
              v-for="line in brief.actors[1]!.lines"
              :key="line"
              class="text-xs font-mono opacity-70"
            >
              {{ line }}
            </li>
          </ul>
        </div>

        <div
          v-else
          class="rounded-md border border-dashed e-border px-3 py-2 opacity-60 min-w-[8.5rem]"
        >
          <p class="font-semibold text-sm">Recipient</p>
          <p class="text-[0.65rem] font-mono opacity-50 mt-0.5">0x0000…0000</p>
          <p class="text-xs font-mono opacity-70 mt-1.5">empty · touched on transfer</p>
        </div>
      </div>
    </div>

    <div class="px-4 py-3 border-b e-border flex flex-wrap items-start gap-x-6 gap-y-2">
      <div class="min-w-0 flex-1">
        <p class="text-[0.65rem] font-mono uppercase tracking-widest opacity-45 mb-1">Transaction</p>
        <p class="font-medium e-text text-sm">{{ brief.action.headline }}</p>
        <p class="text-xs opacity-60 mt-0.5">{{ brief.action.detail }}</p>
      </div>
      <div v-if="brief.watchFor.length > 0" class="shrink-0">
        <p class="text-[0.65rem] font-mono uppercase tracking-widest opacity-45 mb-1.5">Expect in BAL</p>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="name in brief.watchFor"
            :key="name"
            class="text-xs px-2 py-0.5 rounded-full border e-border e-bg-medium font-medium e-text"
          >
            {{ name }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="brief.bytecodeSteps" class="px-4 py-3 border-b e-border">
      <p class="text-[0.65rem] font-mono uppercase tracking-widest opacity-45 mb-2">Contract logic</p>
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="(step, i) in brief.bytecodeSteps"
          :key="i"
          class="inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded e-bg-medium border e-border"
          :title="step.comment"
        >
          <span class="font-semibold e-text">{{ step.opcode }}</span>
          <span v-if="step.comment" class="opacity-45 hidden md:inline">· {{ step.comment }}</span>
        </span>
      </div>
    </div>

    <footer
      v-if="brief.blockFooter"
      class="px-4 py-2.5 e-bg-dark text-white/90 flex flex-wrap gap-x-5 gap-y-1 text-xs font-mono"
    >
      <span>gas {{ brief.blockFooter.gasUsed }}</span>
      <span>{{ brief.blockFooter.accountCount }} accounts in BAL</span>
      <span class="opacity-70">hash {{ brief.blockFooter.hashShort }}</span>
    </footer>

    <footer
      v-else-if="!hasRun"
      class="px-4 py-2.5 text-xs font-mono opacity-50 border-t e-border e-bg-medium"
    >
      Run the block to generate the access list below.
    </footer>
  </section>
</template>
