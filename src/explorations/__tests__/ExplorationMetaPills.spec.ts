import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { mount } from '@vue/test-utils'

import ExplorationMetaPills from '@/explorations/ExplorationMetaPills.vue'
import { EXPLORATIONS } from '@/explorations/REGISTRY'
import { TOPICS } from '@/explorations/TOPICS'
import { mcpDocsEipPage } from '@/libs/roadmapUrls'

function mountPills(explorationId: string, extra: { stopPropagation?: boolean } = {}) {
  const exploration = EXPLORATIONS[explorationId]!
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/all', name: 'all', component: { template: '<div />' } },
      { path: '/ux', name: 'ux', component: { template: '<div />' } },
      { path: '/robustness', name: 'robustness', component: { template: '<div />' } },
    ],
  })

  return mount(ExplorationMetaPills, {
    props: {
      explorationId,
      exploration,
      topic: TOPICS[exploration.topic],
      ...extra,
    },
    global: { plugins: [router] },
  })
}

describe('ExplorationMetaPills', () => {
  it('links topic and timeline pills to topic hub and Browse timeline filter', () => {
    const wrapper = mountPills('eip-7708')

    expect(wrapper.get('[data-testid="preview-pill-topic"]').attributes('href')).toBe('/ux')
    expect(wrapper.get('[data-testid="preview-pill-timeline"]').attributes('href')).toBe(
      '/all?timeline=glamsterdam',
    )
  })

  it('links MCP pill to the per-EIP docs page in a new tab', () => {
    const wrapper = mountPills('eip-7708')

    const mcp = wrapper.get('[data-testid="preview-pill-mcp"]')
    expect(mcp.text()).toBe('MCP')
    expect(mcp.attributes('href')).toBe(mcpDocsEipPage('eip-7708'))
    expect(mcp.attributes('target')).toBe('_blank')
  })

  it('omits MCP pill when docs status is sunset', () => {
    const base = EXPLORATIONS['eip-7708']!
    const exploration = { ...base, mcpDocsStatus: 'sunset' as const }
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/ux', name: 'ux', component: { template: '<div />' } }],
    })
    const wrapper = mount(ExplorationMetaPills, {
      props: {
        explorationId: 'eip-7708',
        exploration,
        topic: TOPICS[exploration.topic],
      },
      global: { plugins: [router] },
    })
    expect(wrapper.find('[data-testid="preview-pill-mcp"]').exists()).toBe(false)
  })

  it('stops propagation when stopPropagation is set (preview inside RouterLink)', async () => {
    const exploration = EXPLORATIONS['eip-7708']!
    const topic = TOPICS[exploration.topic]
    const parentClick = vi.fn()
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/ux', component: { template: '<div />' } }],
    })

    const Host = defineComponent({
      components: { ExplorationMetaPills },
      setup: () => ({ exploration, topic, parentClick }),
      template: `
        <div @click="parentClick">
          <ExplorationMetaPills
            exploration-id="eip-7708"
            :exploration="exploration"
            :topic="topic"
            stop-propagation
          />
        </div>
      `,
    })

    const wrapper = mount(Host, { global: { plugins: [router] } })
    await wrapper.get('[data-testid="preview-pill-topic"]').trigger('click')
    expect(parentClick).not.toHaveBeenCalled()
  })
})
