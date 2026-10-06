<script setup lang="ts">
import { FYP_MCP_URL } from '../mcpConstants'
import CopyButton from './CopyButton.vue'

defineProps<{
  label?: string
}>()
</script>

<template>
  <div class="fyp-endpoint-card" data-testid="endpoint-card">
    <p class="fyp-endpoint-card__label">{{ label ?? 'Live endpoint' }}</p>
    <div class="fyp-endpoint-card__row">
      <code class="fyp-endpoint-card__url">{{ FYP_MCP_URL }}</code>
      <CopyButton :text="FYP_MCP_URL" label="Copy URL" />
    </div>
  </div>
</template>
