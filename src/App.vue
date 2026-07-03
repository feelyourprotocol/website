<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'

import { EXPLORATIONS } from '@/explorations/REGISTRY'
import { FYP_X_URL, ROADMAP_HOME } from '@/libs/roadmapUrls'
import logoUrl from '@/logo.png'
import VideoShell from '@/video/VideoShell.vue'
import { useVideoMode } from '@/video/useVideoMode'

const router = useRouter()
const route = useRoute()
const isVideoMode = useVideoMode()
const selectedRoute = ref(route.path.includes('eip-') ? route.path : '')

const selectedLabel = computed(() => {
  if (!selectedRoute.value) return 'All Explorations'
  const exploration = Object.values(EXPLORATIONS).find((e) => e.path === selectedRoute.value)
  return exploration?.title ?? 'All Explorations'
})

function navigate(path: string) {
  const target = path || '/'
  if (route.path !== target) {
    router.push(target)
  }
}

watch(
  () => route.path,
  (newPath) => {
    const expected = newPath.includes('eip-') ? newPath : ''
    if (selectedRoute.value !== expected) {
      selectedRoute.value = expected
    }
  },
)

watch(
  isVideoMode,
  (active) => {
    document.documentElement.classList.toggle('fyp-video-capture', active)
  },
  { immediate: true },
)

onUnmounted(() => {
  document.documentElement.classList.remove('fyp-video-capture', 'fyp-video-band-active')
})
</script>

<template>
  <div :class="isVideoMode ? 'fyp-video-mode min-h-dvh bg-black' : ''">
    <header v-if="!isVideoMode" class="mt-3 mb-4">
    <div class="flex flex-col gap-2 sm:grid sm:grid-cols-2">
      <div class="site-title sm:col-start-1 sm:row-start-1">
        <RouterLink
          to="/"
          class="inline-flex items-center gap-2.5 md:gap-3 text-2xl md:text-4xl font-bold tracking-wider whitespace-nowrap no-underline"
        >
          <img
            :src="logoUrl"
            alt=""
            class="h-[1em] w-auto shrink-0"
            width="108"
            height="128"
            fetchpriority="high"
          />
          <span class="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent"
            >Feel Your Protocol</span
          >
        </RouterLink>
      </div>
      <p
        class="flex items-baseline text-sm md:text-xl text-slate-500 tracking-wide sm:col-span-2 sm:row-start-2"
      >
        <span class="shrink-0">Interactive Ethereum Protocol Explorations</span>
        <span class="protocol-dots hidden sm:inline flex-1 overflow-hidden whitespace-nowrap"
          >· · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·
          · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·
          · · · · · · · · · ·</span
        >
      </p>
      <nav
        class="font-mono text-sm sm:col-start-2 sm:row-start-1 sm:text-right flex sm:justify-end items-center"
      >
        <Listbox v-model="selectedRoute" @update:model-value="navigate">
          <div class="relative inline-block w-full sm:w-auto">
            <ListboxButton
              class="inline-flex items-center justify-between gap-2 w-full sm:w-auto sm:max-w-md text-sm sm:ml-6 border border-slate-400 bg-white rounded-md text-slate-500 px-3 py-2 min-h-11 cursor-pointer text-left"
              id="exploration-navi"
            >
              <span class="min-w-0 line-clamp-2">{{ selectedLabel }}</span>
              <ChevronUpDownIcon class="size-3.5 opacity-50" />
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
                class="absolute right-0 z-20 mt-1 w-max max-h-60 overflow-auto rounded-md border border-slate-400 bg-white text-sm shadow-md focus:outline-none"
              >
                <ListboxOption value="" v-slot="{ active, selected }" as="template">
                  <li
                    :class="[
                      'cursor-pointer whitespace-nowrap px-3 py-2 select-none text-slate-500',
                      active ? 'bg-slate-50 text-slate-700' : '',
                      selected ? 'font-bold text-slate-700' : '',
                    ]"
                  >
                    All Explorations
                  </li>
                </ListboxOption>
                <ListboxOption
                  v-for="exploration in Object.values(EXPLORATIONS)"
                  :key="exploration.id"
                  :value="exploration.path"
                  v-slot="{ active, selected }"
                  as="template"
                >
                  <li
                    :class="[
                      'cursor-pointer text-left max-w-xs sm:max-w-md px-3 py-2 select-none text-slate-500',
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
      </nav>
    </div>
  </header>

  <aside
    v-if="!isVideoMode"
    class="mb-4 rounded-lg border border-purple-200/80 bg-gradient-to-r from-purple-50/90 to-cyan-50/70 px-4 py-3 shadow-sm"
  >
    <p class="font-mono text-xs leading-relaxed text-slate-700 sm:text-sm">
      <span class="font-bold text-purple-700">Phase 3</span>
      — we're designing a deterministic API &amp; MCP server for the future Ethereum protocol
      (upcoming forks &amp; EIPs) for AI agents.
      <a
        :href="ROADMAP_HOME"
        target="_blank"
        rel="noopener"
        class="ml-1 font-semibold text-purple-700 underline decoration-purple-300 underline-offset-2 hover:text-purple-900"
        >Read the roadmap ↗</a
      >
    </p>
  </aside>

  <RouterView :key="route.fullPath" class="grid grid-cols-1" />

  <VideoShell v-if="isVideoMode" />

  <footer v-if="!isVideoMode" class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 mt-10 mb-2">
    <h3 class="font-mono text-xs text-slate-500">
      <span class="text-purple-500">◆</span> Made with ❤️ and pure dedication by
      <a href="https://x.com/HolgerD77" target="_blank" rel="noopener">HolgerD77</a>
      <span class="text-purple-500 mx-2">◆</span>
      <RouterLink to="/imprint">Imprint</RouterLink>
    </h3>

    <h3 class="font-mono text-xs text-slate-500 sm:text-right">
      <a :href="ROADMAP_HOME" target="_blank" rel="noopener">Roadmap</a>
      <span class="text-purple-500 mx-2">◆</span>
      <a href="https://community-token.feelyourprotocol.org/" target="_blank" rel="noopener"
        >Community Token</a
      >
      <span class="text-purple-500 mx-2">◆</span>
      <a :href="FYP_X_URL" target="_blank" rel="noopener">X</a>
      <span class="text-purple-500 mx-2">◆</span>
      <a href="https://github.com/feelyourprotocol/website" target="_blank" rel="noopener"
        >GitHub</a
      >
    </h3>
  </footer>
  </div>
</template>
