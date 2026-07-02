import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import { ROADMAP_HORIZONS, ROADMAP_TRACKS } from '../../../data/roadmap.ts'
import { SOCIAL_CARDS } from '../cards.ts'
import BoardSocialCard from '../components/BoardSocialCard.vue'

describe('BoardSocialCard', () => {
  it('renders banner with horizon and track chips plus board body', () => {
    const wrapper = mount(BoardSocialCard)

    expect(wrapper.find('[data-social-card="board"]').exists()).toBe(true)
    expect(wrapper.text()).toContain(SOCIAL_CARDS.board.title)
    expect(wrapper.text()).toContain(SOCIAL_CARDS.board.subtitle)
    expect(wrapper.findAll('.fyp-social-board__horizon')).toHaveLength(ROADMAP_HORIZONS.length)
    expect(wrapper.findAll('.fyp-social-board__track')).toHaveLength(ROADMAP_TRACKS.length)
    expect(wrapper.find('.fyp-roadmap').exists()).toBe(true)
    expect(wrapper.text()).toContain('In progress')
    expect(wrapper.text()).toContain('Planned')
  })

  it('includes gradient glow layers', () => {
    const wrapper = mount(BoardSocialCard)
    expect(wrapper.findAll('.fyp-social-banner__glow')).toHaveLength(2)
  })
})
