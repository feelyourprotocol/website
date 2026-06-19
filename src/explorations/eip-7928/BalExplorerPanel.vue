<script setup lang="ts">
import type { BALJSONBlockAccessList } from '@ethereumjs/util'

import { type Topic,TOPIC_COLORS, topicCSSVars } from '@/explorations/TOPICS'

import BalJsonView from './BalJsonView.vue'
import type { TriggerGroupViewModel } from './transitions'
import TriggerGroupsView from './TriggerGroupsView.vue'

defineProps<{
  topic: Topic
  groups: TriggerGroupViewModel[]
  balJson?: BALJSONBlockAccessList
  activePath: string | null
  hasResult: boolean
}>()

const emit = defineEmits<{
  hoverPath: [path: string | null]
}>()

function setActivePath(path: string | null) {
  emit('hoverPath', path)
}
</script>

<template>
  <div
    :style="topicCSSVars(topic.color)"
    :class="[
      'exploration-c bal-explorer-panel bg-white rounded-lg p-4 shadow-sm min-h-[20rem]',
      TOPIC_COLORS[topic.color].classes.borderCard,
    ]"
  >
    <h2 class="text-lg font-bold tracking-tight e-text mb-1">Access list explorer</h2>
    <p v-if="hasResult" class="text-xs font-mono opacity-50 mb-3 leading-relaxed">
      Hover an event on the left — the matching entry highlights in the record on the right.
    </p>
    <p v-else class="text-xs font-mono opacity-50 mb-3 leading-relaxed">
      Run the block to generate the grouped view and full BAL record.
    </p>

    <div v-if="hasResult && balJson" class="grid grid-cols-1 min-[1100px]:grid-cols-2 gap-3 items-start min-h-0">
      <div class="min-w-0">
        <TriggerGroupsView
          :groups="groups"
          :active-path="activePath"
          @hover-path="setActivePath"
        />
      </div>

      <div class="min-w-0 max-h-[70vh] overflow-y-auto rounded border e-border e-bg-light p-2">
        <BalJsonView
          :bal-json="balJson"
          :active-path="activePath"
          @hover-path="setActivePath"
        />
      </div>
    </div>

    <div
      v-else
      class="rounded-md border border-dashed e-border e-bg-medium px-4 py-10 text-center"
    >
      <p class="text-sm font-mono opacity-45">Waiting for block execution…</p>
    </div>
  </div>
</template>
