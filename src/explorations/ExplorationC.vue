<script setup lang="ts">
import { ArrowTopRightOnSquareIcon, ShareIcon } from '@heroicons/vue/24/solid'

import ButtonUIC from '@/eComponents/ui/ButtonUIC.vue'

import type { Exploration } from './REGISTRY'
import { type Topic, topicCSSVars } from './TOPICS'

const props = defineProps<{
  explorationId: string
  exploration: Exploration
  topic: Topic
  shareURL?: () => void
}>()

const cssVars = topicCSSVars(props.topic.color)
</script>

<template>
  <div :id="explorationId + '-c'" :style="cssVars" class="exploration-c">
    <div class="grid grid-cols-4 mb-2 items-center">
      <h3 class="font-bold text-lg tracking-tight col-span-3 e-text">{{ exploration.title }}</h3>
      <div class="flex justify-end items-center gap-1">
        <a v-if="shareURL" href="#" @click.prevent="shareURL" class="share-url-button">
          <ButtonUIC :icon="ShareIcon" tooltip="Open Shareable URL" />
        </a>
        <a :href="exploration.infoURL" target="_blank" class="visit-exploration-button">
          <ButtonUIC
            :icon="ArrowTopRightOnSquareIcon"
            tooltip="External Link with more information"
          />
        </a>
      </div>
    </div>

    <div class="font-mono text-xs leading-relaxed mb-5 text-slate-600">
      <p v-html="exploration.introText"></p>
      <p class="mt-3" v-html="exploration.usageText"></p>
    </div>

    <slot name="content"></slot>
  </div>
</template>
