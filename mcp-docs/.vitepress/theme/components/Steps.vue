<script setup lang="ts">
export interface StepItem {
  title: string
  detail?: string
  href?: string
}

defineProps<{
  steps: StepItem[]
}>()
</script>

<template>
  <ol class="fyp-steps" data-testid="steps">
    <li v-for="(step, index) in steps" :key="index" class="fyp-steps__item">
      <span class="fyp-steps__marker" aria-hidden="true">{{ index + 1 }}</span>
      <div class="fyp-steps__body">
        <p class="fyp-steps__title">
          <a v-if="step.href" :href="step.href">{{ step.title }}</a>
          <template v-else>{{ step.title }}</template>
        </p>
        <p v-if="step.detail" class="fyp-steps__detail">{{ step.detail }}</p>
      </div>
    </li>
  </ol>
</template>
