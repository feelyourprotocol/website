<script setup lang="ts">
import CopyButton from './CopyButton.vue'

export interface PromptCardProps {
  text: string
  /** Fork chip, e.g. "Amsterdam" or "Fusaka vs Amsterdam". */
  fork?: string
  /** One line: the number or field worth reading in the answer. */
  lookFor?: string
  /** MCP tool the agent will likely call (shown quietly). */
  tool?: string
  toolHref?: string
  /** Related page (e.g. an EIP page). */
  href?: string
  hrefLabel?: string
}

defineProps<PromptCardProps>()
</script>

<template>
  <article class="fyp-prompt-card" data-testid="prompt-card">
    <div class="fyp-prompt-card__meta">
      <span v-if="fork" class="fyp-chip fyp-chip--fork">{{ fork }}</span>
      <span v-else />
      <CopyButton :text="text" />
    </div>
    <blockquote class="fyp-prompt-card__quote">
      <p>{{ text }}</p>
    </blockquote>
    <p v-if="lookFor" class="fyp-prompt-card__hint">
      <span class="fyp-prompt-card__hint-label">Look for</span>{{ lookFor }}
    </p>
    <p v-if="tool || href" class="fyp-prompt-card__foot">
      <span v-if="tool">
        Agent will likely call
        <a v-if="toolHref" :href="toolHref">{{ tool }}</a>
        <code v-else>{{ tool }}</code>
      </span>
      <a v-if="href" class="fyp-prompt-card__more" :href="href">{{ hrefLabel ?? 'Related page' }} →</a>
    </p>
  </article>
</template>
