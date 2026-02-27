<script setup lang="ts">
import { type Topic, TOPIC_COLOR_CLASSES } from '@/explorations/TOPICS'

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

const cc = TOPIC_COLOR_CLASSES[props.topic.color]

const getImageUrl = (image: string) =>
  image.includes('/') ? image : new URL(`../assets/imgs/dancers/${image}`, import.meta.url).href
</script>

<template>
  <div class="border-2 bg-clip-border p-6 rounded-xl" :class="cc.border200">
    <h2 v-if="overviewMode" class="text-3xl md:text-4xl font-bold mb-4" :class="cc.text900">
      {{ topic.title }}
    </h2>
    <h2 v-else class="text-1xl md:text-2xl font-bold mb-4 text-right" :class="cc.text900">
      <RouterLink :to="topic.path" class="hover:underline">{{ topic.title }} ↑</RouterLink>
    </h2>

    <template v-if="overviewMode">
      <div class="md:hidden">
        <img :src="getImageUrl(image)" class="mx-auto mb-4 max-w-xs" />
        <p v-if="topic.introText" class="text-sm leading-relaxed" :class="cc.text900">
          {{ topic.introText }}
        </p>
      </div>

      <div class="hidden md:block">
        <img :src="getImageUrl(image)" class="float-right ml-5 mb-3 max-w-[45%]" />
        <p v-if="topic.introText" class="text-sm leading-relaxed" :class="cc.text900">
          {{ topic.introText }}
        </p>
        <div class="clear-both"></div>
      </div>
    </template>

    <template v-else>
      <img :src="getImageUrl(image)" />
    </template>
  </div>
</template>
