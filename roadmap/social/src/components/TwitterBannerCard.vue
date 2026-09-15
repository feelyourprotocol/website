<script setup lang="ts">
import cover7843 from '../../../../src/explorations/eip-7843/image_small.webp'
import cover8037 from '../../../../src/explorations/eip-8037/image_small.webp'
import cover8038 from '../../../../src/explorations/eip-8038/image_small.webp'
import panoramaUrl from '../../../../design/source/twitter/panorama.png'
import { SOCIAL_CARDS } from '../cards.ts'

const meta = SOCIAL_CARDS['twitter-banner']

const params = new URLSearchParams(window.location.search)
const captureMode = params.get('mode') === 'capture'

/** Keep in sync with FEATURED_EXPLORATION_IDS (home Latest three). */
const covers = [
  { id: 'eip-8038', src: cover8038, tilt: '-6deg' },
  { id: 'eip-7843', src: cover7843, tilt: '0deg' },
  { id: 'eip-8037', src: cover8037, tilt: '6deg' },
] as const
</script>

<template>
  <article class="fyp-twitter-banner" data-social-card="twitter-banner">
    <div
      class="fyp-twitter-banner__panorama"
      :style="{ backgroundImage: `url(${panoramaUrl})` }"
      aria-hidden="true"
    />
    <div class="fyp-twitter-banner__bar" aria-hidden="true" />
    <div class="fyp-twitter-banner__glow fyp-twitter-banner__glow--primary" aria-hidden="true" />
    <div class="fyp-twitter-banner__glow fyp-twitter-banner__glow--secondary" aria-hidden="true" />

    <div v-if="!captureMode" class="fyp-twitter-banner__guides" aria-hidden="true">
      <div class="fyp-twitter-banner__guide fyp-twitter-banner__guide--crop-top" />
      <div class="fyp-twitter-banner__guide fyp-twitter-banner__guide--crop-bottom" />
      <div class="fyp-twitter-banner__guide fyp-twitter-banner__guide--avatar" />
      <div class="fyp-twitter-banner__guide fyp-twitter-banner__guide--follow" />
      <div class="fyp-twitter-banner__guide fyp-twitter-banner__guide--safe" />
    </div>

    <p class="fyp-twitter-banner__url">{{ meta.footerHint }}</p>

    <div class="fyp-twitter-banner__safe">
      <div class="fyp-twitter-banner__copy">
        <p class="fyp-twitter-banner__eyebrow">{{ meta.eyebrow }}</p>
        <h1 class="fyp-twitter-banner__headline">{{ meta.title }}</h1>
        <p class="fyp-twitter-banner__subtitle">{{ meta.subtitle }}</p>
      </div>

      <ul class="fyp-twitter-banner__covers" aria-label="Latest explorations">
        <li
          v-for="cover in covers"
          :key="cover.id"
          class="fyp-twitter-banner__cover"
          :style="{ '--cover-tilt': cover.tilt }"
        >
          <img :src="cover.src" alt="" width="120" height="160" />
        </li>
      </ul>
    </div>
  </article>
</template>
