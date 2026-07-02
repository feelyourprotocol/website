import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import { HERO_FEATURES } from '../heroFeatures.ts'
import HeroSocialCard from '../components/HeroSocialCard.vue'
import { SOCIAL_CARDS } from '../cards.ts'

describe('HeroSocialCard', () => {
  it('renders docs-style hero with capture id and feature tiles', () => {
    const wrapper = mount(HeroSocialCard)

    expect(wrapper.find('[data-social-card="hero"]').exists()).toBe(true)
    expect(wrapper.find('.fyp-social-hero__name').text()).toBe('Feel Your Protocol')
    expect(wrapper.text()).toContain(SOCIAL_CARDS.hero.title)
    expect(wrapper.text()).toContain(SOCIAL_CARDS.hero.subtitle)
    expect(wrapper.text()).toContain('Deterministic truth for probabilistic machines.')
    expect(wrapper.findAll('.fyp-social-hero__feature')).toHaveLength(HERO_FEATURES.length)
    expect(wrapper.text()).toContain('roadmap.feelyourprotocol.org')
  })

  it('includes gradient glow layers for visual depth', () => {
    const wrapper = mount(HeroSocialCard)
    expect(wrapper.findAll('.fyp-social-banner__glow')).toHaveLength(2)
  })
})
