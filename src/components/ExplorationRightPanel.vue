<script setup lang="ts">
import { computed } from 'vue'

import CompanionSheet from '@/components/CompanionSheet.vue'
import type { Exploration } from '@/explorations/REGISTRY'
import { type Topic, topicCSSVars } from '@/explorations/TOPICS'
import { useCompanionStatus } from '@/libs/companionStatus'

import TopicIntroView from '@/views/TopicIntroView.vue'

const props = defineProps<{
  topic: Topic
  exploration: Exploration
}>()

const cssVars = topicCSSVars(props.topic.color)
const companion = useCompanionStatus()

const statusLabel = computed(() => companion?.status.label ?? 'Companion panel')
const statusActive = computed(() => companion?.status.state === 'active')
const pulseKey = computed(() => companion?.status.changeTick ?? 0)
</script>

<template>
  <aside
    :style="cssVars"
    class="exploration-right-panel-host flex flex-col min-w-0 max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:z-40 md:gap-4 lg:sticky lg:top-4 lg:self-start"
  >
    <CompanionSheet
      :label="statusLabel"
      :active="statusActive"
      :pulse-key="pulseKey"
    >
      <TopicIntroView
        v-if="exploration.image"
        class="max-md:hidden"
        :topic="topic"
        :image="exploration.image"
        :image-box-height="exploration.imageBoxHeight"
      />
      <div id="exploration-right-panel" class="min-w-0" />
    </CompanionSheet>
  </aside>
</template>
