<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { Squares2X2Icon } from '@heroicons/vue/24/outline'

import { EXPLORATIONS } from '@/explorations/REGISTRY'

const selectedRoute = defineModel<string>({ required: true })

const explorations = Object.values(EXPLORATIONS)

const selectedLabel = computed(() => {
  if (!selectedRoute.value) return 'All Explorations'
  const exploration = explorations.find((e) => e.path === selectedRoute.value)
  return exploration?.title ?? 'All Explorations'
})

/** Match `<body class="px-3 …">` so the mobile panel aligns with page content. */
const mobilePanelTop = ref<string | null>(null)

async function syncMobilePanelTop() {
  await nextTick()
  if (typeof window === 'undefined' || !window.matchMedia('(max-width: 639px)').matches) {
    mobilePanelTop.value = null
    return
  }
  const button = document.getElementById('exploration-navi')
  if (!button) return
  mobilePanelTop.value = `${button.getBoundingClientRect().bottom + 4}px`
}
</script>

<template>
  <Listbox v-model="selectedRoute">
    <div class="relative inline-block sm:w-auto">
      <ListboxButton
        id="exploration-navi"
        class="inline-flex cursor-pointer items-center justify-center min-h-11 min-w-11 shrink-0 rounded-md border border-slate-400 bg-white p-2.5 text-slate-600 sm:ml-6 sm:min-h-11 sm:w-auto sm:max-w-md sm:justify-between sm:gap-2 sm:px-3 sm:py-2 sm:text-left md:min-h-9 md:py-1.5 font-mono text-base font-normal text-slate-500 md:text-xs"
        aria-label="Switch exploration"
        @click="syncMobilePanelTop"
      >
        <Squares2X2Icon class="size-5 sm:hidden" aria-hidden="true" />
        <span class="hidden min-w-0 line-clamp-2 sm:inline">{{ selectedLabel }}</span>
        <ChevronUpDownIcon class="hidden size-3.5 opacity-50 sm:block" aria-hidden="true" />
      </ListboxButton>

      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <ListboxOptions
          :style="mobilePanelTop ? { top: mobilePanelTop } : undefined"
          class="absolute right-0 z-30 mt-1 max-h-60 overflow-y-auto overflow-x-hidden rounded-md border border-slate-400 bg-white font-mono text-base shadow-md focus:outline-none max-sm:fixed max-sm:left-3 max-sm:right-3 max-sm:mt-0 max-sm:w-auto max-sm:max-w-none sm:min-w-full sm:w-max sm:max-w-[min(100vw-1.5rem,36rem)] md:text-xs"
        >
          <ListboxOption value="" v-slot="{ active, selected }" as="template">
            <li
              :class="[
                'cursor-pointer px-3 py-2 select-none text-slate-500 max-sm:whitespace-normal max-sm:break-words sm:whitespace-nowrap',
                active ? 'bg-slate-50 text-slate-700' : '',
                selected ? 'font-bold text-slate-700' : '',
              ]"
            >
              All Explorations
            </li>
          </ListboxOption>
          <ListboxOption
            v-for="exploration in explorations"
            :key="exploration.id"
            :value="exploration.path"
            v-slot="{ active, selected }"
            as="template"
          >
            <li
              :class="[
                'cursor-pointer px-3 py-2 text-left select-none text-slate-500 max-sm:whitespace-normal max-sm:break-words sm:whitespace-nowrap',
                active ? 'bg-slate-50 text-slate-700' : '',
                selected ? 'font-bold text-slate-700' : '',
              ]"
            >
              {{ exploration.title }}
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
