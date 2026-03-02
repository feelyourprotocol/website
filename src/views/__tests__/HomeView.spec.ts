import { describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'

import { EXPLORATIONS } from '@/explorations/REGISTRY'
import { TOPICS } from '@/explorations/TOPICS'

import HomeView from '../HomeView.vue'

const wrapper = mount(HomeView, {
  global: {
    stubs: { RouterLink: RouterLinkStub },
  },
})

describe('HomeView', () => {
  describe('Topics', () => {
    it('renders a topic card for each topic', () => {
      for (const topic of Object.values(TOPICS)) {
        expect(wrapper.text()).toContain(topic.title)
      }
    })

    it('topic cards link to correct paths', () => {
      const links = wrapper.findAllComponents(RouterLinkStub)
      for (const topic of Object.values(TOPICS)) {
        expect(links.some((l) => l.props('to') === topic.path)).toBe(true)
      }
    })

    it('renders topic images', () => {
      const topicColumn = wrapper.find('main > div > div:first-child')
      expect(topicColumn.findAll('img').length).toBeGreaterThanOrEqual(1)
    })

    it('shows topic intro text', () => {
      for (const topic of Object.values(TOPICS)) {
        if (topic.introText) {
          expect(wrapper.text()).toContain(topic.introText)
        }
      }
    })
  })

  describe('About section', () => {
    it('renders project description', () => {
      expect(wrapper.text()).toContain('About the Project')
      expect(wrapper.text()).toContain('Feel Your Protocol is a collaborative open-source project')
    })

    it('has contributor docs link pointing to docs site', () => {
      const link = wrapper.find('a[href="https://docs.feelyourprotocol.org"]')
      expect(link.exists()).toBe(true)
      expect(link.attributes('target')).toBe('_blank')
    })

    it('has GitHub link pointing to repo', () => {
      const link = wrapper.find('a[href="https://github.com/feelyourprotocol/website"]')
      expect(link.exists()).toBe(true)
      expect(link.attributes('target')).toBe('_blank')
    })
  })

  describe('Featured explorations', () => {
    const featured = ['eip-7883', 'eip-7594', 'eip-7951']

    it('shows "Latest" label', () => {
      expect(wrapper.text()).toContain('Latest')
    })

    it('renders three featured exploration cards', () => {
      expect(wrapper.findAll('.exploration-c')).toHaveLength(3)
    })

    it('cards display exploration titles', () => {
      const titles = wrapper.findAll('.exploration-c').map((c) => c.find('h3').text())
      for (const id of featured) {
        expect(titles).toContainEqual(EXPLORATIONS[id].title)
      }
    })

    it('cards link to correct exploration paths', () => {
      const links = wrapper.findAllComponents(RouterLinkStub)
      for (const id of featured) {
        expect(links.some((l) => l.props('to') === EXPLORATIONS[id].path)).toBe(true)
      }
    })
  })
})
