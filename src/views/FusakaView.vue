<script setup lang="ts">
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/solid'
import EIP7883C from '@/components/eips/EIP7883C.vue'
</script>

<template>
  <main>
    <div class="grid grid-cols-1 mb-3">
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

    <div class="grid md:grid-cols-2">
      <suspense>
        <EIP7883C />
      </suspense>
    </div>
  </main>
</template>
