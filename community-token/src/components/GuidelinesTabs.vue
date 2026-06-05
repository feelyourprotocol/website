<script setup lang="ts">
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'
import { ref } from 'vue'

import type { GuidelineTab } from '@ct/content/topics'

defineProps<{
  tabs: GuidelineTab[]
}>()

const selectedIndex = ref(0)
</script>

<template>
  <section id="guidelines" class="ct-section-anchor ct-card flex min-h-80 flex-col overflow-hidden">
    <div class="border-b border-slate-100 px-4 py-3 md:px-5">
      <h2 class="font-mono text-sm font-bold uppercase tracking-[0.15em] text-slate-600">
        Guidelines
      </h2>
      <p class="mt-0.5 text-xs text-slate-500">Tap a topic — one screen, no scrolling required.</p>
    </div>

    <TabGroup v-model="selectedIndex" as="div" class="flex min-h-0 flex-1 flex-col">
      <TabList class="flex flex-wrap gap-1 border-b border-slate-100 bg-slate-50/80 px-3 py-2 md:px-4">
        <Tab
          v-for="tab in tabs"
          :key="tab.id"
          v-slot="{ selected }"
          as="template"
        >
          <button
            type="button"
            :class="[
              'rounded-md px-2.5 py-1.5 font-mono text-xs transition',
              selected
                ? 'bg-white font-bold text-purple-700 shadow-sm ring-1 ring-purple-200'
                : 'text-slate-500 hover:bg-white/70 hover:text-slate-700',
            ]"
          >
            {{ tab.tabLabel }}
          </button>
        </Tab>
      </TabList>

      <TabPanels class="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-5 md:py-5">
        <TabPanel
          v-for="tab in tabs"
          :key="tab.id"
          class="focus:outline-none"
          :aria-labelledby="`${tab.id}-title`"
        >
          <div class="flex items-start justify-between gap-2">
            <h3 :id="`${tab.id}-title`" class="text-base font-bold text-slate-800">
              {{ tab.title }}
            </h3>
            <span
              v-if="tab.status === 'draft'"
              class="shrink-0 rounded-full bg-slate-200 px-2 py-0.5 font-mono text-[0.6rem] uppercase text-slate-600"
            >
              draft
            </span>
          </div>

          <ul class="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-600">
            <li v-for="(bullet, index) in tab.bullets" :key="index" class="flex gap-2.5">
              <span class="mt-2 size-1.5 shrink-0 rounded-full bg-purple-400" aria-hidden="true" />
              <span>{{ bullet }}</span>
            </li>
          </ul>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </section>
</template>
