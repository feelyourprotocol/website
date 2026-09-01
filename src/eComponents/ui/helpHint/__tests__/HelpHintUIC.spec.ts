import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import HelpHintUIC from '@/eComponents/ui/HelpHintUIC.vue'

function mockMatchMedia(canHover: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
    matches: query === '(hover: hover) and (pointer: fine)' ? canHover : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

describe('HelpHintUIC', () => {
  it('renders inline hint on touch devices', () => {
    mockMatchMedia(false)

    const wrapper = mount(HelpHintUIC, {
      props: {
        text: 'Execute block on the selected hardfork',
        tier: 'useful',
      },
      slots: {
        default: '<button type="button">Run block</button>',
      },
    })

    expect(wrapper.find('.help-hint-inline').text()).toContain('Execute block')
    expect(wrapper.find('.help-hint-popover-trigger').exists()).toBe(false)
  })

  it('renders popover trigger on touch when touchFallback is popover', () => {
    mockMatchMedia(false)

    const wrapper = mount(HelpHintUIC, {
      props: {
        text: 'Upcoming hardfork timeline entry',
        tier: 'useful',
        touchFallback: 'popover',
      },
      slots: {
        default: '<button type="button">Glamsterdam</button>',
      },
    })

    expect(wrapper.find('.help-hint-popover-trigger').exists()).toBe(true)
    expect(wrapper.find('.help-hint-inline').exists()).toBe(false)
  })

  it('omits decorative hints on touch', () => {
    mockMatchMedia(false)

    const wrapper = mount(HelpHintUIC, {
      props: {
        text: 'Open shareable URL',
        tier: 'decorative',
      },
      slots: {
        default: '<button type="button" aria-label="Share">Share</button>',
      },
    })

    expect(wrapper.find('.help-hint-inline').exists()).toBe(false)
    expect(wrapper.find('.help-hint-popover-trigger').exists()).toBe(false)
    expect(wrapper.text()).toContain('Share')
  })
})
