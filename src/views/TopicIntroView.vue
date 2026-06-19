<script setup lang="ts">
import { computed } from 'vue'

import { type Topic, TOPIC_COLORS, topicCSSVars } from '@/explorations/TOPICS'

const props = withDefaults(
  defineProps<{
    topic: Topic
    image: string
    overviewMode?: boolean
    pageTitle?: boolean
    /** Max height for the cover image (exploration sidebar); image scales down proportionally, fully visible. */
    imageBoxHeight?: string
  }>(),
  {
    overviewMode: false,
    pageTitle: false,
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
    <component
      :is="overviewMode && pageTitle ? 'h1' : 'h2'"
      v-if="overviewMode"
      class="text-2xl md:text-3xl font-bold tracking-tight mb-4 e-text"
    >
      {{ topic.title }}
    </component>
    <h2
      v-else
      :class="[
        'font-bold tracking-tight text-right e-text',
        isCompactImage ? 'text-sm mb-1 leading-tight' : 'text-lg md:text-xl mb-3',
      ]"
    >
      <RouterLink :to="topic.path" class="hover:underline">{{ topic.title }} ↑</RouterLink>
    </h2>

    <template v-if="overviewMode">
      <div class="md:hidden">
        <img :src="getImageUrl(image)" class="mx-auto mb-4 max-w-xs rounded-md" />
        <p v-if="topic.introText" class="text-sm leading-relaxed text-slate-600">
          {{ topic.introText }}
        </p>
      </div>

      <div class="hidden md:block">
        <img :src="getImageUrl(image)" class="float-right ml-5 mb-3 max-w-[45%] rounded-md" />
        <p v-if="topic.introText" class="text-sm leading-relaxed text-slate-600">
          {{ topic.introText }}
        </p>
        <div class="clear-both"></div>
      </div>
    </template>

    <template v-else>
      <img
        :src="getImageUrl(image)"
        alt=""
        class="rounded-md mx-auto block w-auto max-w-full leading-none"
        :class="imageBoxHeight ? '' : 'w-full'"
        :style="imageBoxHeight ? { maxHeight: imageBoxHeight } : undefined"
      />
    </template>
  </div>
</template>
