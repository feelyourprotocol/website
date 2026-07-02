import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import SocialCard from '../components/SocialCard.vue'

describe('SocialCard', () => {
  it('renders frame with data-social-card id', () => {
    const wrapper = mount(SocialCard, {
      props: {
        cardId: 'timeline',
        eyebrow: 'Phase 3 · Timeline',
        title: 'Test title',
        subtitle: 'Test subtitle',
        footerHint: 'Hint',
      },
      slots: { default: '<p class="slot-content">Body</p>' },
    })

    expect(wrapper.find('[data-social-card="timeline"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test title')
    expect(wrapper.text()).toContain('Test subtitle')
    expect(wrapper.text()).toContain('roadmap.feelyourprotocol.org')
    expect(wrapper.text()).toContain('Hint')
    expect(wrapper.find('.slot-content').exists()).toBe(true)
  })
})
