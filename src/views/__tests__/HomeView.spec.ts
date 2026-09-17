import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { mount, RouterLinkStub } from '@vue/test-utils'

import { EXPLORATIONS } from '@/explorations/REGISTRY'
import { Tag } from '@/explorations/TAGS'
import { TOPICS } from '@/explorations/TOPICS'
import { COMMUNITY_TOKEN_HOME } from '@/libs/communityToken'
import { WEBSITE_DOCS_HOME } from '@/libs/docsUrls'
import { MCP_DOCS_HOME, mcpDocsPage, ROADMAP_LAUNCH } from '@/libs/roadmapUrls'

import {
  catalogExplorationIds,
  FEATURED_EXPLORATION_IDS,
  latestExplorationIds,
} from '../homeCatalog'
import HomeView from '../HomeView.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/all', name: 'all', component: { template: '<div />' } },
  ],
})

const wrapper = mount(HomeView, {
  global: {
    plugins: [router],
    stubs: { RouterLink: RouterLinkStub },
  },
})

const latest = latestExplorationIds()
const catalog = catalogExplorationIds()

describe('HomeView', () => {
  describe('Orient', () => {
    it('states the project in one sentence', () => {
      expect(wrapper.text()).toContain('Run upcoming Ethereum protocol changes in the browser')
    })

    it('renders the home intro promise panel', () => {
      expect(wrapper.find('[data-testid="home-intro-panel"]').exists()).toBe(true)
    })

    it('renders the terminal run surface with prompt', () => {
      const panel = wrapper.get('[data-testid="home-intro-panel"]')
      expect(panel.classes()).toContain('fyp-run-surface')
      expect(panel.text()).toContain('fyp:~$')
    })

    it('offers play and agent doors', () => {
      const play = wrapper.find('[data-testid="home-intro-panel"] a[href="#latest"]')
      expect(play.exists()).toBe(true)
      expect(play.classes()).toContain('from-purple-600')
      expect(play.text()).toContain('Play an exploration')
      const agents = wrapper.find(
        `[data-testid="home-intro-panel"] a[href="${mcpDocsPage('use/coverage')}"]`,
      )
      expect(agents.exists()).toBe(true)
      expect(agents.text()).toContain('For agents')
    })

    it('applies protocol pulse spark to “in the browser” in the lead sentence', () => {
      const spark = wrapper.find('[data-testid="home-intro-panel"] .home-intro-spark')
      expect(spark.exists()).toBe(true)
      expect(spark.text()).toBe('in the browser')
    })

    it('shows live catalog stats', () => {
      const panel = wrapper.get('[data-testid="home-intro-panel"]')
      expect(panel.text()).toContain(`${Object.keys(EXPLORATIONS).length} explorations`)
      expect(panel.text()).toContain('Fusaka')
      expect(panel.text()).toContain('Glamsterdam')
    })
  })

  describe('Latest', () => {
    it('shows Latest label and featured cards', () => {
      expect(wrapper.text()).toContain('Latest')
      expect(wrapper.findAll('#latest .exploration-preview-c')).toHaveLength(latest.length)
    })

    it('cards display titles and core questions', () => {
      for (const id of latest) {
        expect(wrapper.text()).toContain(EXPLORATIONS[id].title)
        expect(wrapper.text()).toContain(EXPLORATIONS[id].coreQuestion)
      }
    })

    it('cards link to exploration paths', () => {
      const links = wrapper.findAllComponents(RouterLinkStub)
      for (const id of latest) {
        expect(links.some((l) => l.props('to') === EXPLORATIONS[id].path)).toBe(true)
      }
    })

    it('external info link on latest cards points to EIP spec', () => {
      for (const id of latest) {
        const link = wrapper.find(
          `#${id}-c a.visit-exploration-button[href="${EXPLORATIONS[id].infoURL}"]`,
        )
        expect(link.exists()).toBe(true)
        expect(link.attributes('target')).toBe('_blank')
      }
    })
  })

  describe('Catalog', () => {
    it('lists remaining explorations and a See all link', () => {
      const seeAll = wrapper
        .findAllComponents(RouterLinkStub)
        .filter((l) => l.props('to') === '/all')
      expect(seeAll.length).toBeGreaterThanOrEqual(1)
      for (const id of catalog) {
        expect(wrapper.text()).toContain(EXPLORATIONS[id].title)
      }
    })
  })

  describe('Topics', () => {
    const navTopicEntries = Object.entries(TOPICS).filter(
      ([, topic]) => topic.explorations.length > 0,
    )
    const emptyTopicEntries = Object.entries(TOPICS).filter(
      ([, topic]) => topic.explorations.length === 0,
    )

    it('renders tiles only for topic hubs with live explorations', () => {
      for (const [, topic] of navTopicEntries) {
        expect(wrapper.text()).toContain(topic.title)
      }
      for (const [topicId, topic] of emptyTopicEntries) {
        expect(wrapper.text()).not.toContain(topic.title)
        expect(wrapper.find(`[data-topic-id="${topicId}"]`).exists()).toBe(false)
      }
    })

    it('topic tiles link to topic paths for nav hubs only', () => {
      const links = wrapper.findAllComponents(RouterLinkStub)
      for (const [, topic] of navTopicEntries) {
        expect(links.some((l) => l.props('to') === topic.path)).toBe(true)
      }
      for (const [, topic] of emptyTopicEntries) {
        expect(links.some((l) => l.props('to') === topic.path)).toBe(false)
      }
    })

    it('does not dump topic intro essays on home', () => {
      const scaling = TOPICS.scaling
      expect(wrapper.text()).not.toContain(scaling.introText)
    })
  })

  describe('Fleet', () => {
    it('links website docs, MCP docs, roadmap launch, and community token', () => {
      expect(wrapper.find(`a[href="${WEBSITE_DOCS_HOME}"]`).exists()).toBe(true)
      expect(wrapper.find(`a[href="${MCP_DOCS_HOME}"]`).exists()).toBe(true)
      expect(wrapper.find(`a[href="${ROADMAP_LAUNCH}"]`).exists()).toBe(true)
      expect(wrapper.find(`a[href="${COMMUNITY_TOKEN_HOME}"]`).exists()).toBe(true)
    })
  })

  describe('MCP launch section', () => {
    it('renders launch week banner above latest', () => {
      expect(wrapper.find('[data-mcp-launch-week]').exists()).toBe(true)
      expect(wrapper.text()).toContain('5–9 October 2026')
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
      const unusedTags = Object.values(Tag).filter((tag) => !usedTags.has(tag))
      const tagLabels = wrapper.findAll('.tag-item').map((b) => b.text())
      for (const tag of unusedTags) {
        expect(tagLabels).not.toContainEqual(tag)
      }
    })
  })

  it('keeps featured order in sync with homeCatalog', () => {
    expect(FEATURED_EXPLORATION_IDS[0]).toBe('eip-8038')
  })
})
