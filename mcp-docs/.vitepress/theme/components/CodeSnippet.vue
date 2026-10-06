<script setup lang="ts">
import CopyButton from './CopyButton.vue'

defineProps<{
  code: string
  language?: string
  caption?: string
}>()
</script>

<template>
  <figure class="fyp-code-snippet" data-testid="code-snippet">
    <figcaption v-if="caption" class="fyp-code-snippet__caption">{{ caption }}</figcaption>
    <div class="fyp-code-snippet__bar">
      <span class="fyp-code-snippet__lang">{{ language ?? '' }}</span>
      <CopyButton :text="code" />
    </div>
    <pre class="fyp-code-snippet__pre"><code>{{ code }}</code></pre>
  </figure>
</template>
