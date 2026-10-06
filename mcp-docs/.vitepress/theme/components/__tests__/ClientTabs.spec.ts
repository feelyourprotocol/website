import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import {
  CLAUDE_CODE_ADD_COMMAND,
  CODEX_ADD_COMMAND,
  CURSOR_INSTALL_LINK,
  FYP_MCP_URL,
} from '../../mcpConstants'
import ClientTabs from '../ClientTabs.vue'

describe('ClientTabs', () => {
  it('shows Cursor first with the install deeplink', () => {
    const wrapper = mount(ClientTabs)
    expect(wrapper.get('#fyp-panel-cursor').isVisible()).toBe(true)
    expect(wrapper.get('#fyp-panel-claude').isVisible()).toBe(false)
    expect(wrapper.get('a.fyp-install-link').attributes('href')).toBe(CURSOR_INSTALL_LINK)
  })

  it('switches tabs and shows verified commands per client', async () => {
    const wrapper = mount(ClientTabs)

    await wrapper.get('#fyp-tab-claude').trigger('click')
    expect(wrapper.get('#fyp-panel-claude').isVisible()).toBe(true)
    expect(wrapper.get('#fyp-panel-claude').text()).toContain(CLAUDE_CODE_ADD_COMMAND)

    await wrapper.get('#fyp-tab-codex').trigger('click')
    expect(wrapper.get('#fyp-panel-codex').text()).toContain(CODEX_ADD_COMMAND)

    await wrapper.get('#fyp-tab-other').trigger('click')
    expect(wrapper.get('#fyp-panel-other').text()).toContain(FYP_MCP_URL)
  })

  it('never suggests a url entry in claude_desktop_config.json', () => {
    const wrapper = mount(ClientTabs)
    const claude = wrapper.get('#fyp-panel-claude').text()
    expect(claude).toContain('custom connector')
    expect(claude).not.toContain('"type": "http"')
  })
})
