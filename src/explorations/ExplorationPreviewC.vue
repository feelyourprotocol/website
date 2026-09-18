<script setup lang="ts">
import { computed } from 'vue'

import ExplorationMetaPills from './ExplorationMetaPills.vue'
import { type Exploration, getExplorationThumbnailImage } from './REGISTRY'
import SpecSnapshotUIC from './SpecSnapshotUIC.vue'
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
</script>

<template>
  <article
    :id="explorationId + '-c'"
    :style="topicCSSVars(topic.color)"
    :class="[
      'exploration-c exploration-preview-c neon-glow-hover bg-white rounded-lg shadow-sm h-full',
      TOPIC_COLORS[topic.color].classes.borderCard,
      size === 'featured' ? 'p-4' : 'p-3',
    ]"
  >
    <div :class="size === 'featured' ? 'flex flex-col gap-3' : 'flex gap-3 items-start'">
      <div
        v-if="thumbnail && size === 'featured'"
        class="overflow-hidden rounded-lg w-full max-h-48 border border-slate-200/70 bg-white"
      >
        <img
          :src="thumbnail"
          alt=""
          class="w-full max-h-48 object-contain mx-auto block"
          loading="lazy"
          decoding="async"
        />
      </div>
      <img
        v-else-if="thumbnail"
        :src="thumbnail"
        alt=""
        class="w-16 h-20 object-cover rounded-lg shrink-0"
        loading="lazy"
        decoding="async"
      />

      <div class="min-w-0 flex-1">
        <div class="relative z-10 flex items-start gap-2">
          <h3
            class="font-bold tracking-tight flex-1 min-w-0 e-text"
            :class="size === 'featured' ? 'text-lg' : 'text-sm'"
          >
            {{ exploration.title }}
          </h3>
          <SpecSnapshotUIC :exploration="exploration" />
        </div>

        <p class="font-mono text-xs leading-relaxed text-slate-600 mt-1.5">
          {{ exploration.coreQuestion }}
        </p>

        <ExplorationMetaPills
          class="mt-2.5"
          :exploration-id="explorationId"
          :exploration="exploration"
          :topic="topic"
          stop-propagation
        />
      </div>
    </div>
  </article>
</template>
