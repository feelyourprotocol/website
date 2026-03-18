<script setup lang="ts">
import { BoltIcon, UserCircleIcon } from '@heroicons/vue/20/solid'

defineProps<{
  poweredBy: { name: string; href: string }[]
  creatorName?: string
  creatorURL?: string
}>()
</script>

<template>
  <div class="flex items-center justify-between text-xs mt-6 text-slate-400">
    <div v-if="creatorName" class="flex items-center gap-1.5 text-sm text-slate-500">
      <UserCircleIcon class="size-4 text-slate-400" />
      <a
        v-if="creatorURL"
        :href="creatorURL"
        class="font-semibold e-text hover:underline"
        target="_blank"
        rel="noopener"
        >{{ creatorName }}</a
      >
      <span v-else>{{ creatorName }}</span>
    </div>
    <div v-else />
    <div class="flex items-center gap-0.5 text-[0.65rem] text-slate-300">
      <BoltIcon class="size-2.5 text-slate-400 mr-1" />
      <template v-for="(item, index) in poweredBy" :key="item.name">
        <a
          :href="item.href"
          class="font-semibold e-text hover:underline"
          target="_blank"
          rel="noopener"
          >{{ item.name }}</a
        >
        <span v-if="index < poweredBy.length - 1">|</span>
      </template>
    </div>
  </div>
</template>
