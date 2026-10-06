import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import LaunchedBanner from '../../../../../shared/vitepress/LaunchedBanner.vue'

describe('LaunchedBanner', () => {
  it('announces the open server and links the two entry points', () => {
    const wrapper = mount(LaunchedBanner, {
      props: {
        kicker: '6 October 2026',
        headline: 'The MCP server has launched.',
        lede: 'Ask your agent to run Amsterdam.',
        primaryHref: '/use/connect.html',
        primaryLabel: 'Connect',
        secondaryHref: '/use/capabilities.html',
        secondaryLabel: 'Try a question',
      },
    })

    expect(wrapper.get('[data-mcp-launched]').attributes('aria-label')).toBe(
      'The MCP server has launched.',
    )
    expect(wrapper.text()).toContain('Live')
    expect(wrapper.text()).toContain('6 October 2026')
    expect(wrapper.get('a[href="/use/connect.html"]').text()).toBe('Connect')
    expect(wrapper.get('a[href="/use/capabilities.html"]').attributes('target')).toBeUndefined()
  })

  it('opens an external entry point in a new tab', () => {
    const wrapper = mount(LaunchedBanner, {
      props: {
        kicker: '6 October 2026',
        headline: 'The MCP server has launched.',
        lede: 'Connect.',
        primaryHref: 'https://mcp-docs.feelyourprotocol.org/use/connect.html',
        primaryLabel: 'Connect an agent',
        secondaryHref: '/roadmap/launch.html',
        secondaryLabel: 'What opened',
        primaryExternal: true,
      },
    })

    const primary = wrapper.get('a[href^="https://mcp-docs"]')
    expect(primary.attributes('target')).toBe('_blank')
    expect(primary.attributes('rel')).toContain('noopener')
  })
})
