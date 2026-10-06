import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import EipHeader from '../EipHeader.vue'

describe('EipHeader', () => {
  it('renders number, title, status, tool links, and the exploration link', () => {
    const wrapper = mount(EipHeader, {
      props: {
        number: 8037,
        title: 'State creation gas',
        status: 'Runnable',
        fork: 'Amsterdam (Glamsterdam)',
        tools: ['run_transaction', 'run_bytecode'],
        launchNote: 'At public launch: runnable.',
        explorationHref: 'https://feelyourprotocol.org/eip-8037-state-creation-gas',
      },
    })

    const text = wrapper.get('[data-testid="eip-header"]').text()
    expect(text).toContain('EIP-8037')
    expect(text).toContain('State creation gas')
    expect(text).toContain('Runnable')
    expect(text).toContain('At public launch: runnable.')
    expect(wrapper.get('a[href="/use/tools/run-transaction"]').text()).toBe('run_transaction')
    expect(wrapper.get('a[href="/use/tools/run-bytecode"]').exists()).toBe(true)
    const twin = wrapper.get('a[href^="https://feelyourprotocol.org"]')
    expect(twin.attributes('target')).toBe('_blank')
    expect(twin.attributes('rel')).toContain('noopener')
  })

  it('renders an unknown tool as a plain chip instead of a broken link', () => {
    const wrapper = mount(EipHeader, {
      props: { number: '9999', title: 'Future', tools: ['not_a_tool'] },
    })
    const chip = wrapper.get('.fyp-chip--tool')
    expect(chip.element.tagName).toBe('SPAN')
    expect(chip.attributes('href')).toBeUndefined()
  })
})
