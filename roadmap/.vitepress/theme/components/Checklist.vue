<script setup lang="ts">
/**
 * One checklist panel. A single bar, not a card per item.
 *
 *   <Checklist label="Before we call it live" :items="['HTTP endpoint reachable']" />
 */
import { CheckCircleIcon } from '@heroicons/vue/24/outline'

defineProps<{
  label: string
  items: string[]
}>()
</script>

<template>
  <section class="fyp-checklist" data-testid="checklist">
    <p class="fyp-checklist__label">{{ label }}</p>
    <ul class="fyp-checklist__items">
      <li v-for="item in items" :key="item">
        <CheckCircleIcon class="fyp-checklist__mark" aria-hidden="true" />
        <span>{{ item }}</span>
      </li>
    </ul>
  </section>
</template>
