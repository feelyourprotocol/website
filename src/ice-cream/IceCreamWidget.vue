<script setup lang="ts">
import { ref } from 'vue'

import { ICE_CREAM_PRICE_FYP, FYP_TOKEN_SYMBOL } from './constants'
import { COMMUNITY_TOKEN_HOME } from '@/libs/communityToken'
import type { IceCreamMeme, IceCreamPurchasePort } from './types'
import { useIceCreamStand } from './useIceCreamStand'
import { addFypToWallet, type AddFypToWalletResult } from './wallet'

import './ice-cream.css'

type FypTopicId = 'about' | 'why' | 'wallet'

const FYP_TOPICS: { id: FypTopicId; label: string }[] = [
  { id: 'about', label: 'What is FYP?' },
  { id: 'why', label: 'WTF, why ice cream?' },
  { id: 'wallet', label: 'FYP not in wallet?' },
]

const fypWalletStatus = ref<string | null>(null)
const addingFyp = ref(false)
const activeFypTopic = ref<FypTopicId | null>(null)

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

const FYP_WALLET_STATUS: Record<AddFypToWalletResult, string | null> = {
  added: 'Added — check MetaMask on Base.',
  rejected: 'Dismissed — you can add manually anytime.',
  unavailable: 'Needs MetaMask (or another Base wallet).',
}

async function onAddFypToWallet() {
  if (addingFyp.value) return
  addingFyp.value = true
  fypWalletStatus.value = null
  try {
    const result = await addFypToWallet()
    fypWalletStatus.value = FYP_WALLET_STATUS[result]
  } finally {
    addingFyp.value = false
  }
}

function toggleFypTopic(id: FypTopicId) {
  activeFypTopic.value = activeFypTopic.value === id ? null : id
}
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
          <img :src="activeMeme.successImg" :alt="`${activeMeme.flavor} soulbound ice cream`" />
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
        <img :src="activeMeme.vendorImg" :alt="`${activeMeme.name} ice cream stand`" />
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

          <div class="ice-cream-stand__fyp-faq">
            <div class="ice-cream-stand__fyp-topics" role="tablist" aria-label="FYP help">
              <template v-for="(topic, index) in FYP_TOPICS" :key="topic.id">
                <span v-if="index > 0" class="ice-cream-stand__fyp-sep" aria-hidden="true">·</span>
                <button
                  type="button"
                  role="tab"
                  class="ice-cream-stand__fyp-topic"
                  :class="{ 'is-active': activeFypTopic === topic.id }"
                  :aria-selected="activeFypTopic === topic.id"
                  @click="toggleFypTopic(topic.id)"
                >
                  {{ topic.label }}
                </button>
              </template>
            </div>

            <div
              v-if="activeFypTopic"
              class="ice-cream-stand__fyp-panel"
              role="tabpanel"
            >
              <template v-if="activeFypTopic === 'about'">
                <p>
                  Community token for live on-chain experiments.
                  <a
                    :href="COMMUNITY_TOKEN_HOME"
                    target="_blank"
                    rel="noopener"
                    class="ice-cream-stand__fyp-link"
                  >
                    About {{ FYP_TOKEN_SYMBOL }}
                  </a>
                </p>
              </template>

              <template v-else-if="activeFypTopic === 'why'">
                <p>
                  A summer gag and our first live on-chain experiment with
                  {{ FYP_TOKEN_SYMBOL }} on Base — real wallet flow: approve, pay
                  {{ ICE_CREAM_PRICE_FYP }} {{ FYP_TOKEN_SYMBOL }}, mint a soulbound meme receipt.
                  {{ FYP_TOKEN_SYMBOL }} is the community token we use to try protocol ideas in public.
                  Not financial advice — do your own research.
                </p>
              </template>

              <template v-else-if="activeFypTopic === 'wallet'">
                <p>Transfers can land before MetaMask lists the token on Base.</p>
                <div class="ice-cream-stand__fyp-actions">
                  <button
                    type="button"
                    class="ice-cream-stand__fyp-add"
                    :disabled="addingFyp"
                    @click="onAddFypToWallet"
                  >
                    {{ addingFyp ? 'Opening wallet…' : 'Add to wallet' }}
                  </button>
                  <span v-if="fypWalletStatus" class="ice-cream-stand__fyp-status">{{
                    fypWalletStatus
                  }}</span>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
