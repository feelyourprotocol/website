<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import ExplorationRightPanel from '@/components/ExplorationRightPanel.vue'
import { EXPLORATIONS } from '@/explorations/REGISTRY'
import { TOPIC_COLORS, TOPICS } from '@/explorations/TOPICS'
import { provideCompanionStatus } from '@/libs/companionStatus'
import { getBreadcrumbsForPath } from '@/libs/pageSeo'

import TopicIntroView from './TopicIntroView.vue'

const route = useRoute()
const explorationId = route.name as string
const exploration = EXPLORATIONS[explorationId]
const topic = TOPICS[exploration.topic]
const cc = TOPIC_COLORS[topic.color].classes
const breadcrumbs = getBreadcrumbsForPath(route.path)

const companionIdleLabels: Record<string, string> = {
  'eip-7928': 'Run the block to explore the access list',
  'eip-8024': 'Step to DUPN, SWAPN, or EXCHANGE…',
}

if (exploration.rightPanel) {
  provideCompanionStatus(companionIdleLabels[explorationId] ?? 'Companion panel')
}

const componentModules = import.meta.glob('../explorations/*/MyC.vue')
const ExplorationComponent = defineAsyncComponent(
  componentModules[`../explorations/${explorationId}/MyC.vue`] as () => Promise<{
    default: object
  }>,
)
</script>

<template>
  <BreadcrumbNav :items="breadcrumbs" />
  <div class="grid md:grid-cols-2 gap-4">
    <div :class="exploration.rightPanel ? 'max-md:pb-[var(--companion-peek-h)]' : ''">
      <Suspense>
        <ExplorationComponent />
        <template #fallback>
          <div class="flex justify-center pt-32">
            <span class="font-mono font-bold text-lg animate-pulse" :class="cc.text"
              >Loading...</span
            >
          </div>
        </template>
      </Suspense>
    </div>

    <ExplorationRightPanel
      v-if="exploration.rightPanel"
      :topic="topic"
      :exploration="exploration"
    />

    <TopicIntroView
      v-else-if="exploration.image"
      :topic="topic"
      :image="exploration.image"
      :image-box-height="exploration.imageBoxHeight"
    />
  </div>
</template>
