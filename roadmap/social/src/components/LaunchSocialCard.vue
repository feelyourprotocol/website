<script setup lang="ts">
import { SOCIAL_CARDS } from '../cards.ts'

const meta = SOCIAL_CARDS.launch

const bullets = [
  'Hosted MCP at mcp.feelyourprotocol.org',
  'Tools: describe_capabilities · run_evm_bytecode',
  'Deterministic simulations — Amsterdam / Glamsterdam EIPs',
  'x402 USDC on Base at launch (target)',
] as const
</script>

<template>
  <article
    class="fyp-social-card fyp-social-card--banner fyp-social-card--launch"
    data-social-card="launch"
  >
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
          <li v-for="bullet in bullets" :key="bullet" class="fyp-social-hero__feature">
            <p class="fyp-social-hero__feature-title">{{ bullet }}</p>
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
