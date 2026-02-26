<script setup lang="ts">
import EIPC from '@/components/eips/EIPC.vue'
import HeadlineButtonC from '@/components/ui/HeadlineButtonC.vue'
import TooltipC from '@/components/ui/TooltipC.vue'
import DancerView from './DancerView.vue'
import { useRoute } from 'vue-router'
import { EIPs, TOPICS, getTopicEIPIds } from './lib/structure'

const route = useRoute()
const topicId = route.name as string
const topic = TOPICS[topicId]
const eipIds = getTopicEIPIds(topicId)
</script>

<template>
  <main>
    <div class="grid grid-cols-1 mb-3">
      <p class="text-right text-3xl">
        <HeadlineButtonC :url="topic.url" />
        <span class="ml-3">{{ topic.title }}</span>
      </p>
    </div>
    <TooltipC :tooltip="topic.url" />
    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <RouterLink
          v-for="eipId in eipIds"
          :key="eipId"
          :to="EIPs[eipId].path"
          class="block mb-2 no-underline"
        >
          <EIPC
            :title="EIPs[eipId].title"
            :eip="EIPs[eipId].num"
            :introText="EIPs[eipId].introText"
          />
        </RouterLink>
      </div>

      <div>
        <DancerView
          :nameId="topicId"
          :title="topic.title"
          :introText="topic.introText"
        />
      </div>
    </div>
  </main>
</template>
