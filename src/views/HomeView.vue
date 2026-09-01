<script setup lang="ts">
import SectionLabel from '@/components/SectionLabel.vue'
import ExplorationPreviewC from '@/explorations/ExplorationPreviewC.vue'
import { EXPLORATIONS } from '@/explorations/REGISTRY'
import { TOPICS } from '@/explorations/TOPICS'
import { COMMUNITY_TOKEN_HOME } from '@/libs/communityToken'
import { WEBSITE_DOCS_HOME } from '@/libs/docsUrls'
import { MCP_DOCS_HOME, mcpDocsPage, ROADMAP_HOME } from '@/libs/roadmapUrls'

import { catalogExplorationIds, catalogForkLabels, latestExplorationIds } from './homeCatalog'
import TagCloudView from './TagCloudView.vue'
import TimelineNaviView from './TimelineNaviView.vue'
import TopicTileView from './TopicTileView.vue'

const allExplorationIds = Object.keys(EXPLORATIONS)
const latestIds = latestExplorationIds()
const catalogIds = catalogExplorationIds()
const forkLabels = catalogForkLabels()
const explorationCount = allExplorationIds.length
const topicIds = Object.keys(TOPICS)
const mcpCoverageUrl = mcpDocsPage('use/coverage')

const fleet = [
  {
    title: 'Website docs',
    href: WEBSITE_DOCS_HOME,
    note: 'How explorations are built',
  },
  {
    title: 'MCP docs',
    href: MCP_DOCS_HOME,
    note: 'Agent twin — not publicly launched',
  },
  {
    title: 'Roadmap',
    href: ROADMAP_HOME,
    note: 'Textbook + future lab',
  },
  {
    title: 'Community token',
    href: COMMUNITY_TOKEN_HOME,
    note: 'Funds ongoing exploration work',
  },
]
</script>

<template>
  <main>
    <h1 class="sr-only">Feel Your Protocol — Ethereum Protocol Explorations for Humans and AI</h1>

    <section class="mb-6">
      <p class="text-slate-600 text-sm md:text-base leading-relaxed max-w-3xl">
        Run upcoming Ethereum protocol changes in the browser — real EVM and cryptography libraries,
        no backend, no mocks.
      </p>
      <div class="flex flex-wrap items-center gap-2 mt-3">
        <a
          href="#latest"
          class="inline-flex items-center px-3 py-2 min-h-11 rounded-md bg-slate-800 text-white text-sm font-medium no-underline hover:bg-slate-700"
        >
          Play an exploration
        </a>
        <a
          :href="mcpCoverageUrl"
          target="_blank"
          rel="noopener"
          class="inline-flex items-center px-3 py-2 min-h-11 rounded-md border border-slate-400 bg-white text-slate-600 text-sm no-underline hover:bg-slate-50"
        >
          For agents
        </a>
      </div>
      <p class="font-mono text-xs text-slate-500 mt-3">
        {{ explorationCount }} exploration{{ explorationCount === 1 ? '' : 's' }}
        <template v-if="forkLabels.length > 0"> · {{ forkLabels.join(' · ') }}</template>
      </p>
    </section>

    <section id="latest" class="mb-8">
      <SectionLabel>Latest</SectionLabel>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RouterLink
          v-for="explorationId in latestIds"
          :key="explorationId"
          :to="EXPLORATIONS[explorationId].path"
          class="block no-underline min-w-0"
        >
          <ExplorationPreviewC
            :explorationId="explorationId"
            :exploration="EXPLORATIONS[explorationId]"
            :topic="TOPICS[EXPLORATIONS[explorationId].topic]"
            size="featured"
          />
        </RouterLink>
      </div>
    </section>

    <section class="mb-8">
      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
        <SectionLabel>Catalog</SectionLabel>
        <RouterLink to="/all" class="text-xs font-mono text-slate-500 hover:text-slate-700">
          See all →
        </RouterLink>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <RouterLink
          v-for="explorationId in catalogIds"
          :key="explorationId"
          :to="EXPLORATIONS[explorationId].path"
          class="block no-underline min-w-0"
        >
          <ExplorationPreviewC
            :explorationId="explorationId"
            :exploration="EXPLORATIONS[explorationId]"
            :topic="TOPICS[EXPLORATIONS[explorationId].topic]"
            size="catalog"
          />
        </RouterLink>
      </div>
    </section>

    <section class="mb-8">
      <SectionLabel>Browse</SectionLabel>
      <div class="grid grid-cols-1 sm:grid-cols-5 gap-3">
        <TagCloudView :explorationIds="allExplorationIds" basePath="/all" class="sm:col-span-3" />
        <TimelineNaviView
          basePath="/all"
          :explorationIds="allExplorationIds"
          class="sm:col-span-2"
        />
      </div>
    </section>

    <section class="mb-8">
      <SectionLabel>Topics</SectionLabel>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <RouterLink
          v-for="topicId in topicIds"
          :key="topicId"
          :to="TOPICS[topicId].path"
          class="block no-underline min-w-0"
        >
          <TopicTileView :topic-id="topicId" :topic="TOPICS[topicId]" />
        </RouterLink>
      </div>
    </section>

    <section>
      <SectionLabel>Also in this project</SectionLabel>
      <p class="text-slate-600 text-sm leading-relaxed mb-3 max-w-3xl">
        The explorations site is the textbook. Docs, a planned MCP lab for agents, and a community
        token on Base sit alongside it.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <a
          v-for="item in fleet"
          :key="item.href"
          :href="item.href"
          target="_blank"
          rel="noopener"
          class="block rounded-lg border border-slate-400 bg-white p-4 no-underline hover:bg-slate-50"
        >
          <p class="font-semibold text-slate-800 text-sm">{{ item.title }}</p>
          <p class="font-mono text-xs text-slate-500 mt-1">{{ item.note }}</p>
        </a>
      </div>
    </section>
  </main>
</template>
