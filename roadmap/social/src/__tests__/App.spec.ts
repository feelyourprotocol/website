import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import App from '../App.vue'
import { SOCIAL_CARD_IDS } from '../cards.ts'

vi.mock('../../.vitepress/theme/components/Timeline.vue', () => ({
  default: { template: '<div data-test="timeline-stub">Timeline</div>' },
}))

vi.mock('../../.vitepress/theme/components/RoadmapBoard.vue', () => ({
  default: { template: '<div data-test="board-stub">Board</div>' },
}))

describe('social App', () => {
  beforeEach(() => {
    vi.stubGlobal('location', { search: '' })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders all cards by default', () => {
    const wrapper = mount(App)
    for (const id of SOCIAL_CARD_IDS) {
      expect(wrapper.find(`[data-social-card="${id}"]`).exists()).toBe(true)
    }
  })

  it('renders only the requested card from ?card=', () => {
    vi.stubGlobal('location', { search: '?card=timeline' })
    const wrapper = mount(App)

    expect(wrapper.find('[data-social-card="timeline"]').exists()).toBe(true)
    expect(wrapper.find('[data-social-card="hero"]').exists()).toBe(false)
    expect(wrapper.find('[data-social-card="launch"]').exists()).toBe(false)
    expect(wrapper.find('[data-social-card="board"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Timeline')
  })

  it('adds capture mode class when ?mode=capture', () => {
    vi.stubGlobal('location', { search: '?card=hero&mode=capture' })
    const wrapper = mount(App)

    expect(wrapper.find('.fyp-social-shell--capture').exists()).toBe(true)
  })
})
