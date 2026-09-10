import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import YouTubeBannerCard from '../components/YouTubeBannerCard.vue'

describe('YouTubeBannerCard', () => {
  it('renders brand copy inside the capture target', () => {
    const wrapper = mount(YouTubeBannerCard)

    expect(wrapper.find('[data-social-card="youtube-banner"]').exists()).toBe(true)
    expect(wrapper.find('.fyp-youtube-banner__name').text()).toBe('Feel Your Protocol')
    expect(wrapper.find('.fyp-youtube-banner__tagline').text()).toContain('Ethereum Protocol Explorations')
    expect(wrapper.find('.fyp-youtube-banner__preview').exists()).toBe(true)
  })
})
