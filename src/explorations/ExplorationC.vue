<script setup lang="ts">
import { ArrowTopRightOnSquareIcon, ShareIcon } from '@heroicons/vue/24/solid'
import ButtonC from '../components/ui/ButtonC.vue'
import type { Exploration } from './REGISTRY'
import { type Topic, TOPIC_COLOR_CLASSES } from './TOPICS'

const props = defineProps<{
  explorationId: string
  exploration: Exploration
  topic: Topic
  shareURL?: () => void
}>()

const cc = TOPIC_COLOR_CLASSES[props.topic.color]
</script>

<template>
  <div
    :id="explorationId + '-c'"
    class="exploration-c bg-clip-border p-4 rounded-xl"
    :class="cc.bg200"
  >
    <div class="grid grid-cols-4 mb-3 items-center">
      <h3 class="font-bold text-xl col-span-3" :class="cc.text900">{{ exploration.title }}</h3>
      <div class="flex justify-end items-center">
        <a v-if="shareURL" href="#" @click.prevent="shareURL" class="share-url-button mr-1.5">
          <ButtonC :icon="ShareIcon" tooltip="Open Shareable URL" />
        </a>
        <a :href="exploration.infoURL" target="_blank" class="visit-exploration-button mr-1">
          <ButtonC
            :icon="ArrowTopRightOnSquareIcon"
            tooltip="External Link with more information"
          />
        </a>
      </div>
    </div>

    <div class="font-mono text-xs mb-6" :class="cc.text900">
      <p v-html="exploration.introText"></p>
      <p class="mt-4" v-html="exploration.usageText"></p>
    </div>

    <slot name="content"></slot>
  </div>
</template>
