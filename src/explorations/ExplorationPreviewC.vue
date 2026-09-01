<script setup lang="ts">
import { computed } from 'vue'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/solid'

import ButtonUIC from '@/eComponents/ui/ButtonUIC.vue'
import { TIMELINE } from '@/explorations/TIMELINE'

import { type Exploration, getExplorationThumbnailImage } from './REGISTRY'
import { type Topic, TOPIC_COLORS, topicCSSVars } from './TOPICS'

const props = withDefaults(
  defineProps<{
    explorationId: string
    exploration: Exploration
    topic: Topic
    size?: 'featured' | 'catalog'
  }>(),
  { size: 'catalog' },
)

const thumbnail = computed(() => getExplorationThumbnailImage(props.exploration))
const timelineLabel = computed(
  () => TIMELINE[props.exploration.timeline]?.title ?? props.exploration.timeline,
)
const mcpLabel = computed(() => {
  if (props.exploration.mcpDocsStatus === 'runnable') return 'MCP Runnable'
  if (props.exploration.mcpDocsStatus === 'planned-module') return 'MCP Planned'
  return undefined
})
</script>

<template>
  <article
    :id="explorationId + '-c'"
    :style="topicCSSVars(topic.color)"
    :class="[
      'exploration-c exploration-preview-c bg-white rounded-lg shadow-sm h-full',
      TOPIC_COLORS[topic.color].classes.borderCard,
      size === 'featured' ? 'p-4' : 'p-3',
    ]"
  >
    <div :class="size === 'featured' ? 'flex flex-col gap-3' : 'flex gap-3 items-start'">
      <img
        v-if="thumbnail"
        :src="thumbnail"
        alt=""
        :class="
          size === 'featured'
            ? 'w-full max-h-48 object-contain rounded-md mx-auto'
            : 'w-16 h-20 object-cover rounded-md shrink-0'
        "
        loading="lazy"
        decoding="async"
      />

      <div class="min-w-0 flex-1">
        <div class="flex items-start gap-2">
          <h3
            class="font-bold tracking-tight flex-1 min-w-0 e-text"
            :class="size === 'featured' ? 'text-lg' : 'text-sm'"
          >
            {{ exploration.title }}
          </h3>
          <a
            :href="exploration.infoURL"
            target="_blank"
            rel="noopener noreferrer"
            class="visit-exploration-button shrink-0"
            @click.stop
          >
            <ButtonUIC
              :icon="ArrowTopRightOnSquareIcon"
              tooltip="External Link with more information"
            />
          </a>
        </div>

        <p class="font-mono text-xs leading-relaxed text-slate-600 mt-1.5">
          {{ exploration.coreQuestion }}
        </p>

        <div class="flex flex-wrap gap-1.5 mt-2.5">
          <span
            class="text-[0.65rem] font-mono px-2 py-0.5 rounded-full border e-border e-bg-medium e-text"
          >
            {{ topic.title }}
          </span>
          <span
            class="text-[0.65rem] font-mono px-2 py-0.5 rounded-full border border-slate-300 text-slate-600"
          >
            {{ timelineLabel }}
          </span>
          <span
            v-if="mcpLabel"
            class="text-[0.65rem] font-mono px-2 py-0.5 rounded-full border border-slate-300 text-slate-500"
          >
            {{ mcpLabel }}
          </span>
        </div>
      </div>
    </div>
  </article>
</template>
