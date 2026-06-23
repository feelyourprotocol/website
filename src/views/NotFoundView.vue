<script setup lang="ts">
import { getRandomExplorationWithImage, getExplorationThumbnailImage } from '@/explorations/REGISTRY'
import { TOPIC_COLORS, topicCSSVars, TOPICS } from '@/explorations/TOPICS'
import { DOCS_ADD_EXPLORATION } from '@/libs/docsUrls'

const pick = getRandomExplorationWithImage()
const topic = pick ? TOPICS[pick.topic] : undefined
const cssVars = topic ? topicCSSVars(topic.color) : undefined
const borderCard = topic ? TOPIC_COLORS[topic.color].classes.borderCard : 'border border-slate-200'

function getImageUrl(image: string): string {
  return image.includes('/')
    ? image
    : new URL(`../assets/imgs/dancers/${image}`, import.meta.url).href
}
</script>

<template>
  <main>
    <div
      :style="cssVars"
      :class="['topic-intro-card bg-white rounded-lg p-5 md:p-8 shadow-sm', borderCard]"
    >
      <p class="font-mono text-xs text-slate-400 mb-2">
        <span class="text-purple-500">◆</span>
        404
      </p>

      <h1 class="text-2xl md:text-3xl font-bold tracking-tight mb-3 e-text">
        This path isn't in the registry.
      </h1>

      <div class="md:flex md:gap-8 md:items-start">
        <div class="flex-1 min-w-0">
          <p class="text-sm leading-relaxed text-slate-600 mb-2">
            No exploration lives at this URL — yet. Uncharted protocol territory is kind of our
            thing.
          </p>
          <p class="text-sm leading-relaxed text-slate-600 mb-6">
            Ready to make it yours?
            <a
              :href="DOCS_ADD_EXPLORATION"
              target="_blank"
              rel="noopener"
              class="e-text underline underline-offset-2 hover:no-underline"
              >Add an exploration</a
            >
            — the docs walk you through it.
          </p>

          <div class="flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs text-slate-500">
            <RouterLink to="/" class="e-text hover:underline">← Home</RouterLink>
            <RouterLink v-if="pick" :to="pick.path" class="e-text hover:underline">
              Feel something real instead →
            </RouterLink>
            <a
              :href="DOCS_ADD_EXPLORATION"
              target="_blank"
              rel="noopener"
              class="e-text hover:underline"
              >Contributor guide</a
            >
          </div>
        </div>

        <RouterLink
          v-if="pick?.image"
          :to="pick.path"
          class="block shrink-0 mt-6 md:mt-0 no-underline group"
        >
          <img
            :src="getImageUrl(getExplorationThumbnailImage(pick)!)"
            :alt="pick.title"
            class="rounded-md max-w-[14rem] mx-auto md:mx-0 transition group-hover:opacity-90"
          />
          <p class="font-mono text-[11px] text-slate-400 text-center md:text-right mt-2">
            Random pick — {{ pick.title }}
          </p>
        </RouterLink>
      </div>
    </div>
  </main>
</template>
