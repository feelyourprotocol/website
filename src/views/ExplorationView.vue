<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { EXPLORATIONS, TOPICS } from './lib/structure'
import TopicIntroView from './TopicIntroView.vue'

const route = useRoute()
const explorationId = route.name as string
const exploration = EXPLORATIONS[explorationId]

const componentModules = import.meta.glob('../components/explorations/EIP*C.vue')
const ExplorationComponent = defineAsyncComponent(
  componentModules[`../components/explorations/${explorationId.toUpperCase().replace('-', '')}C.vue`] as () => Promise<{ default: object }>,
)
</script>

<template>
  <div class="grid md:grid-cols-2 gap-4">
    <Suspense>
      <ExplorationComponent />
    </Suspense>
    <TopicIntroView
      v-if="exploration.image && exploration.topics?.[0]"
      :topic="TOPICS[exploration.topics[0]]"
      :image="exploration.image"
    />
  </div>
</template>
