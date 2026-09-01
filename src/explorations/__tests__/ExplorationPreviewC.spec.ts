import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import ExplorationPreviewC from '@/explorations/ExplorationPreviewC.vue'
import { EXPLORATIONS } from '@/explorations/REGISTRY'
import { TOPICS } from '@/explorations/TOPICS'

describe('ExplorationPreviewC', () => {
  it('renders title, core question, topic and timeline pills', () => {
    const exploration = EXPLORATIONS['eip-7708']!
    const wrapper = mount(ExplorationPreviewC, {
      props: {
        explorationId: 'eip-7708',
        exploration,
        topic: TOPICS[exploration.topic],
        size: 'featured',
      },
    })

    expect(wrapper.text()).toContain(exploration.title)
    expect(wrapper.text()).toContain(exploration.coreQuestion)
    expect(wrapper.text()).toContain('UX')
    expect(wrapper.text()).toContain('Glamsterdam')
    expect(wrapper.text()).toContain('MCP Planned')
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('stays usable without a cover image', () => {
    const base = EXPLORATIONS['eip-7708']!
    const wrapper = mount(ExplorationPreviewC, {
      props: {
        explorationId: 'eip-7708',
        exploration: { ...base, image: undefined, imageSmall: undefined },
        topic: TOPICS[base.topic],
      },
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain(base.coreQuestion)
  })

  it('external spec link does not use the exploration route', () => {
    const exploration = EXPLORATIONS['eip-7708']!
    const wrapper = mount(ExplorationPreviewC, {
      props: {
        explorationId: 'eip-7708',
        exploration,
        topic: TOPICS[exploration.topic],
      },
    })

    const link = wrapper.find('a.visit-exploration-button')
    expect(link.attributes('href')).toBe(exploration.infoURL)
    expect(link.attributes('target')).toBe('_blank')
  })
})
