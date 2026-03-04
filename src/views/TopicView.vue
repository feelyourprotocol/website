<script setup lang="ts">
import { useRoute } from 'vue-router'

import ExplorationC from '@/explorations/ExplorationC.vue'
import {
  EXPLORATIONS,
  getRandomTopicExplorationImage,
  getTopicExplorationIds,
} from '@/explorations/REGISTRY'
import { TOPICS } from '@/explorations/TOPICS'

import TopicIntroView from './TopicIntroView.vue'

const route = useRoute()
const topicId = route.name as string
const topic = TOPICS[topicId]
const explorationIds = getTopicExplorationIds(topicId)
const topicImage = getRandomTopicExplorationImage(topicId)
</script>

<template>
  <main>
    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <RouterLink
          v-for="explorationId in explorationIds"
          :key="explorationId"
          :to="EXPLORATIONS[explorationId].path"
          class="block mb-3 no-underline"
        >
          <ExplorationC
            :explorationId="explorationId"
            :exploration="EXPLORATIONS[explorationId]"
            :topic="topic"
          />
        </RouterLink>
      </div>

      <div>
        <TopicIntroView v-if="topicImage" :topic="topic" :image="topicImage" :overviewMode="true" />
      </div>
    </div>
  </main>
</template>
