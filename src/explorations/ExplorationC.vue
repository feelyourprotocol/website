<script setup lang="ts">
import { computed } from 'vue'
import { ArrowTopRightOnSquareIcon, ShareIcon } from '@heroicons/vue/24/solid'

import ButtonUIC from '@/eComponents/ui/ButtonUIC.vue'

import type { Exploration } from './REGISTRY'
import { type Topic, topicCSSVars } from './TOPICS'

const props = withDefaults(
  defineProps<{
    explorationId: string
    exploration: Exploration
    topic: Topic
    shareURL?: () => void
    asPageTitle?: boolean
    showUsageInstructions?: boolean
  }>(),
  {
    asPageTitle: false,
    showUsageInstructions: true,
  },
)

const cssVars = topicCSSVars(props.topic.color)
const showUsage = computed(
  () => props.showUsageInstructions && (props.exploration.usageText?.trim() ?? '') !== '',
)
</script>

<template>
  <div
    :id="explorationId + '-c'"
    :style="cssVars"
    class="exploration-c"
    data-testid="exploration-ready"
  >
    <div class="items-start gap-2 mb-2" :class="asPageTitle ? 'hidden md:flex' : 'flex'">
      <component
        :is="asPageTitle ? 'h1' : 'h3'"
        class="font-bold text-lg tracking-tight flex-1 min-w-0 e-text"
      >
        {{ exploration.title }}
      </component>
      <div class="flex shrink-0 items-center gap-1">
        <a v-if="shareURL" href="#" class="share-url-button" @click.stop.prevent="shareURL">
          <ButtonUIC :icon="ShareIcon" tooltip="Open Shareable URL" />
        </a>
        <a
          :href="exploration.infoURL"
          target="_blank"
          rel="noopener noreferrer"
          class="visit-exploration-button"
          @click.stop
        >
          <ButtonUIC
            :icon="ArrowTopRightOnSquareIcon"
            tooltip="External Link with more information"
          />
        </a>
      </div>
    </div>

    <div class="font-mono text-xs leading-relaxed mb-3.5 text-slate-600">
      <p v-html="exploration.introText"></p>
      <details v-if="showUsage" class="mt-3 group">
        <summary
          class="exploration-usage-summary cursor-pointer font-bold e-text py-2 md:py-1 min-h-11 md:min-h-0 inline-flex items-center gap-1.5 select-none"
        >
          <span
            class="inline-block transition-transform group-open:rotate-90 text-slate-400"
            aria-hidden="true"
            >›</span
          >
          Usage
        </summary>
        <div class="mt-2 pl-3 border-l-2" style="border-color: var(--e-border)">
          <p v-html="exploration.usageText"></p>
        </div>
      </details>
    </div>

    <slot name="content"></slot>
  </div>
</template>

<style scoped>
.exploration-usage-summary {
  list-style: none;
}

.exploration-usage-summary::-webkit-details-marker {
  display: none;
}
</style>
