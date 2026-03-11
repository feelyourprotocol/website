<script setup lang="ts">
import { type Topic, TOPIC_COLORS, topicCSSVars } from '@/explorations/TOPICS'

const props = withDefaults(
  defineProps<{
    topic: Topic
    image: string
    overviewMode?: boolean
  }>(),
  {
    overviewMode: false,
  },
)

const cssVars = topicCSSVars(props.topic.color)

const getImageUrl = (image: string) =>
  image.includes('/') ? image : new URL(`../assets/imgs/dancers/${image}`, import.meta.url).href
</script>

<template>
  <div
    :style="cssVars"
    :class="[
      'topic-intro-card bg-white rounded-lg p-5 shadow-sm',
      TOPIC_COLORS[topic.color].classes.borderCard,
    ]"
  >
    <h2 v-if="overviewMode" class="text-2xl md:text-3xl font-bold tracking-tight mb-4 e-text">
      {{ topic.title }}
    </h2>
    <h2 v-else class="text-lg md:text-xl font-bold tracking-tight mb-3 text-right e-text">
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
      <img :src="getImageUrl(image)" class="rounded-md" />
    </template>
  </div>
</template>
