import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { mount, RouterLinkStub } from '@vue/test-utils'

import { EXPLORATIONS } from '@/explorations/REGISTRY'
import { Tag } from '@/explorations/TAGS'
import { TOPICS } from '@/explorations/TOPICS'
import { COMMUNITY_TOKEN_HOME } from '@/libs/communityToken'
import { DOCS_HOME } from '@/libs/docsUrls'
import { ROADMAP_HOME } from '@/libs/roadmapUrls'

import HomeView from '../HomeView.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', name: 'home', component: HomeView }],
})

const wrapper = mount(HomeView, {
  global: {
    plugins: [router],
    stubs: { RouterLink: RouterLinkStub },
  },
})

const activeTopics = Object.values(TOPICS).filter((t) => t.explorations.length > 0)

describe('HomeView', () => {
  describe('Topics', () => {
    it('renders a topic card for each active topic', () => {
      for (const topic of activeTopics) {
        expect(wrapper.text()).toContain(topic.title)
      }
    })

    it('topic cards link to correct paths', () => {
      const links = wrapper.findAllComponents(RouterLinkStub)
      for (const topic of activeTopics) {
        expect(links.some((l) => l.props('to') === topic.path)).toBe(true)
      }
    })

    it('renders topic images', () => {
      expect(wrapper.findAll('.topic-intro-card img').length).toBeGreaterThanOrEqual(1)
    })

    it('shows topic intro text', () => {
      for (const topic of activeTopics) {
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
      const link = wrapper.find(`a[href="${DOCS_HOME}"]`)
      expect(link.exists()).toBe(true)
      expect(link.attributes('target')).toBe('_blank')
    })

    it('has GitHub link pointing to repo', () => {
      const link = wrapper.find('a[href="https://github.com/feelyourprotocol/website"]')
      expect(link.exists()).toBe(true)
      expect(link.attributes('target')).toBe('_blank')
    })

    it('has community token link in about section', () => {
      const link = wrapper.find(`a[href="${COMMUNITY_TOKEN_HOME}"]`)
      expect(link.exists()).toBe(true)
      expect(link.text()).toBe('How it works')
      expect(link.attributes('target')).toBe('_blank')
    })

    it('has roadmap link in about section', () => {
      const roadmap = wrapper.find(`a[href="${ROADMAP_HOME}"]`)
      expect(roadmap.exists()).toBe(true)
      expect(roadmap.text()).toBe('See the roadmap')
    })
  })

  describe('Tag cloud', () => {
    it('renders tag cloud with tags used by explorations', () => {
      const usedTags = new Set(Object.values(EXPLORATIONS).flatMap((e) => e.tags))
      for (const tag of usedTags) {
        expect(wrapper.text()).toContain(tag)
      }
    })

    it('does not render unused tags in the tag cloud', () => {
      const usedTags = new Set(Object.values(EXPLORATIONS).flatMap((e) => e.tags))
      const allTags = Object.values(Tag)
      const tagLabels = wrapper.findAll('.tag-item').map((b) => b.text())
      for (const tag of allTags) {
        if (!usedTags.has(tag)) {
          expect(tagLabels).not.toContainEqual(tag)
        }
      }
    })
  })

  describe('Ice Cream Week', () => {
    it('renders the ice cream stand above Latest', () => {
      expect(wrapper.text()).toContain('Ice Cream')
      expect(wrapper.find('[data-ice-cream-week]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Buy Ice Cream')
    })

    it('lists Latest after the ice cream section in the DOM', () => {
      const ice = wrapper.find('[data-ice-cream-week]').element
      const latestLabel = wrapper.findAll('span').find((s) => s.text() === 'Latest')
      expect(latestLabel).toBeDefined()
      expect(
        ice.compareDocumentPosition(latestLabel!.element) & Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy()
    })
  })

  describe('Featured explorations', () => {
    const featured = ['eip-7928', 'eip-8024', 'eip-7883', 'eip-7594', 'eip-7951']
    const latest = featured.slice(0, 2)

    it('shows "Latest" label', () => {
      expect(wrapper.text()).toContain('Latest')
    })

    it('renders featured exploration cards', () => {
      expect(wrapper.findAll('.exploration-c')).toHaveLength(latest.length)
    })

    it('cards display exploration titles', () => {
      const titles = wrapper.findAll('.exploration-c').map((c) => c.find('h3').text())
      for (const id of latest) {
        expect(titles).toContainEqual(EXPLORATIONS[id].title)
      }
    })

    it('cards link to correct exploration paths', () => {
      const links = wrapper.findAllComponents(RouterLinkStub)
      for (const id of latest) {
        expect(links.some((l) => l.props('to') === EXPLORATIONS[id].path)).toBe(true)
      }
    })
  })
})
