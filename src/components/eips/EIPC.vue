<script setup lang="ts">
import { ArrowTopRightOnSquareIcon, ShareIcon } from '@heroicons/vue/24/solid'
import ButtonC from '../ui/ButtonC.vue'

defineProps(['title', 'eip', 'descriptionHTML', 'shareURL'])
</script>

<template>
  <div class="bg-blue-300 bg-clip-border p-4 rounded-xl">
    <div class="grid grid-cols-2 mb-3">
      <h3 class="font-bold text-xl text-blue-900">{{ title }}</h3>
      <div class="text-right">
        <span class="mr-1.5">
          <a href="#" @click.prevent="shareURL" class="relative group">
            <ButtonC :icon="ShareIcon" tooltip="Open Shareable URL (with values)" />
          </a>
        </span>
        <span class="mr-1">
          <a
            :href="'https://eips.ethereum.org/EIPS/eip-' + eip"
            target="_blank"
            class="relative group"
          >
            <ButtonC :icon="ArrowTopRightOnSquareIcon" tooltip="Visit EIP Specification" />
          </a>
        </span>
        <h3 class="font-mono text-right text-xl inline text-blue-900 ml-2">EIP-{{ eip }}</h3>
      </div>
    </div>

    <div class="text-blue-900 font-mono text-xs mb-4">
      {{ descriptionHTML }}
    </div>

    <slot></slot>
  </div>
</template>
