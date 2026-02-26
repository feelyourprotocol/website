<script setup lang="ts">
import EIPC from '@/components/eips/EIPC.vue'
import TopicIntroView from './TopicIntroView.vue'
import { useRoute } from 'vue-router'
import { EXPLORATIONS, TOPICS, getTopicExplorationIds } from './lib/structure'

const route = useRoute()
const topicId = route.name as string
const topic = TOPICS[topicId]
const explorationIds = getTopicExplorationIds(topicId)
</script>

<template>
  <main>
    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <RouterLink
          v-for="explorationId in explorationIds"
          :key="explorationId"
          :to="EXPLORATIONS[explorationId].path"
          class="block mb-2 no-underline"
        >
          <EIPC :explorationId="explorationId" :exploration="EXPLORATIONS[explorationId]" />
        </RouterLink>
      </div>

      <div>
        <TopicIntroView
          v-if="topic.image"
          :topic="topic"
          :image="topic.image"
          :overviewMode="true"
        />
      </div>
    </div>
  </main>
</template>
