<script setup lang="ts">
export interface SpecRow {
  label: string
  href?: string
  text?: string
}

defineProps<{
  rows: SpecRow[]
}>()

function external(href: string): boolean {
  return /^https?:\/\//.test(href)
}
</script>

<template>
  <dl class="fyp-spec-table" data-testid="spec-table">
    <div v-for="row in rows" :key="row.label" class="fyp-spec-table__row">
      <dt>{{ row.label }}</dt>
      <dd>
        <a
          v-if="row.href"
          :href="row.href"
          :target="external(row.href) ? '_blank' : undefined"
          :rel="external(row.href) ? 'noopener noreferrer' : undefined"
          >{{ row.text ?? row.href }}</a
        >
        <template v-else>{{ row.text }}</template>
      </dd>
    </div>
  </dl>
</template>
