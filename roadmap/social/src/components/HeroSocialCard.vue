<script setup lang="ts">
import { SOCIAL_CARDS } from '../cards.ts'
import { HERO_FEATURES } from '../heroFeatures.ts'

const meta = SOCIAL_CARDS.hero
</script>

<template>
  <article class="fyp-social-card fyp-social-card--banner fyp-social-card--hero" data-social-card="hero">
    <div class="fyp-social-card__bar" />

    <div class="fyp-social-banner fyp-social-banner--hero">
      <div class="fyp-social-banner__glow fyp-social-banner__glow--primary" aria-hidden="true" />
      <div class="fyp-social-banner__glow fyp-social-banner__glow--secondary" aria-hidden="true" />

      <div class="fyp-social-banner__content">
        <p class="fyp-social-banner__eyebrow">{{ meta.eyebrow }}</p>

        <p class="fyp-social-hero__name">Feel Your Protocol</p>
        <h1 class="fyp-social-banner__headline">{{ meta.title }}</h1>
        <p class="fyp-social-banner__tagline">{{ meta.subtitle }}</p>

        <p class="fyp-social-hero__thesis">Deterministic truth for probabilistic machines.</p>

        <ul class="fyp-social-hero__features">
          <li v-for="feature in HERO_FEATURES" :key="feature.title" class="fyp-social-hero__feature">
            <p class="fyp-social-hero__feature-title">{{ feature.title }}</p>
            <p class="fyp-social-hero__feature-detail">{{ feature.detail }}</p>
          </li>
        </ul>
      </div>
    </div>

    <footer class="fyp-social-card__footer">
      <span class="fyp-social-card__brand">Feel Your Protocol</span>
      <span>
        roadmap.feelyourprotocol.org
        <template v-if="meta.footerHint"> · {{ meta.footerHint }}</template>
      </span>
    </footer>
  </article>
</template>
