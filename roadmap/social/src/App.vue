<script setup lang="ts">
import { computed } from 'vue'

import { isSocialCardId, SOCIAL_CARD_IDS, type SocialCardId } from './cards'
import BoardSocialCard from './components/BoardSocialCard.vue'
import HeroSocialCard from './components/HeroSocialCard.vue'
import TimelineSocialCard from './components/TimelineSocialCard.vue'

const params = new URLSearchParams(window.location.search)
const cardParam = params.get('card')
const captureMode = params.get('mode') === 'capture'

const activeCards = computed((): SocialCardId[] => {
  if (!cardParam || cardParam === 'all') return [...SOCIAL_CARD_IDS]
  if (isSocialCardId(cardParam)) return [cardParam]
  return [...SOCIAL_CARD_IDS]
})
</script>

<template>
  <div class="fyp-social-shell" :class="{ 'fyp-social-shell--capture': captureMode }">
    <HeroSocialCard v-if="activeCards.includes('hero')" />
    <TimelineSocialCard v-if="activeCards.includes('timeline')" />
    <BoardSocialCard v-if="activeCards.includes('board')" />
  </div>
</template>
