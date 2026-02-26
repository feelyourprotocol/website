<script setup lang="ts">
defineProps<{
  poweredBy: { name: string; href: string }[]
}>()
</script>
<template>
  <div class="text-right text-xs mt-7">
    Powered by:
    <template v-for="(item, index) in poweredBy" :key="item.name">
      <a :href="item.href" class="text-blue-900 font-bold" target="_blank" rel="noopener">{{
        item.name
      }}</a>
      <span v-if="index < poweredBy.length - 1"> | </span>
    </template>
  </div>
</template>
