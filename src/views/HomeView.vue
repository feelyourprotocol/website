<script setup lang="ts">
import ExplorationC from '@/explorations/ExplorationC.vue'
import { EXPLORATIONS, getRandomTopicExplorationImage } from '@/explorations/REGISTRY'
import { TOPICS } from '@/explorations/TOPICS'

import TopicIntroView from './TopicIntroView.vue'

const featured = ['eip-7883', 'eip-7594', 'eip-7951']

const topicImages: Record<string, string | undefined> = {}
for (const topicId of Object.keys(TOPICS)) {
  topicImages[topicId] = getRandomTopicExplorationImage(topicId)
}
</script>

<template>
  <main>
    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <RouterLink
          v-for="topicId in Object.keys(TOPICS)"
          :key="topicId"
          :to="TOPICS[topicId].path"
          class="block mb-5 last:mb-0 no-underline"
        >
          <TopicIntroView
            v-if="topicImages[topicId]"
            :topic="TOPICS[topicId]"
            :image="topicImages[topicId]!"
            :overviewMode="true"
          />
        </RouterLink>
      </div>

      <div>
        <div class="bg-slate-700 rounded-lg mb-4 p-5 shadow-md">
          <p class="mb-2 text-base font-bold text-white">About the Project</p>
          <p class="text-slate-300 text-sm leading-relaxed">
            Feel Your Protocol is a collaborative open-source project providing interactive
            explorations of upcoming Ethereum protocol changes. Widgets are powered by real EVM and
            cryptography libraries running directly in the browser — no backend needed.
          </p>
          <p class="text-slate-300 text-sm leading-relaxed mt-2">
            Want to contribute?
            <a
              href="https://docs.feelyourprotocol.org"
              target="_blank"
              class="font-semibold text-white underline hover:text-slate-200"
              >Check the docs</a
            >
            or jump straight into the
            <a
              href="https://github.com/feelyourprotocol/website"
              target="_blank"
              class="font-semibold text-white underline hover:text-slate-200"
              >code on GitHub</a
            >.
          </p>
        </div>

        <div class="text-right mb-3 mt-6">
          <span
            class="text-sm rounded-lg font-mono bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-3 py-1.5"
            >Latest</span
          >
        </div>

        <RouterLink
          v-for="explorationId in featured"
          :key="explorationId"
          :to="EXPLORATIONS[explorationId].path"
          class="block mb-3 no-underline"
        >
          <ExplorationC
            :explorationId="explorationId"
            :exploration="EXPLORATIONS[explorationId]"
            :topic="TOPICS[EXPLORATIONS[explorationId].topic]"
          />
        </RouterLink>
      </div>
    </div>
  </main>
</template>
