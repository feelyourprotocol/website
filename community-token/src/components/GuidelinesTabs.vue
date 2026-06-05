<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLocationHash } from '@ct/composables/useLocationHash'
import type { GuidelineTab } from '@ct/content/topics'
import { HOW_IT_WORKS } from '@ct/content/topics'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'

const props = defineProps<{
  tabs: GuidelineTab[]
}>()

const { hash, setHash } = useLocationHash()
const selectedIndex = ref(0)

function indexFromHash(id: string): number {
  if (!id) return -1
  return props.tabs.findIndex((tab) => tab.id === id)
}

function syncFromHash(id: string, scroll: boolean): void {
  const index = indexFromHash(id)
  if (index < 0) return
  selectedIndex.value = index
  if (scroll) {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function onSelectTab(index: number): void {
  selectedIndex.value = index
  const tab = props.tabs[index]
  if (tab) {
    setHash(tab.id)
  }
}

watch(
  hash,
  (id) => {
    syncFromHash(id, true)
  },
  { immediate: true },
)
</script>

<template>
  <section id="how-it-works" class="ct-section-anchor ct-card flex min-h-64 flex-col overflow-hidden">
    <div class="border-b border-slate-100 px-4 py-3 md:px-5">
      <h2 class="font-mono text-sm font-bold uppercase tracking-[0.15em] text-slate-600">
        {{ HOW_IT_WORKS.title }}
      </h2>
      <p class="mt-0.5 text-xs text-slate-500">{{ HOW_IT_WORKS.subtitle }}</p>
    </div>

    <TabGroup
      :selected-index="selectedIndex"
      as="div"
      class="flex min-h-0 flex-1 flex-col"
      @change="onSelectTab"
    >
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

          <p v-if="tab.intro" class="mt-2 text-sm leading-relaxed text-slate-600">
            {{ tab.intro }}
          </p>

          <ul class="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-600">
            <li v-for="(bullet, index) in tab.bullets" :key="index" class="flex gap-2.5">
              <span class="mt-2 size-1.5 shrink-0 rounded-full bg-purple-400" aria-hidden="true" />
              <span>{{ bullet }}</span>
            </li>
          </ul>
        </TabPanel>
      </TabPanels>
    </TabGroup>

    <p
      class="border-t border-slate-100 px-4 py-2.5 font-mono text-[0.65rem] leading-relaxed text-slate-400 md:px-5"
    >
      {{ HOW_IT_WORKS.footnote }}
    </p>
  </section>
</template>
