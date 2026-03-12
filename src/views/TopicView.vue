<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import ExplorationC from '@/explorations/ExplorationC.vue'
import NoExplorationsC from '@/explorations/NoExplorationsC.vue'
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
const allExplorationIds = getTopicExplorationIds(topicId)
const topicImage = getRandomTopicExplorationImage(topicId)

const explorationIds = computed(() => {
  const timeline = route.query.timeline as string | undefined
  if (!timeline) return allExplorationIds
  return allExplorationIds.filter((id) => EXPLORATIONS[id].timeline === timeline)
})
</script>

<template>
  <main>
    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <template v-if="explorationIds.length > 0">
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
        </template>
        <NoExplorationsC v-else />
      </div>

      <div>
        <TopicIntroView v-if="topicImage" :topic="topic" :image="topicImage" :overviewMode="true" />
      </div>
    </div>
  </main>
</template>
