<script setup lang="ts">
import { computed } from 'vue'

import { TIMELINE } from '@/explorations/TIMELINE'
import { mcpDocsEipPage } from '@/libs/roadmapUrls'

import type { Exploration } from './REGISTRY'
import type { Topic } from './TOPICS'

const props = withDefaults(
  defineProps<{
    explorationId: string
    exploration: Exploration
    topic: Topic
    /** Home preview cards sit inside RouterLink — stop pill clicks from navigating. */
    stopPropagation?: boolean
  }>(),
  { stopPropagation: false },
)

const pillLinkClass =
  'exploration-meta-pill inline-flex items-center justify-center font-mono rounded-full border no-underline cursor-pointer transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 text-xs px-3 py-2 min-h-11 sm:min-h-0 sm:px-2 sm:py-0.5 sm:text-[0.65rem]'

const timelineLabel = computed(
  () => TIMELINE[props.exploration.timeline]?.title ?? props.exploration.timeline,
)
const timelineBrowseTo = computed(() => ({
  path: '/all',
  query: { timeline: props.exploration.timeline },
}))

const showMcpPill = computed(
  () =>
    props.exploration.mcpDocsStatus === 'runnable' ||
    props.exploration.mcpDocsStatus === 'planned-module',
)
const mcpDocsUrl = computed(() => mcpDocsEipPage(props.explorationId))

function onPillClick(event: Event) {
  if (props.stopPropagation) {
    event.stopPropagation()
  }
}
</script>

<template>
  <div
    class="exploration-meta-pills flex flex-wrap gap-2 sm:gap-1.5"
    data-testid="exploration-meta-pills"
  >
    <RouterLink
      :to="topic.path"
      :class="[pillLinkClass, 'e-border e-bg-medium e-text']"
      data-testid="preview-pill-topic"
      @click="onPillClick"
    >
      {{ topic.title }}
    </RouterLink>
    <RouterLink
      :to="timelineBrowseTo"
      :class="[pillLinkClass, 'border-slate-300 text-slate-600']"
      data-testid="preview-pill-timeline"
      @click="onPillClick"
    >
      {{ timelineLabel }}
    </RouterLink>
    <a
      v-if="showMcpPill"
      :href="mcpDocsUrl"
      target="_blank"
      rel="noopener noreferrer"
      :class="[pillLinkClass, 'border-slate-300 text-slate-500']"
      data-testid="preview-pill-mcp"
      aria-label="MCP docs for this EIP"
      @click="onPillClick"
    >
      MCP
    </a>
  </div>
</template>
