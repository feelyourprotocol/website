import { ref } from 'vue'

import { getIceCreamErrorView } from './errors'
import { ICE_CREAM_MEMES } from './memes'
import { canPurchase, canShuffleVendor, pickRandomMeme } from './pickMeme'
import { createSimulatedPurchasePort } from './purchasePort'
import type {
  IceCreamErrorView,
  IceCreamMeme,
  IceCreamPhase,
  IceCreamPurchasePort,
} from './types'

export type UseIceCreamStandOptions = {
  memes?: IceCreamMeme[]
  purchasePort?: IceCreamPurchasePort
}

export function useIceCreamStand(options: UseIceCreamStandOptions = {}) {
  const memes = options.memes ?? ICE_CREAM_MEMES
  const purchasePort = options.purchasePort ?? createSimulatedPurchasePort()

  const phase = ref<IceCreamPhase>('idle')
  const activeMeme = ref<IceCreamMeme>(pickRandomMeme(memes))
  const errorView = ref<IceCreamErrorView | null>(null)

  function shuffleVendor() {
    if (!canShuffleVendor(phase.value)) return
    activeMeme.value = pickRandomMeme(memes, activeMeme.value.id)
    errorView.value = null
    if (phase.value === 'error') phase.value = 'idle'
  }

  function resetStand() {
    phase.value = 'idle'
    errorView.value = null
    activeMeme.value = pickRandomMeme(memes)
  }

  async function buyIceCream() {
    if (!canPurchase(phase.value)) return

    phase.value = 'purchasing'
    errorView.value = null

    const outcome = await purchasePort.buy(activeMeme.value)

    if (outcome.status === 'success') {
      phase.value = 'success'
      return
    }

    errorView.value = getIceCreamErrorView(outcome.code)
    phase.value = 'error'
  }

  return {
    phase,
    activeMeme,
    errorView,
    memes,
    shuffleVendor,
    resetStand,
    buyIceCream,
    canPurchase,
    canShuffleVendor,
  }
}

export type IceCreamStand = ReturnType<typeof useIceCreamStand>
