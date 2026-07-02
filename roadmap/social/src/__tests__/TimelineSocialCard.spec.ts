import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import { TIMELINE_PHASES } from '../../../data/timeline.ts'
import { SOCIAL_CARDS } from '../cards.ts'
import TimelineSocialCard from '../components/TimelineSocialCard.vue'

describe('TimelineSocialCard', () => {
  it('renders banner with phase chips and timeline body', () => {
    const wrapper = mount(TimelineSocialCard)

    expect(wrapper.find('[data-social-card="timeline"]').exists()).toBe(true)
    expect(wrapper.text()).toContain(SOCIAL_CARDS.timeline.title)
    expect(wrapper.text()).toContain(SOCIAL_CARDS.timeline.subtitle)
    expect(wrapper.findAll('.fyp-social-timeline__phase')).toHaveLength(TIMELINE_PHASES.length)
    expect(wrapper.find('.fyp-timeline').exists()).toBe(true)
    expect(wrapper.text()).toContain('reached')
    expect(wrapper.text()).toContain('upcoming target')
  })

  it('includes gradient glow layers', () => {
    const wrapper = mount(TimelineSocialCard)
    expect(wrapper.findAll('.fyp-social-banner__glow')).toHaveLength(2)
  })
})
