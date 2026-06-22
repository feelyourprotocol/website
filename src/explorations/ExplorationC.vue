<script setup lang="ts">
import { ArrowTopRightOnSquareIcon, ShareIcon } from '@heroicons/vue/24/solid'

import ButtonUIC from '@/eComponents/ui/ButtonUIC.vue'
import { formatEipSpecLabel } from '@/libs/pageSeo'

import type { Exploration } from './REGISTRY'
import { type Topic, topicCSSVars } from './TOPICS'

const props = withDefaults(
  defineProps<{
    explorationId: string
    exploration: Exploration
    topic: Topic
    shareURL?: () => void
    asPageTitle?: boolean
  }>(),
  {
    asPageTitle: false,
  },
)

const cssVars = topicCSSVars(props.topic.color)
const eipLabel = formatEipSpecLabel(props.explorationId)
</script>

<template>
  <div :id="explorationId + '-c'" :style="cssVars" class="exploration-c">
    <div class="flex flex-col gap-2 sm:grid sm:grid-cols-4 mb-2 sm:items-center">
      <component
        :is="asPageTitle ? 'h1' : 'h3'"
        class="font-bold text-lg tracking-tight sm:col-span-3 e-text"
      >
        {{ exploration.title }}
      </component>
      <div class="flex justify-end items-center gap-1 sm:col-span-1">
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
      <p v-if="asPageTitle" class="mt-3">
        Official spec:
        <a
          :href="exploration.infoURL"
          target="_blank"
          rel="noopener"
          class="e-text underline underline-offset-2 hover:no-underline"
        >
          {{ eipLabel }} on eips.ethereum.org
        </a>
      </p>
    </div>

    <slot name="content"></slot>
  </div>
</template>
