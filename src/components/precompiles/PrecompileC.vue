<script setup lang="ts">
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/solid'

defineProps(['title', 'eip', 'descriptionHTML'])
</script>

<template>
  <div class="bg-blue-300 bg-clip-border p-5 rounded-xl">
    <div class="grid grid-cols-2 mb-3">
      <h3 class="font-bold text-xl text-blue-900">{{ title }}</h3>
      <h3 class="font-mono text-right text-xl">
        <a
          href="https://eips.ethereum.org/EIPS/eip-{{  eip }}"
          title="Visit EIP Specification"
          target="_blank"
        >
          <ArrowTopRightOnSquareIcon class="size-4 inline align-baseline text-blue-600" />
        </a>
        EIP-{{ eip }}
      </h3>
    </div>

    <div class="text-blue-900 font-mono text-xs mb-6">
      {{ descriptionHTML }}
    </div>

    <slot></slot>
  </div>
</template>
