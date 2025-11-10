<script setup lang="ts">
import { useRoute } from 'vue-router'
import { TOPICS, type Topic } from './lib/structure'

const route = useRoute()
// @ts-expect-error route.name doesn't seem to be properly typed
const topic: Topic = TOPICS[route.name]
</script>

<template>
  <main>
    <div class="grid grid-cols-1 mb-3">
      <p class="text-right text-3xl">
        <span class="ml-3">{{ topic.title }}</span>
      </p>
    </div>

    <div class="grid md:grid-cols-2">
      <slot></slot>
    </div>
  </main>
</template>
