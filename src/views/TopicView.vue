<script setup lang="ts">
import EIPC from '@/components/eips/EIPC.vue'
import TopicIntroView from './TopicIntroView.vue'
import { useRoute } from 'vue-router'
import { EIPs, TOPICS, getTopicEIPIds } from './lib/structure'

const route = useRoute()
const topicId = route.name as string
const topic = TOPICS[topicId]
const eipIds = getTopicEIPIds(topicId)
</script>

<template>
  <main>
    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <RouterLink
          v-for="eipId in eipIds"
          :key="eipId"
          :to="EIPs[eipId].path"
          class="block mb-2 no-underline"
        >
          <EIPC :eipId="eipId" :eip="EIPs[eipId]" />
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
