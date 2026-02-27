<script setup lang="ts">
import { type Topic, TOPIC_COLOR_CLASSES } from './TOPICS'

const props = defineProps<{
  poweredBy: { name: string; href: string }[]
  topic: Topic
}>()

const cc = TOPIC_COLOR_CLASSES[props.topic.color]
</script>
<template>
  <div class="text-right text-xs mt-7">
    Powered by:
    <template v-for="(item, index) in poweredBy" :key="item.name">
      <a :href="item.href" class="font-bold" :class="cc.text900" target="_blank" rel="noopener">{{
        item.name
      }}</a>
      <span v-if="index < poweredBy.length - 1"> | </span>
    </template>
  </div>
</template>
