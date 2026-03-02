<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { EXPLORATIONS } from '@/explorations/REGISTRY'
import { TOPICS, TOPIC_COLOR_CLASSES } from '@/explorations/TOPICS'
import TopicIntroView from './TopicIntroView.vue'

const route = useRoute()
const explorationId = route.name as string
const exploration = EXPLORATIONS[explorationId]
const cc = TOPIC_COLOR_CLASSES[TOPICS[exploration.topic].color]

const componentModules = import.meta.glob('../explorations/*/MyC.vue')
const ExplorationComponent = defineAsyncComponent(
  componentModules[`../explorations/${explorationId}/MyC.vue`] as () => Promise<{
    default: object
  }>,
)
</script>

<template>
  <div class="grid md:grid-cols-2 gap-4">
    <div>
      <Suspense>
        <ExplorationComponent />
        <template #fallback>
          <div class="flex justify-center pt-32">
            <span class="font-mono font-bold text-lg animate-pulse" :class="cc.text900"
              >Loading...</span
            >
          </div>
        </template>
      </Suspense>
    </div>
    <TopicIntroView
      v-if="exploration.image"
      :topic="TOPICS[exploration.topic]"
      :image="exploration.image"
    />
  </div>
</template>
