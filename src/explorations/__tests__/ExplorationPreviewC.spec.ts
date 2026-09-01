import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { mount } from '@vue/test-utils'

import ExplorationPreviewC from '@/explorations/ExplorationPreviewC.vue'
import { EXPLORATIONS } from '@/explorations/REGISTRY'
import { TOPICS } from '@/explorations/TOPICS'
import { mcpDocsEipPage } from '@/libs/roadmapUrls'

function mountPreview(explorationId: string, extraProps: Record<string, unknown> = {}) {
  const exploration = EXPLORATIONS[explorationId]!
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/all', name: 'all', component: { template: '<div />' } },
      { path: '/ux', name: 'ux', component: { template: '<div />' } },
      { path: '/robustness', name: 'robustness', component: { template: '<div />' } },
    ],
  })

  return mount(ExplorationPreviewC, {
    props: {
      explorationId,
      exploration,
      topic: TOPICS[exploration.topic],
      ...extraProps,
    },
    global: {
      plugins: [router],
    },
  })
}

describe('ExplorationPreviewC', () => {
  it('renders title, core question, topic and timeline pills', () => {
    const exploration = EXPLORATIONS['eip-7708']!
    const wrapper = mountPreview('eip-7708', { size: 'featured' })

    expect(wrapper.text()).toContain(exploration.title)
    expect(wrapper.text()).toContain(exploration.coreQuestion)
    expect(wrapper.text()).toContain('UX')
    expect(wrapper.text()).toContain('Glamsterdam')
    expect(wrapper.text()).toContain('MCP')
    expect(wrapper.text()).not.toContain('MCP Planned')
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('links topic and timeline pills to topic hub and Browse timeline filter', () => {
    const wrapper = mountPreview('eip-7708')

    const topic = wrapper.get('[data-testid="preview-pill-topic"]')
    expect(topic.attributes('href')).toBe('/ux')

    const timeline = wrapper.get('[data-testid="preview-pill-timeline"]')
    expect(timeline.attributes('href')).toBe('/all?timeline=glamsterdam')
  })

  it('links MCP pill to the per-EIP docs page in a new tab', () => {
    const wrapper = mountPreview('eip-7708')

    const mcp = wrapper.get('[data-testid="preview-pill-mcp"]')
    expect(mcp.text()).toBe('MCP')
    expect(mcp.attributes('href')).toBe(mcpDocsEipPage('eip-7708'))
    expect(mcp.attributes('target')).toBe('_blank')
  })

  it('omits MCP pill when docs status is sunset', () => {
    const wrapper = mountPreview('eip-7594')
    expect(wrapper.find('[data-testid="preview-pill-mcp"]').exists()).toBe(false)
  })

  it('stays usable without a cover image', () => {
    const base = EXPLORATIONS['eip-7708']!
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/ux', component: { template: '<div />' } }],
    })
    const wrapper = mount(ExplorationPreviewC, {
      props: {
        explorationId: 'eip-7708',
        exploration: { ...base, image: undefined, imageSmall: undefined },
        topic: TOPICS[base.topic],
      },
      global: { plugins: [router] },
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain(base.coreQuestion)
  })

  it('external spec link does not use the exploration route', () => {
    const exploration = EXPLORATIONS['eip-7708']!
    const wrapper = mountPreview('eip-7708')

    const link = wrapper.find('a.visit-exploration-button')
    expect(link.attributes('href')).toBe(exploration.infoURL)
    expect(link.attributes('target')).toBe('_blank')
  })
})
