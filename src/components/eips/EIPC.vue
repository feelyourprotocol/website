<script setup lang="ts">
import { ArrowTopRightOnSquareIcon, ShareIcon } from '@heroicons/vue/24/solid'
import ButtonC from '../ui/ButtonC.vue'

defineProps<{
  title: string
  eip: number
  introText?: string
  usageText?: string
  shareURL?: () => void
}>()
</script>

<template>
  <div
    :id="'eip-' + eip + '-precompile-c'"
    class="eip-precompile-c bg-blue-200 bg-clip-border p-4 rounded-xl"
  >
    <div class="grid grid-cols-2 mb-3">
      <h3 class="font-bold text-xl text-blue-900">{{ title }}</h3>
      <div class="flex justify-end items-baseline">
        <a v-if="shareURL" href="#" @click.prevent="shareURL" class="share-url-button mr-1.5">
          <ButtonC :icon="ShareIcon" tooltip="Open Shareable URL" />
        </a>
        <a
          :href="'https://eips.ethereum.org/EIPS/eip-' + eip"
          target="_blank"
          class="visit-eip-button mr-1"
        >
          <ButtonC :icon="ArrowTopRightOnSquareIcon" tooltip="Visit EIP Specification" />
        </a>
        <h3 class="text-xl text-blue-900 ml-2">EIP-{{ eip }}</h3>
      </div>
    </div>

    <div class="text-blue-900 font-mono text-xs mb-6">
      <p v-if="introText" v-html="introText"></p>
      <p v-if="usageText" class="mt-4" v-html="usageText"></p>
      <slot name="description"></slot>
    </div>

    <slot name="content"></slot>
  </div>
</template>
