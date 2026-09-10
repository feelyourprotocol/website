<script setup lang="ts">
import logoUrl from '../../../../src/logo.png'

import { SOCIAL_CARDS } from '../cards.ts'

const meta = SOCIAL_CARDS['youtube-banner']

const previews = [
  {
    fork: 'Ethereum · Amsterdam',
    spec: 'EIP-7843',
    hook: 'SLOTNUM',
    accent: '#a855f7',
  },
  {
    fork: 'Ethereum · Osaka',
    spec: 'EIP-8037',
    hook: 'OUT OF GAS',
    accent: '#a855f7',
  },
  {
    fork: 'Ethereum · Osaka',
    spec: 'EIP-7708',
    hook: '3 NEW OPCODES',
    accent: '#eab308',
  },
] as const
</script>

<template>
  <article class="fyp-youtube-banner" data-social-card="youtube-banner">
    <div class="fyp-youtube-banner__bar" aria-hidden="true" />
    <div class="fyp-youtube-banner__glow fyp-youtube-banner__glow--primary" aria-hidden="true" />
    <div class="fyp-youtube-banner__glow fyp-youtube-banner__glow--secondary" aria-hidden="true" />

    <div class="fyp-youtube-banner__safe">
      <div class="fyp-youtube-banner__brand">
        <img
          class="fyp-youtube-banner__logo"
          :src="logoUrl"
          alt=""
          width="220"
          height="260"
        />
        <div class="fyp-youtube-banner__copy">
          <p class="fyp-youtube-banner__eyebrow">{{ meta.eyebrow }}</p>
          <h1 class="fyp-youtube-banner__name">{{ meta.title }}</h1>
          <p class="fyp-youtube-banner__tagline">{{ meta.subtitle }}</p>
          <p class="fyp-youtube-banner__meta">
            <span>EIP explainers</span>
            <span class="fyp-youtube-banner__meta-dot" aria-hidden="true">·</span>
            <span>feelyourprotocol.org</span>
          </p>
        </div>
      </div>

      <ul class="fyp-youtube-banner__previews" aria-label="Recent Shorts topics">
        <li
          v-for="(preview, index) in previews"
          :key="preview.spec"
          class="fyp-youtube-banner__preview"
          :style="{ '--preview-accent': preview.accent, '--preview-tilt': `${(index - 1) * 3}deg` }"
        >
          <div class="fyp-youtube-banner__preview-band" />
          <div class="fyp-youtube-banner__preview-body">
            <p class="fyp-youtube-banner__preview-fork">{{ preview.fork }}</p>
            <p class="fyp-youtube-banner__preview-spec">{{ preview.spec }}</p>
            <p class="fyp-youtube-banner__preview-hook">{{ preview.hook }}</p>
          </div>
        </li>
      </ul>
    </div>
  </article>
</template>
