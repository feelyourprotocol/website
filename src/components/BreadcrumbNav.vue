<script setup lang="ts">
import type { BreadcrumbItem } from '@/libs/pageSeo'

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<template>
  <nav aria-label="Breadcrumb" class="font-mono text-xs text-slate-400 mb-4">
    <ol class="flex flex-wrap items-center gap-x-1.5 gap-y-1 list-none p-0 m-0">
      <li
        v-for="(item, index) in items"
        :key="`${item.label}-${index}`"
        class="inline-flex items-center gap-x-1.5"
      >
        <span v-if="index > 0" aria-hidden="true">›</span>
        <RouterLink
          v-if="item.to && index < items.length - 1"
          :to="item.to"
          class="hover:underline text-slate-500"
        >
          {{ item.label }}
        </RouterLink>
        <span v-else aria-current="page" class="text-slate-500">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>
