<script setup lang="ts">
/**
 * Per-section micro-changelog. Pages pass entries inline, e.g.:
 *
 *   <Changelog :entries="[
 *     { version: 'v0.1', date: '2026-06-30', summary: 'Initial draft' },
 *   ]" />
 *
 * Newest entry first. Keep summaries to one line.
 */
interface ChangelogEntry {
  version: string
  date?: string
  summary: string
}

defineProps<{
  entries: ChangelogEntry[]
  title?: string
}>()
</script>

<template>
  <section class="fyp-changelog">
    <div class="fyp-changelog__head">{{ title ?? 'Section Changelog' }}</div>
    <ol class="fyp-changelog__list">
      <li v-for="entry in entries" :key="entry.version" class="fyp-changelog__entry">
        <span class="fyp-changelog__version">{{ entry.version }}</span>
        <span v-if="entry.date" class="fyp-changelog__date">{{ entry.date }}</span>
        <span class="fyp-changelog__summary">{{ entry.summary }}</span>
      </li>
    </ol>
  </section>
</template>
