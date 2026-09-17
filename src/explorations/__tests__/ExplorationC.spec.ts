import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { mount } from '@vue/test-utils'

import ExplorationC from '@/explorations/ExplorationC.vue'
import { EXPLORATIONS } from '@/explorations/REGISTRY'
import { TOPICS } from '@/explorations/TOPICS'
import { mcpDocsEipPage } from '@/libs/roadmapUrls'

describe('ExplorationC', () => {
  it('renders shared catalog meta pills including MCP when docs are live', () => {
    const exploration = EXPLORATIONS['eip-7708']
    const topic = TOPICS[exploration.topic]
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/ux', component: { template: '<div />' } }],
    })
    const wrapper = mount(ExplorationC, {
      props: {
        explorationId: 'eip-7708',
        exploration,
        topic,
        showUsageInstructions: false,
      },
      global: { plugins: [router] },
    })

    expect(wrapper.find('[data-testid="exploration-meta-pills"]').exists()).toBe(true)
    const mcp = wrapper.get('[data-testid="preview-pill-mcp"]')
    expect(mcp.attributes('href')).toBe(mcpDocsEipPage('eip-7708'))
  })

  it('omits MCP pill on the shell when docs status is sunset', () => {
    const base = EXPLORATIONS['eip-7708']
    const exploration = { ...base, mcpDocsStatus: 'sunset' as const }
    const topic = TOPICS[exploration.topic]
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/ux', component: { template: '<div />' } }],
    })
    const wrapper = mount(ExplorationC, {
      props: {
        explorationId: 'eip-7708',
        exploration,
        topic,
        showUsageInstructions: false,
      },
      global: { plugins: [router] },
    })

    expect(wrapper.find('[data-testid="preview-pill-mcp"]').exists()).toBe(false)
  })

  it('external info link stops click propagation (safe inside RouterLink cards)', async () => {
    const exploration = EXPLORATIONS['eip-8024']
    const topic = TOPICS[exploration.topic]
    const parentClick = vi.fn()

    const Host = defineComponent({
      components: { ExplorationC },
      setup: () => ({ exploration, topic, parentClick }),
      template: `
        <div @click="parentClick">
          <ExplorationC
            exploration-id="eip-8024"
            :exploration="exploration"
            :topic="topic"
            :show-usage-instructions="false"
          />
        </div>
      `,
    })

    const wrapper = mount(Host)
    const infoLink = wrapper.find('a.visit-exploration-button')

    expect(infoLink.attributes('href')).toBe(exploration.infoURL)
    expect(infoLink.attributes('target')).toBe('_blank')

    await infoLink.trigger('click')
    expect(parentClick).not.toHaveBeenCalled()
  })
})
