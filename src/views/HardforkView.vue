<script setup lang="ts">
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/solid'
import { useRoute } from 'vue-router'
import { HARDFORKS, type Hardfork } from './structure'

const route = useRoute()
// @ts-expect-error route.name doesn't seem to be properly typed
const hardfork: Hardfork = HARDFORKS[route.name]
</script>

<template>
  <main>
    <div class="grid grid-cols-1 mb-3">
      <p class="text-right text-3xl">
        <a :href="hardfork['url']" title="Visit Forkcast Overview" target="_blank">
          <ArrowTopRightOnSquareIcon class="size-6 inline align-baseline text-blue-600" />
        </a>
        <span class="ml-3">{{ hardfork.title.toUpperCase() }}</span>
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <slot></slot>
    </div>
  </main>
</template>
