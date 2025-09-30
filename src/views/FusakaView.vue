<script setup lang="ts">
import EIP7823View from './EIP7883View.vue'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/solid'
</script>

<template>
  <main>
    <div class="grid grid-cols-1">
      <p class="text-right text-4xl">
        <a
          href="https://forkcast.org/upgrade/fusaka"
          title="Visit Forkcast Overview"
          target="_blank"
        >
          <ArrowTopRightOnSquareIcon class="size-7 inline align-baseline text-blue-600" />
        </a>
        <span class="ml-1"> FUSAKA </span>
      </p>
    </div>

    <div class="grid grid-cols-2">
      <EIP7823View />
    </div>
  </main>
</template>
