<script setup lang="ts">
import { ICE_CREAM_PRICE_FYP, FYP_TOKEN_SYMBOL } from './constants'
import type { IceCreamMeme, IceCreamPurchasePort } from './types'
import { useIceCreamStand } from './useIceCreamStand'

import './ice-cream.css'

const props = defineProps<{
  /** Test / story injection — production uses defaults. */
  purchasePort?: IceCreamPurchasePort
  memes?: IceCreamMeme[]
}>()

const {
  phase,
  activeMeme,
  errorView,
  shuffleVendor,
  resetStand,
  buyIceCream,
  canPurchase,
  canShuffleVendor,
} = useIceCreamStand({ purchasePort: props.purchasePort, memes: props.memes })
</script>

<template>
  <div
    class="ice-cream-stand rounded-lg shadow-sm p-4 md:p-5"
    data-ice-cream-stand
    aria-live="polite"
  >
    <template v-if="phase === 'success'">
      <div class="ice-cream-stand__success flex flex-col gap-3">
        <div class="ice-cream-stand__hero">
          <img
            :src="activeMeme.successImg"
            :alt="`${activeMeme.flavor} soulbound ice cream`"
          />
        </div>
        <div class="text-center">
          <p class="ice-cream-stand__success-badge mb-2">Soulbound receipt minted</p>
          <h3 class="text-lg font-bold tracking-tight text-slate-800 mb-1">
            {{ activeMeme.flavor }}
          </h3>
          <p class="text-sm text-slate-600 mb-4">
            {{ activeMeme.successLine }}
          </p>
          <button type="button" class="ice-cream-stand__buy" @click="resetStand">
            Another scoop?
          </button>
        </div>
      </div>
    </template>

    <template v-else-if="phase === 'error' && errorView">
      <div class="ice-cream-stand__error mb-4">
        <h3 class="font-bold mb-1">{{ errorView.title }}</h3>
        <p class="leading-relaxed">{{ errorView.message }}</p>
        <p class="mt-2 text-xs text-amber-900/80">{{ errorView.hint }}</p>
      </div>
      <div class="ice-cream-stand__hero mb-4">
        <img
          :src="activeMeme.vendorImg"
          :alt="`${activeMeme.name} ice cream stand`"
        />
      </div>
      <div class="flex flex-wrap gap-3">
        <button type="button" class="ice-cream-stand__buy" @click="buyIceCream">Try again</button>
        <button type="button" class="ice-cream-stand__secondary" @click="shuffleVendor">
          Different vendor
        </button>
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col gap-3">
        <div class="ice-cream-stand__hero">
          <img
            :src="activeMeme.vendorImg"
            :alt="`${activeMeme.name} ice cream stand`"
            :class="phase === 'purchasing' ? 'ice-cream-purchasing' : ''"
          />
        </div>

        <div class="flex flex-col gap-3">
          <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <div>
              <p class="font-mono text-[0.65rem] uppercase tracking-wider text-purple-600 mb-1">
                Today's vendor
              </p>
              <h3 class="text-lg font-bold tracking-tight text-slate-800">
                {{ activeMeme.name }}
              </h3>
            </div>
            <span class="ice-cream-stand__price shrink-0">
              {{ ICE_CREAM_PRICE_FYP }} {{ FYP_TOKEN_SYMBOL }}
            </span>
          </div>

          <p class="text-sm leading-relaxed text-slate-600">
            {{ activeMeme.quote }}
          </p>

          <p class="text-sm text-slate-700">
            <span class="font-semibold text-slate-900">{{ activeMeme.flavor }}</span>
            — {{ activeMeme.flavorBlurb }}
          </p>

          <p class="font-mono text-[0.65rem] text-slate-400">Base mainnet · per scoop</p>

          <div class="flex flex-wrap gap-3">
            <button
              type="button"
              class="ice-cream-stand__buy"
              :disabled="!canPurchase(phase)"
              @click="buyIceCream"
            >
              {{
                phase === 'purchasing'
                  ? 'Scooping on-chain…'
                  : `Buy Ice Cream (${ICE_CREAM_PRICE_FYP} ${FYP_TOKEN_SYMBOL})`
              }}
            </button>
            <button
              type="button"
              class="ice-cream-stand__secondary self-center"
              :disabled="!canShuffleVendor(phase)"
              @click="shuffleVendor"
            >
              Different vendor
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
