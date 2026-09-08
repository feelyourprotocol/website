<script setup lang="ts">
import type { SegmentedToggleOption } from './segmentedToggleTypes'

const selected = defineModel<string>({ required: true })

defineProps<{
  options: SegmentedToggleOption[]
  /** Accessible name (`aria-label` on the group). Not named `ariaLabel` — Vue does not camelize `aria-*`. */
  groupLabel: string
  testId?: string
}>()

function select(value: string) {
  if (selected.value === value) return
  selected.value = value
}
</script>

<template>
  <div class="e-segmented-toggle" role="group" :aria-label="groupLabel" :data-testid="testId">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="e-segmented-toggle-option"
      :class="
        selected === option.value
          ? 'e-segmented-toggle-option-selected'
          : 'e-segmented-toggle-option-idle'
      "
      :aria-pressed="selected === option.value"
      :data-testid="option.testId"
      @click="select(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
