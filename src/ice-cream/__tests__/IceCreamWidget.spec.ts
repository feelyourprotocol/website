import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

import IceCreamWidget from '../IceCreamWidget.vue'
import { createSimulatedPurchasePort } from '../purchasePort'
import type { IceCreamMeme } from '../types'

const testMemes: IceCreamMeme[] = [
  {
    id: 'a',
    name: 'Vendor A',
    quote: 'Scoops for days.',
    flavor: 'Alpha Ripple',
    flavorBlurb: 'Alpha blurb.',
    successLine: 'Alpha success.',
    vendorImg: 'data:image/svg+xml,a-vendor',
    successImg: 'data:image/svg+xml,a-success',
    priceFyp: '10',
    nftId: 1,
  },
  {
    id: 'b',
    name: 'Vendor B',
    quote: 'Cold chain guaranteed.',
    flavor: 'Beta Beam',
    flavorBlurb: 'Beta blurb.',
    successLine: 'Beta success.',
    vendorImg: 'data:image/svg+xml,b-vendor',
    successImg: 'data:image/svg+xml,b-success',
    priceFyp: '10',
    nftId: 2,
  },
]

describe('IceCreamWidget', () => {
  it('renders vendor pitch and buy button', () => {
    const wrapper = mount(IceCreamWidget, {
      props: {
        memes: [testMemes[0]!],
        purchasePort: createSimulatedPurchasePort({ delayMs: 0 }),
      },
    })

    expect(wrapper.text()).toContain('Buy Ice Cream (10 FYP)')
    expect(wrapper.find('[data-ice-cream-stand]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Vendor A')
  })

  it('shows success NFT after purchase', async () => {
    const wrapper = mount(IceCreamWidget, {
      props: {
        memes: [testMemes[0]!],
        purchasePort: createSimulatedPurchasePort({ delayMs: 0 }),
      },
    })

    await wrapper.get('.ice-cream-stand__buy').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Soulbound receipt minted')
    expect(wrapper.find('img[alt*="soulbound ice cream"]').attributes('src')).toContain('a-success')
  })

  it('shows error panel when purchase fails', async () => {
    const wrapper = mount(IceCreamWidget, {
      props: {
        memes: [testMemes[0]!],
        purchasePort: createSimulatedPurchasePort({
          delayMs: 0,
          outcome: { status: 'error', code: 'insufficient_fyp' },
        }),
      },
    })

    await wrapper.get('.ice-cream-stand__buy').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Not enough $FYP')
    expect(wrapper.text()).toContain('Try again')
  })
})
