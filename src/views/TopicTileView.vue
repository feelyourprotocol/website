<script setup lang="ts">
import { type Topic, TOPIC_COLORS, topicCSSVars } from '@/explorations/TOPICS'

const props = defineProps<{
  topic: Topic
  topicId: string
}>()

const empty = props.topic.explorations.length === 0
const count = props.topic.explorations.length
</script>

<template>
  <div
    :style="topicCSSVars(topic.color)"
    :class="[
      'topic-tile rounded-lg p-3 h-full',
      empty
        ? 'border border-dashed border-slate-300 bg-white/60'
        : ['bg-white shadow-sm', TOPIC_COLORS[topic.color].classes.borderCard],
    ]"
    :data-topic-id="topicId"
  >
    <div class="flex items-baseline justify-between gap-2">
      <h2 class="text-lg font-bold tracking-tight e-text">{{ topic.title }}</h2>
      <span class="text-[0.65rem] font-mono uppercase tracking-widest opacity-50 shrink-0">
        {{ empty ? 'coming' : `${count} live` }}
      </span>
    </div>
  </div>
</template>
