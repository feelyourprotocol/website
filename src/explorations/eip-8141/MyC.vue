<script setup lang="ts">
import ExplorationC from '@/explorations/ExplorationC.vue'
import PoweredByC from '@/explorations/PoweredByC.vue'
import { TOPICS } from '@/explorations/TOPICS'

import { INFO as exploration } from './info'

const topic = TOPICS[exploration.topic]
</script>

<template>
  <ExplorationC explorationId="eip-8141" :exploration="exploration" :topic="topic">
    <template #content>
      <div class="mt-4 rounded-lg border p-5 text-center" style="border-color: var(--e-border)">
        <p class="text-sm text-slate-500 italic">
          Interactive transaction composer coming soon — stay tuned.
        </p>
      </div>
      <PoweredByC
        :poweredBy="exploration.poweredBy"
        :creatorName="exploration.creatorName"
        :creatorURL="exploration.creatorURL"
      />
    </template>
  </ExplorationC>
</template>
