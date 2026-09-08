<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import SectionLabel from '@/components/SectionLabel.vue'
import ExplorationPreviewC from '@/explorations/ExplorationPreviewC.vue'
import NoExplorationsC from '@/explorations/NoExplorationsC.vue'
import { EXPLORATIONS, getTopicExplorationIds } from '@/explorations/REGISTRY'
import { Tag } from '@/explorations/TAGS'
import { TIMELINE } from '@/explorations/TIMELINE'
import { topicCSSVars, TOPICS } from '@/explorations/TOPICS'
import { getBreadcrumbsForPath } from '@/libs/pageSeo'

import TagCloudView from './TagCloudView.vue'
import TimelineNaviView from './TimelineNaviView.vue'

const route = useRoute()
const topicId = route.name as string
const isAll = topicId === 'all'
const topic = isAll ? undefined : TOPICS[topicId]
const breadcrumbs = computed(() => getBreadcrumbsForPath(route.path))
const browseBasePath = isAll ? '/all' : topic!.path

const allExplorationIds = isAll ? Object.keys(EXPLORATIONS) : getTopicExplorationIds(topicId)

const activeTagValue = computed(() => {
  const tagKey = route.query.tag as string | undefined
  return tagKey ? Tag[tagKey as keyof typeof Tag] : undefined
})

const activeTimelineId = computed(() => route.query.timeline as string | undefined)

const tagFilteredIds = computed(() => {
  if (!activeTagValue.value) return allExplorationIds
  return allExplorationIds.filter((id) => EXPLORATIONS[id].tags.includes(activeTagValue.value!))
})

const tagCloudExplorationIds = computed(() => {
  const timeline = activeTimelineId.value
  if (!timeline) return allExplorationIds
  return allExplorationIds.filter((id) => EXPLORATIONS[id].timeline === timeline)
})

const explorationIds = computed(() => {
  let ids = tagFilteredIds.value
  const timeline = activeTimelineId.value
  if (timeline) {
    ids = ids.filter((id) => EXPLORATIONS[id].timeline === timeline)
  }
  return ids
})

const hasActiveFilters = computed(
  () => activeTagValue.value !== undefined || activeTimelineId.value !== undefined,
)

const filterSummary = computed(() => {
  const parts: string[] = []
  if (activeTagValue.value) parts.push(`tag ${activeTagValue.value}`)
  if (activeTimelineId.value) {
    const label = TIMELINE[activeTimelineId.value]?.title ?? activeTimelineId.value
    parts.push(`timeline ${label}`)
  }
  return parts.join(' · ')
})
</script>

<template>
  <main>
    <BreadcrumbNav :items="breadcrumbs" />

    <header class="mb-5" :style="!isAll ? topicCSSVars(topic!.color) : undefined">
      <h1
        class="text-2xl md:text-3xl font-bold tracking-tight"
        :class="isAll ? 'text-slate-800' : 'e-text'"
      >
        {{ isAll ? 'All explorations' : topic!.title }}
      </h1>
      <p v-if="isAll" class="text-sm text-slate-600 mt-2 max-w-3xl">
        Every live protocol playground on Feel Your Protocol — filter by tag or hardfork timeline.
      </p>
      <p v-else-if="topic!.introText" class="text-sm leading-relaxed text-slate-600 mt-2 max-w-3xl">
        {{ topic!.introText }}
      </p>
    </header>

    <section class="mb-5">
      <SectionLabel>Browse</SectionLabel>
      <div class="grid grid-cols-1 sm:grid-cols-5 gap-3">
        <TagCloudView
          :explorationIds="tagCloudExplorationIds"
          :basePath="browseBasePath"
          class="sm:col-span-3"
        />
        <TimelineNaviView
          :explorationIds="tagFilteredIds"
          :basePath="browseBasePath"
          class="sm:col-span-2"
        />
      </div>
    </section>

    <section>
      <div class="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <p class="font-mono text-xs text-slate-500">
          {{ explorationIds.length }} exploration{{ explorationIds.length === 1 ? '' : 's' }}
          <template v-if="hasActiveFilters"> · {{ filterSummary }}</template>
        </p>
        <RouterLink
          v-if="hasActiveFilters"
          :to="browseBasePath"
          class="text-xs font-mono text-slate-500 hover:text-slate-700 no-underline"
        >
          Clear filters
        </RouterLink>
      </div>

      <div
        v-if="explorationIds.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
        data-testid="exploration-catalog-grid"
      >
        <RouterLink
          v-for="explorationId in explorationIds"
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
      <NoExplorationsC v-else />
    </section>
  </main>
</template>
