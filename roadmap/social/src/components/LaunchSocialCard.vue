<script setup lang="ts">
import { SOCIAL_CARDS } from '../cards.ts'

const meta = SOCIAL_CARDS.launch

const bullets = [
  { title: 'Hosted MCP', detail: 'mcp.feelyourprotocol.org' },
  { title: 'Generic tools', detail: 'describe_capabilities · run_evm_bytecode' },
  { title: 'Agent payments', detail: 'x402 · USDC on Base' },
] as const
</script>

<template>
  <article
    class="fyp-social-card fyp-social-card--banner fyp-social-card--launch"
    data-social-card="launch"
  >
    <div class="fyp-social-card__bar" />

    <div class="fyp-social-banner fyp-social-banner--hero fyp-social-banner--launch">
      <div class="fyp-social-banner__glow fyp-social-banner__glow--primary" aria-hidden="true" />
      <div class="fyp-social-banner__glow fyp-social-banner__glow--secondary" aria-hidden="true" />

      <div class="fyp-social-banner__content">
        <p class="fyp-social-banner__eyebrow fyp-social-launch__eyebrow">{{ meta.eyebrow }}</p>

        <p class="fyp-social-launch__brand">Feel Your Protocol</p>

        <div class="fyp-social-launch__date-panel" aria-label="Launch week dates">
          <p class="fyp-social-launch__date-label">Launch week</p>
          <p class="fyp-social-launch__date">{{ meta.title }}</p>
        </div>

        <h1 class="fyp-social-launch__headline">Hosted MCP goes public</h1>
        <p class="fyp-social-banner__tagline fyp-social-launch__tagline">{{ meta.subtitle }}</p>

        <ul class="fyp-social-hero__features fyp-social-launch__features">
          <li v-for="bullet in bullets" :key="bullet.title" class="fyp-social-hero__feature">
            <p class="fyp-social-hero__feature-title">{{ bullet.title }}</p>
            <p class="fyp-social-hero__feature-detail">{{ bullet.detail }}</p>
          </li>
        </ul>
      </div>
    </div>

    <footer class="fyp-social-card__footer">
      <span class="fyp-social-card__brand">Feel Your Protocol</span>
      <span>
        roadmap.feelyourprotocol.org/roadmap/launch
        <template v-if="meta.footerHint"> · {{ meta.footerHint }}</template>
      </span>
    </footer>
  </article>
</template>
