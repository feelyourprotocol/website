<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { computeTagCloud } from '@/libs/tagCloud'

const props = defineProps<{
  explorationIds: string[]
  basePath?: string
}>()

const route = useRoute()
const router = useRouter()

const activeTag = computed(() => route.query.tag as string | undefined)

const items = computed(() => computeTagCloud(props.explorationIds))

function navigate(tagKey: string) {
  if (props.basePath) {
    const query: Record<string, string> = { tag: tagKey }
    if (route.query.timeline) query.timeline = route.query.timeline as string
    router.push({ path: props.basePath, query })
  } else {
    router.push({ query: { ...route.query, tag: tagKey } })
  }
}

function reset() {
  const query = { ...route.query }
  delete query.tag
  router.push({ query })
}
</script>

<template>
  <div class="border border-slate-400 bg-white rounded-lg p-3">
    <div class="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 py-1">
      <button
        v-for="item in items"
        :key="item.key"
        class="tag-item cursor-pointer rounded-md px-1.5 py-0.5 transition-all duration-300 hover:bg-slate-50"
        :class="activeTag === item.key ? 'text-slate-800 font-semibold' : 'text-slate-600'"
        :style="{ fontSize: item.fontSize + 'rem' }"
        @click="navigate(item.key)"
      >
        {{ item.label }}
      </button>
    </div>
    <div v-if="!basePath && activeTag" class="text-center mt-1">
      <button
        class="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
        @click="reset"
      >
        ✕ clear tag
      </button>
    </div>
  </div>
</template>
