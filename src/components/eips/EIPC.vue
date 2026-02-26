<script setup lang="ts">
import { ArrowTopRightOnSquareIcon, ShareIcon } from '@heroicons/vue/24/solid'
import ButtonC from '../ui/ButtonC.vue'
import type { EIP } from '@/views/lib/structure'

defineProps<{
  eipId: string
  eip: EIP
  shareURL?: () => void
}>()
</script>

<template>
  <div
    :id="eipId + '-precompile-c'"
    class="eip-precompile-c bg-blue-200 bg-clip-border p-4 rounded-xl"
  >
    <div class="grid grid-cols-4 mb-3 items-center">
      <h3 class="font-bold text-xl text-blue-900 col-span-3">{{ eip.title }}</h3>
      <div class="flex justify-end items-center">
        <a v-if="shareURL" href="#" @click.prevent="shareURL" class="share-url-button mr-1.5">
          <ButtonC :icon="ShareIcon" tooltip="Open Shareable URL" />
        </a>
        <a
          :href="eip.infoURL"
          target="_blank"
          class="visit-eip-button mr-1"
        >
          <ButtonC :icon="ArrowTopRightOnSquareIcon" tooltip="External Link with more information" />
        </a>
      </div>
    </div>

    <div class="text-blue-900 font-mono text-xs mb-6">
      <p v-if="eip.introText" v-html="eip.introText"></p>
      <p v-if="eip.usageText" class="mt-4" v-html="eip.usageText"></p>
    </div>

    <slot name="content"></slot>
  </div>
</template>
