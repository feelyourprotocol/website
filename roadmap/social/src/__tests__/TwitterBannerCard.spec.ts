import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import TwitterBannerCard from '../components/TwitterBannerCard.vue'

describe('TwitterBannerCard', () => {
  it('renders brand copy inside the capture target', () => {
    const wrapper = mount(TwitterBannerCard)

    expect(wrapper.find('[data-social-card="twitter-banner"]').exists()).toBe(true)
    expect(wrapper.find('.fyp-twitter-banner__headline').text()).toBe('Hands on.')
    expect(wrapper.find('.fyp-twitter-banner__eyebrow').text()).toContain('Interactive EIP')
    expect(wrapper.find('.fyp-twitter-banner__cover').exists()).toBe(true)
    expect(wrapper.findAll('.fyp-twitter-banner__cover')).toHaveLength(3)
  })
})
