<script setup lang="ts">
import Timeline from '../../../.vitepress/theme/components/Timeline.vue'
import { TIMELINE_PHASES } from '../../../data/timeline.ts'
import { SOCIAL_CARDS } from '../cards.ts'

const meta = SOCIAL_CARDS.timeline
</script>

<template>
  <article class="fyp-social-card fyp-social-card--banner fyp-social-card--timeline" data-social-card="timeline">
    <div class="fyp-social-card__bar" />

    <div class="fyp-social-banner fyp-social-banner--timeline">
      <div class="fyp-social-banner__glow fyp-social-banner__glow--primary" aria-hidden="true" />
      <div class="fyp-social-banner__glow fyp-social-banner__glow--secondary" aria-hidden="true" />

      <div class="fyp-social-banner__content">
        <p class="fyp-social-banner__eyebrow">{{ meta.eyebrow }}</p>
        <h1 class="fyp-social-banner__headline">{{ meta.title }}</h1>
        <p class="fyp-social-banner__tagline">{{ meta.subtitle }}</p>

        <ul class="fyp-social-timeline__phases">
          <li
            v-for="phase in TIMELINE_PHASES"
            :key="phase.id"
            class="fyp-social-timeline__phase"
            :style="{ '--phase-color': phase.color }"
          >
            <span class="fyp-social-timeline__phase-bar" aria-hidden="true" />
            <span class="fyp-social-timeline__phase-label">{{ phase.label }}</span>
            <span class="fyp-social-timeline__phase-range">{{ phase.range }}</span>
          </li>
        </ul>

        <p class="fyp-social-timeline__legend">
          <span class="fyp-social-timeline__legend-item">
            <span class="fyp-social-timeline__legend-dot fyp-social-timeline__legend-dot--done" />
            reached
          </span>
          <span class="fyp-social-timeline__legend-item">
            <span class="fyp-social-timeline__legend-dot fyp-social-timeline__legend-dot--upcoming" />
            upcoming target
          </span>
        </p>
      </div>
    </div>

    <div class="fyp-social-timeline__body">
      <Timeline />
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
