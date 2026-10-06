<script setup lang="ts">
export interface DoorItem {
  title: string
  detail: string
  href: string
}

defineProps<{
  items: DoorItem[]
}>()
</script>

<template>
  <nav class="fyp-door-strip" aria-label="Documentation sections" data-testid="door-strip">
    <a v-for="item in items" :key="item.href" class="fyp-door-strip__item" :href="item.href">
      <span class="fyp-door-strip__title">{{ item.title }}</span>
      <span class="fyp-door-strip__detail">{{ item.detail }}</span>
    </a>
  </nav>
</template>
