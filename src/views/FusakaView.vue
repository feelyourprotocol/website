<script setup lang="ts">
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/solid'
import EIP7883C from '@/components/eips/EIP7883C.vue'
import PrecompileC from '@/components/precompiles/PrecompileC.vue'
import { EIP7883 } from './lib/eips'
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
      <PrecompileC
        :title="EIP7883['title']"
        :eip="EIP7883['num']"
        :descriptionHTML="EIP7883['descriptionHTML']"
      >
        <suspense>
          <EIP7883C />
        </suspense>
      </PrecompileC>
    </div>
  </main>
</template>
