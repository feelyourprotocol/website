<script setup lang="ts">
import SectionLabel from '@/components/SectionLabel.vue'
import ExplorationC from '@/explorations/ExplorationC.vue'
import { EXPLORATIONS, getRandomTopicExplorationImage } from '@/explorations/REGISTRY'
import { TOPICS } from '@/explorations/TOPICS'
import { DOCS_HOME } from '@/libs/docsUrls'

import TagCloudView from './TagCloudView.vue'
import TimelineNaviView from './TimelineNaviView.vue'
import TopicIntroView from './TopicIntroView.vue'

const allExplorationIds = Object.keys(EXPLORATIONS)

const featured = ['eip-7928', 'eip-8024', 'eip-7883', 'eip-7594', 'eip-7951']
const latestExplorations = featured.slice(0, 2)

const activeTopicIds = Object.keys(TOPICS).filter((id) => TOPICS[id].explorations.length > 0)

const topicImages: Record<string, string | undefined> = {}
for (const topicId of activeTopicIds) {
  topicImages[topicId] = getRandomTopicExplorationImage(topicId)
}
</script>

<template>
  <main>
    <h1 class="sr-only">Feel Your Protocol — Interactive Ethereum Protocol Explorations</h1>
    <div class="grid md:grid-cols-2 gap-4 items-start">
      <div class="flex flex-col gap-4">
        <section>
          <SectionLabel>Latest</SectionLabel>

          <RouterLink
            v-for="explorationId in latestExplorations"
            :key="explorationId"
            :to="EXPLORATIONS[explorationId].path"
            class="block mb-3 last:mb-0 no-underline"
          >
            <ExplorationC
              :explorationId="explorationId"
              :exploration="EXPLORATIONS[explorationId]"
              :topic="TOPICS[EXPLORATIONS[explorationId].topic]"
              :showUsageInstructions="false"
            />
          </RouterLink>
        </section>

        <div class="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <TagCloudView :explorationIds="allExplorationIds" basePath="/all" class="sm:col-span-3" />
          <TimelineNaviView
            basePath="/all"
            :explorationIds="allExplorationIds"
            class="sm:col-span-2"
          />
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <section>
          <SectionLabel>About the Project</SectionLabel>
          <div class="bg-slate-700 rounded-lg p-5 shadow-md">
            <p class="text-slate-300 text-sm leading-relaxed">
              Feel Your Protocol is a collaborative open-source project providing interactive
              explorations of upcoming Ethereum protocol changes. Widgets are powered by real EVM
              and cryptography libraries running directly in the browser — no backend needed.
            </p>
            <p class="text-slate-300 text-sm leading-relaxed mt-2">
              Want to contribute?
              <a
                :href="DOCS_HOME"
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
        </section>

        <div>
          <RouterLink
            v-for="topicId in activeTopicIds"
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
      </div>
    </div>
  </main>
</template>
