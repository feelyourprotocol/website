<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import TooltipUIC from '@/eComponents/ui/TooltipUIC.vue'
import { TIMELINE } from '@/explorations/TIMELINE'

const props = defineProps<{
  basePath?: string
}>()

const route = useRoute()
const router = useRouter()

const sortedEntries = Object.entries(TIMELINE).sort(([, a], [, b]) => a.order - b.order)

const activeTimeline = computed(() => route.query.timeline as string | undefined)

function navigate(timelineId: string) {
  if (props.basePath) {
    router.push({ path: props.basePath, query: { timeline: timelineId } })
  } else {
    router.push({ query: { ...route.query, timeline: timelineId } })
  }
}

function reset() {
  const query = { ...route.query }
  delete query.timeline
  router.push({ query })
}
</script>

<template>
  <div class="border border-slate-400 bg-white rounded-lg p-3">
    <div class="flex flex-col">
      <div v-for="([id, entry], index) in sortedEntries" :key="id" class="flex">
        <!-- Circle with connecting dotted segments -->
        <div class="flex flex-col items-center w-6 shrink-0">
          <div
            class="flex-1 w-0"
            :class="index > 0 ? 'border-l-2 border-dotted border-slate-400' : ''"
          />
          <div
            class="w-3 h-3 rounded-full border-2 shrink-0 transition-colors duration-300"
            :class="
              activeTimeline === id ? 'border-slate-700 bg-slate-700' : 'border-slate-500 bg-white'
            "
          />
          <div
            class="flex-1 w-0"
            :class="
              index < sortedEntries.length - 1 ? 'border-l-2 border-dotted border-slate-400' : ''
            "
          />
        </div>

        <!-- Clickable emoji + name -->
        <div class="group relative flex items-center py-1">
          <button
            class="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-sm cursor-pointer transition-all duration-300 hover:bg-slate-50"
            @click="navigate(id)"
          >
            <span class="emoji-mono">{{ entry.emoji }}</span>
            <span
              :class="activeTimeline === id ? 'text-slate-800 font-semibold' : 'text-slate-600'"
              >{{ entry.title }}</span
            >
          </button>
          <button
            v-if="!basePath && activeTimeline === id"
            class="ml-0.5 text-sm text-slate-400 hover:text-slate-600 cursor-pointer"
            @click.stop="reset"
          >
            ✕
          </button>
          <TooltipUIC :tooltip="entry.shortDescription" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.emoji-mono {
  display: inline-block;
  min-width: 1.25em;
  filter: grayscale(1) contrast(1.5);
}
</style>
