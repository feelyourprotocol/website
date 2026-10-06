<script setup lang="ts">
import { TOOL_DOC_PATH } from '../mcpConstants'

defineProps<{
  number: number | string
  title: string
  status?: 'Runnable' | 'Planned'
  fork?: string
  tools?: string[]
  launchNote?: string
  explorationHref?: string
  explorationLabel?: string
}>()
</script>

<template>
  <header class="fyp-eip-header" data-testid="eip-header">
    <div class="fyp-eip-header__row">
      <p class="fyp-eip-header__id">
        <span class="fyp-eip-header__number">EIP-{{ number }}</span>
        <span class="fyp-eip-header__title">{{ title }}</span>
      </p>
      <span v-if="status" class="fyp-chip fyp-chip--status">{{ status }}</span>
    </div>
    <p v-if="launchNote" class="fyp-eip-header__launch">{{ launchNote }}</p>
    <div class="fyp-eip-header__chips">
      <span v-if="fork" class="fyp-chip fyp-chip--fork">{{ fork }}</span>
      <template v-if="tools?.length">
        <span class="fyp-eip-header__tools-label">Runs with</span>
        <component
          :is="TOOL_DOC_PATH[tool] ? 'a' : 'span'"
          v-for="tool in tools"
          :key="tool"
          class="fyp-chip fyp-chip--tool"
          :href="TOOL_DOC_PATH[tool]"
        >
          {{ tool }}
        </component>
      </template>
    </div>
    <p v-if="explorationHref" class="fyp-eip-header__links">
      Website twin:
      <a :href="explorationHref" target="_blank" rel="noopener noreferrer">
        {{ explorationLabel ?? 'exploration on feelyourprotocol.org' }}
      </a>
    </p>
  </header>
</template>
