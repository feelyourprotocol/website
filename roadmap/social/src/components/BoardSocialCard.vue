<script setup lang="ts">
import RoadmapBoard from '../../../.vitepress/theme/components/RoadmapBoard.vue'
import { roadmapIcon } from '../../../.vitepress/theme/icons.ts'
import { ROADMAP_HORIZONS, ROADMAP_TRACKS } from '../../../data/roadmap.ts'
import { SOCIAL_CARDS } from '../cards.ts'

const meta = SOCIAL_CARDS.board
</script>

<template>
  <article class="fyp-social-card fyp-social-card--banner fyp-social-card--board" data-social-card="board">
    <div class="fyp-social-card__bar" />

    <div class="fyp-social-banner fyp-social-banner--board">
      <div class="fyp-social-banner__glow fyp-social-banner__glow--primary" aria-hidden="true" />
      <div class="fyp-social-banner__glow fyp-social-banner__glow--secondary" aria-hidden="true" />

      <div class="fyp-social-banner__content">
        <p class="fyp-social-banner__eyebrow">{{ meta.eyebrow }}</p>
        <h1 class="fyp-social-banner__headline">{{ meta.title }}</h1>
        <p class="fyp-social-banner__tagline">{{ meta.subtitle }}</p>

        <div class="fyp-social-board__banner-grid">
          <ul class="fyp-social-board__horizons">
            <li
              v-for="(horizon, index) in ROADMAP_HORIZONS"
              :key="horizon.id"
              class="fyp-social-board__horizon"
              :class="`fyp-social-board__horizon--${index + 1}`"
            >
              <component
                :is="roadmapIcon(horizon.icon)"
                v-if="roadmapIcon(horizon.icon)"
                class="fyp-social-board__horizon-icon"
                aria-hidden="true"
              />
              <span class="fyp-social-board__horizon-label">{{ horizon.label }}</span>
            </li>
          </ul>

          <ul class="fyp-social-board__tracks">
            <li
              v-for="track in ROADMAP_TRACKS"
              :key="track.id"
              class="fyp-social-board__track"
              :style="{ '--track-accent': track.accent }"
            >
              <component
                :is="roadmapIcon(track.icon)"
                v-if="roadmapIcon(track.icon)"
                class="fyp-social-board__track-icon"
                aria-hidden="true"
              />
              <span class="fyp-social-board__track-label">{{ track.label }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="fyp-social-board__body">
      <RoadmapBoard />
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
