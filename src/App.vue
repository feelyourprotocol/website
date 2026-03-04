<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'

import { EXPLORATIONS } from '@/explorations/REGISTRY'

const router = useRouter()
const route = useRoute()
const selectedRoute = ref(route.path.includes('eip-') ? route.path : '')

const selectedLabel = computed(() => {
  if (!selectedRoute.value) return 'All Explorations'
  const entry = Object.entries(EXPLORATIONS).find(([, e]) => e.path === selectedRoute.value)
  return entry ? entry[0].toUpperCase() : 'All Explorations'
})

watch(selectedRoute, (path) => {
  const target = path || '/'
  if (route.path !== target) {
    router.push(target)
  }
})

watch(
  () => route.path,
  (newPath) => {
    const expected = newPath.includes('eip-') ? newPath : ''
    if (selectedRoute.value !== expected) {
      selectedRoute.value = expected
    }
  },
)
</script>

<template>
  <header class="mt-3 mb-8">
    <div class="grid grid-cols-2 mb-3">
      <h1>
        <RouterLink
          to="/"
          class="text-2xl md:text-4xl font-bold tracking-wider bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent"
          ><span class="text-purple-500">◆</span> Feel Your Protocol</RouterLink
        >
      </h1>
      <nav class="font-mono text-sm text-right flex justify-end items-center">
        <Listbox v-model="selectedRoute">
          <div class="relative inline-block">
            <ListboxButton
              class="inline-flex items-center gap-1 text-sm ml-6 border-1 p-1 rounded-sm cursor-pointer"
              id="exploration-navi"
            >
              {{ selectedLabel }}
              <ChevronUpDownIcon class="size-4 opacity-60" />
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
                class="absolute right-0 z-20 mt-1 w-max max-h-60 overflow-auto rounded-sm border border-slate-300 bg-white text-sm shadow-lg focus:outline-none"
              >
                <ListboxOption value="" v-slot="{ active, selected }" as="template">
                  <li
                    :class="[
                      'cursor-pointer whitespace-nowrap px-3 py-1.5 select-none first:rounded-t-sm last:rounded-b-sm',
                      active ? 'bg-slate-100' : '',
                      selected ? 'font-bold' : '',
                    ]"
                  >
                    All Explorations
                  </li>
                </ListboxOption>
                <ListboxOption
                  v-for="[id, exploration] in Object.entries(EXPLORATIONS)"
                  :key="id"
                  :value="exploration.path"
                  v-slot="{ active, selected }"
                  as="template"
                >
                  <li
                    :class="[
                      'cursor-pointer whitespace-nowrap px-3 py-1.5 select-none first:rounded-t-sm last:rounded-b-sm',
                      active ? 'bg-slate-100' : '',
                      selected ? 'font-bold' : '',
                    ]"
                  >
                    {{ id.toUpperCase() }}
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </nav>
    </div>
    <p class="text-lg md:text-xl text-slate-500 tracking-wide terminal-cursor">
      Interactive Ethereum Protocol Explorations.
    </p>
  </header>

  <RouterView :key="route.path" class="grid grid-cols-1" />

  <footer class="footer-accent grid grid-cols-2 pt-3 mt-10 mb-2">
    <h3 class="font-mono text-xs text-slate-500">
      <span class="text-purple-500">◆</span> Made with ❤️ and pure dedication by
      <a href="https://x.com/HolgerD77" target="_blank" rel="noopener">HolgerD77</a>
    </h3>

    <h3 class="font-mono text-xs text-right text-slate-500">
      <RouterLink to="/imprint">Imprint</RouterLink>
      <span class="text-purple-500 mx-2">◆</span>
      <a
        href="https://github.com/feelyourprotocol/website"
        target="_blank"
        rel="noopener"
        >GitHub</a
      >
    </h3>
  </footer>
</template>
