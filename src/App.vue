<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

import ExplorationNavListbox from '@/components/ExplorationNavListbox.vue'
import { FYP_X_URL, ROADMAP_HOME } from '@/libs/roadmapUrls'
import logoUrl from '@/logo.png'
import { useVideoMode } from '@/video/useVideoMode'
import VideoShell from '@/video/VideoShell.vue'

const router = useRouter()
const route = useRoute()
const isVideoMode = useVideoMode()
const selectedRoute = ref(route.path.includes('eip-') ? route.path : '')

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
        <div class="flex items-start justify-between gap-2 min-w-0 sm:contents">
          <div class="site-title min-w-0 flex-1 sm:col-start-1 sm:row-start-1">
            <RouterLink
              to="/"
              class="inline-flex max-w-full items-center gap-2.5 md:gap-3 text-2xl md:text-4xl font-bold tracking-wider whitespace-nowrap no-underline"
            >
              <img
                :src="logoUrl"
                alt=""
                class="h-[1em] w-auto shrink-0"
                width="108"
                height="128"
                fetchpriority="high"
              />
              <span
                class="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent"
                >Feel Your Protocol</span
              >
            </RouterLink>
          </div>
          <nav
            class="flex shrink-0 items-center sm:col-start-2 sm:row-start-1 sm:justify-end sm:text-right"
          >
            <ExplorationNavListbox v-model="selectedRoute" @update:model-value="navigate" />
          </nav>
        </div>
        <p
          class="flex items-baseline text-sm md:text-xl text-slate-500 tracking-wide sm:col-span-2 sm:row-start-2"
        >
          <span class="shrink-0">Ethereum Protocol Explorations for Humans and AI</span>
          <span class="protocol-dots hidden sm:inline flex-1 overflow-hidden whitespace-nowrap"
            >· · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·
            · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·
            · · · · · · · · · · · ·</span
          >
        </p>
      </div>
    </header>

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
