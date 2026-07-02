<script setup lang="ts">
defineProps<{
  cardId: string
  eyebrow: string
  title: string
  subtitle?: string
  footerHint?: string
}>()
</script>

<template>
  <article class="fyp-social-card" :data-social-card="cardId">
    <div class="fyp-social-card__bar" />
    <header class="fyp-social-card__header">
      <p class="fyp-social-card__eyebrow">{{ eyebrow }}</p>
      <h1 class="fyp-social-card__title">{{ title }}</h1>
      <p v-if="subtitle" class="fyp-social-card__subtitle">{{ subtitle }}</p>
    </header>
    <div class="fyp-social-card__body">
      <slot />
    </div>
    <footer class="fyp-social-card__footer">
      <span class="fyp-social-card__brand">Feel Your Protocol</span>
      <span>
        roadmap.feelyourprotocol.org
        <template v-if="footerHint"> · {{ footerHint }}</template>
      </span>
    </footer>
  </article>
</template>
