<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { EIPs, TOPICS } from './lib/structure'
import TopicIntroView from './TopicIntroView.vue'

const route = useRoute()
const eipId = route.name as string
const eip = EIPs[eipId]

const componentModules = import.meta.glob('../components/eips/EIP*C.vue')
const EIPComponent = defineAsyncComponent(
  componentModules[`../components/eips/EIP${eip.num}C.vue`] as () => Promise<{ default: object }>,
)
</script>

<template>
  <div class="grid md:grid-cols-2 gap-4">
    <Suspense>
      <EIPComponent />
    </Suspense>
    <TopicIntroView
      v-if="eip.image && eip.topics?.[0]"
      :topic="TOPICS[eip.topics[0]]"
      :image="eip.image"
    />
  </div>
</template>
