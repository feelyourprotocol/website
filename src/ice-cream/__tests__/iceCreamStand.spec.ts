import { describe, expect, it } from 'vitest'

import { FYP_SPECIAL_ACTIONS_WALLET_ADDRESS } from '../constants'
import { getIceCreamErrorView } from '../errors'
import { ICE_CREAM_MEMES } from '../memes'
import { canPurchase, canShuffleVendor, pickRandomMeme } from '../pickMeme'
import { createSimulatedPurchasePort } from '../purchasePort'
import type { IceCreamMeme } from '../types'
import { useIceCreamStand } from '../useIceCreamStand'

const testMemes: IceCreamMeme[] = [
  {
    id: 'a',
    name: 'Vendor A',
    quote: 'Best scoops.',
    flavor: 'Alpha',
    flavorBlurb: 'Alpha blurb.',
    successLine: 'Alpha success.',
    vendorImg: '/a-vendor.svg',
    successImg: '/a-success.svg',
    priceFyp: '10',
    nftId: 1,
  },
  {
    id: 'b',
    name: 'Vendor B',
    quote: 'Also best scoops.',
    flavor: 'Beta',
    flavorBlurb: 'Beta blurb.',
    successLine: 'Beta success.',
    vendorImg: '/b-vendor.svg',
    successImg: '/b-success.svg',
    priceFyp: '10',
    nftId: 2,
  },
]

describe('ice-cream pickMeme', () => {
  it('returns a meme from the pool', () => {
    const picked = pickRandomMeme(testMemes)
    expect(testMemes.some((m) => m.id === picked.id)).toBe(true)
  })

  it('excludes the current vendor when shuffling', () => {
    const picked = pickRandomMeme(testMemes, 'a')
    expect(picked.id).toBe('b')
  })

  it('gates purchase and shuffle by phase', () => {
    expect(canPurchase('idle')).toBe(true)
    expect(canPurchase('error')).toBe(true)
    expect(canPurchase('purchasing')).toBe(false)
    expect(canShuffleVendor('success')).toBe(false)
  })
})

describe('ice-cream purchasePort', () => {
  it('simulates success by default', async () => {
    const port = createSimulatedPurchasePort({ delayMs: 0 })
    await expect(port.buy(testMemes[0]!)).resolves.toEqual({ status: 'success' })
  })

  it('simulates configured errors', async () => {
    const port = createSimulatedPurchasePort({
      delayMs: 0,
      outcome: { status: 'error', code: 'insufficient_fyp' },
    })
    await expect(port.buy(testMemes[0]!)).resolves.toEqual({
      status: 'error',
      code: 'insufficient_fyp',
    })
  })
})

describe('ice-cream errors', () => {
  it('returns humorous copy for each code', () => {
    const view = getIceCreamErrorView('wallet_rejected')
    expect(view.title.length).toBeGreaterThan(3)
    expect(view.hint.length).toBeGreaterThan(10)
  })
})

describe('useIceCreamStand', () => {
  it('starts with a random vendor', () => {
    const stand = useIceCreamStand({
      memes: testMemes,
      purchasePort: createSimulatedPurchasePort(),
    })
    expect(testMemes.some((m) => m.id === stand.activeMeme.value.id)).toBe(true)
  })

  it('completes a simulated purchase', async () => {
    const stand = useIceCreamStand({
      memes: testMemes,
      purchasePort: createSimulatedPurchasePort({ delayMs: 0 }),
    })
    stand.activeMeme.value = testMemes[0]!

    await stand.buyIceCream()

    expect(stand.phase.value).toBe('success')
  })

  it('shows error feedback on failed purchase', async () => {
    const stand = useIceCreamStand({
      memes: testMemes,
      purchasePort: createSimulatedPurchasePort({
        delayMs: 0,
        outcome: { status: 'error', code: 'network' },
      }),
    })

    await stand.buyIceCream()

    expect(stand.phase.value).toBe('error')
    expect(stand.errorView.value?.code).toBe('network')
  })

  it('shuffles to the other vendor', () => {
    const stand = useIceCreamStand({
      memes: testMemes,
      purchasePort: createSimulatedPurchasePort(),
    })
    stand.activeMeme.value = testMemes[0]!
    stand.shuffleVendor()
    expect(stand.activeMeme.value.id).toBe('b')
  })
})

describe('ice-cream constants', () => {
  it('wires FYP Special Actions revenue wallet', () => {
    expect(FYP_SPECIAL_ACTIONS_WALLET_ADDRESS).toBe('0x4AEef6965A4cBcddb2e96555dCD0cB1afA7Bd202')
  })
})

describe('ice-cream memes registry', () => {
  it('ships eight vendor sets', () => {
    expect(ICE_CREAM_MEMES).toHaveLength(8)
    for (const meme of ICE_CREAM_MEMES) {
      expect(meme.vendorImg).toBeTruthy()
      expect(meme.successImg).toBeTruthy()
      expect(meme.nftId).toBeGreaterThan(0)
    }
  })
})
