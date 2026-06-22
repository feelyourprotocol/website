<script setup lang="ts">
import { computed } from 'vue'

import { type Topic, TOPIC_COLORS, topicCSSVars } from '@/explorations/TOPICS'

const props = withDefaults(
  defineProps<{
    topic: Topic
    image: string
    overviewMode?: boolean
    /** Show topic heading above intro (home topic cards only). */
    showTopicHeading?: boolean
    /** Max height for the cover image (exploration sidebar); image scales down proportionally, fully visible. */
    imageBoxHeight?: string
  }>(),
  {
    overviewMode: false,
    showTopicHeading: false,
  },
)

const cssVars = topicCSSVars(props.topic.color)
const isCompactImage = computed(() => props.imageBoxHeight !== undefined && !props.overviewMode)

const getImageUrl = (image: string) =>
  image.includes('/') ? image : new URL(`../assets/imgs/dancers/${image}`, import.meta.url).href
</script>

<template>
  <div
    :style="cssVars"
    :class="[
      'topic-intro-card bg-white rounded-lg shadow-sm',
      isCompactImage ? 'px-3 pt-1.5 pb-1' : 'p-5',
      TOPIC_COLORS[topic.color].classes.borderCard,
    ]"
  >
    <h2
      v-if="overviewMode && showTopicHeading"
      class="text-2xl md:text-3xl font-bold tracking-tight mb-4 e-text"
    >
      {{ topic.title }}
    </h2>

    <template v-if="overviewMode">
      <img
        :src="getImageUrl(image)"
        alt=""
        class="float-right ml-3 mb-2 w-[38%] max-w-[9rem] rounded-md"
        loading="lazy"
        decoding="async"
      />
      <p v-if="topic.introText" class="text-sm leading-relaxed text-slate-600">
        {{ topic.introText }}
      </p>
      <div class="clear-both"></div>
    </template>

    <template v-else>
      <img
        :src="getImageUrl(image)"
        alt=""
        class="rounded-md mx-auto block w-auto max-w-full leading-none"
        :class="imageBoxHeight ? '' : 'w-full'"
        :style="imageBoxHeight ? { maxHeight: imageBoxHeight } : undefined"
        loading="lazy"
        decoding="async"
      />
    </template>
  </div>
</template>
