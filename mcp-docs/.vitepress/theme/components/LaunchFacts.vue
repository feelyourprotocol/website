<script setup lang="ts">
export interface LaunchFact {
  title: string
  detail: string
}

defineProps<{
  facts: LaunchFact[]
}>()
</script>

<template>
  <div class="fyp-launch-facts" role="list" data-testid="launch-facts">
    <div v-for="fact in facts" :key="fact.title" class="fyp-launch-facts__item" role="listitem">
      <p class="fyp-launch-facts__title">{{ fact.title }}</p>
      <p class="fyp-launch-facts__detail">{{ fact.detail }}</p>
    </div>
  </div>
</template>
