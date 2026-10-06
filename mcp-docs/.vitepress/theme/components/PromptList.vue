<script setup lang="ts">
import PromptCard, { type PromptCardProps } from './PromptCard.vue'

export interface PromptGroup {
  label: string
  prompts: PromptCardProps[]
}

defineProps<{
  groups: PromptGroup[]
  intro?: string
}>()
</script>

<template>
  <section class="fyp-prompt-list" data-testid="prompt-list">
    <p v-if="intro" class="fyp-prompt-list__intro">{{ intro }}</p>
    <div v-for="group in groups" :key="group.label" class="fyp-prompt-list__group">
      <p class="fyp-prompt-list__label">{{ group.label }}</p>
      <div class="fyp-prompt-list__cards">
        <PromptCard v-for="(prompt, index) in group.prompts" :key="`${group.label}-${index}`" v-bind="prompt" />
      </div>
    </div>
  </section>
</template>
