<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'

import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import { EXPLORATIONS } from '@/explorations/REGISTRY'
import { TOPIC_COLORS, TOPICS } from '@/explorations/TOPICS'
import { getBreadcrumbsForPath } from '@/libs/pageSeo'

import TopicIntroView from './TopicIntroView.vue'

const route = useRoute()
const explorationId = route.name as string
const exploration = EXPLORATIONS[explorationId]
const topic = TOPICS[exploration.topic]
const cc = TOPIC_COLORS[topic.color].classes
const breadcrumbs = getBreadcrumbsForPath(route.path)

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
    <div>
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
    <TopicIntroView
      v-if="exploration.image"
      :topic="topic"
      :image="exploration.image"
    />
    <div v-else-if="exploration.rightPanel" id="exploration-right-panel" />
  </div>
</template>
