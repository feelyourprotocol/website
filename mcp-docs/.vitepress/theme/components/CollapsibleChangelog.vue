<script setup lang="ts">
import Changelog from './Changelog.vue'

interface ChangelogEntry {
  version: string
  date?: string
  summary: string
}

defineProps<{
  entries: ChangelogEntry[]
  title?: string
  open?: boolean
}>()
</script>

<template>
  <details class="fyp-changelog-collapse" data-testid="collapsible-changelog" :open="open">
    <summary class="fyp-changelog-collapse__summary">{{ title ?? 'Section changelog' }}</summary>
    <Changelog :entries="entries" :title="title" />
  </details>
</template>
