<script setup lang="ts">
import { BoltIcon } from '@heroicons/vue/20/solid'

defineProps<{
  poweredBy: { name: string; href: string }[]
}>()
</script>

<template>
  <div class="text-right text-xs mt-6 text-slate-400 flex items-center justify-end gap-1">
    <BoltIcon class="size-3 text-slate-300" />
    <span>Powered by</span>
    <template v-for="(item, index) in poweredBy" :key="item.name">
      <a :href="item.href" class="font-semibold e-text hover:underline" target="_blank" rel="noopener">{{
        item.name
      }}</a>
      <span v-if="index < poweredBy.length - 1" class="text-slate-300">·</span>
    </template>
  </div>
</template>
