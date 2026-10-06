import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import McpLaunchedRibbon from '../McpLaunchedRibbon.vue'

describe('McpLaunchedRibbon', () => {
  it('announces the open server and links connect and a question', () => {
    const wrapper = mount(McpLaunchedRibbon)

    expect(wrapper.get('[data-mcp-launched-ribbon]').attributes('aria-label')).toBe(
      'The MCP server has launched.',
    )
    expect(wrapper.text()).toContain('Live')
    expect(wrapper.text()).toContain('6 October 2026')
    expect(wrapper.get('a[href*="use/connect"]').text()).toBe('Connect')
    expect(wrapper.get('a[href*="use/capabilities"]').attributes('target')).toBe('_blank')
  })
})
