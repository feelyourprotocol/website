import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import PromptList from '../PromptList.vue'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('PromptList', () => {
  it('renders intro, group labels, and every prompt', () => {
    const wrapper = mount(PromptList, {
      props: {
        intro: 'Try these.',
        groups: [
          { label: 'Start here', prompts: [{ text: 'Send 1 wei on Amsterdam.' }] },
          { label: 'Compare', prompts: [{ text: 'Fusaka vs Amsterdam.', fork: 'Fusaka vs Amsterdam' }] },
        ],
      },
    })

    expect(wrapper.get('[data-testid="prompt-list"]').text()).toContain('Try these.')
    expect(wrapper.text()).toContain('Start here')
    expect(wrapper.text()).toContain('Send 1 wei on Amsterdam.')
    expect(wrapper.findAll('[data-testid="prompt-card"]')).toHaveLength(2)
    expect(wrapper.find('.fyp-chip--fork').text()).toBe('Fusaka vs Amsterdam')
  })

  it('shows look-for hint, tool link, and related page link when given', () => {
    const wrapper = mount(PromptList, {
      props: {
        groups: [
          {
            label: 'Start here',
            prompts: [
              {
                text: 'Prompt.',
                lookFor: 'about 21,000 vs 204,600',
                tool: 'run_transaction',
                toolHref: '/use/tools/run-transaction',
                href: '/use/eips/eip-8037',
                hrefLabel: 'EIP-8037',
              },
            ],
          },
        ],
      },
    })

    expect(wrapper.text()).toContain('about 21,000 vs 204,600')
    expect(wrapper.get('a[href="/use/tools/run-transaction"]').text()).toBe('run_transaction')
    expect(wrapper.get('a[href="/use/eips/eip-8037"]').text()).toContain('EIP-8037')
  })

  it('renders without groups (empty list does not crash)', () => {
    const wrapper = mount(PromptList, { props: { groups: [] } })
    expect(wrapper.findAll('[data-testid="prompt-card"]')).toHaveLength(0)
  })

  it('copy button writes the prompt text and shows feedback', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    const wrapper = mount(PromptList, {
      props: { groups: [{ label: 'Start here', prompts: [{ text: 'Copy me.' }] }] },
    })

    const button = wrapper.get('[data-testid="copy-button"]')
    expect(button.text()).toBe('Copy')
    await button.trigger('click')
    expect(writeText).toHaveBeenCalledWith('Copy me.')
    expect(button.text()).toBe('Copied')
  })

  it('stays usable when the clipboard API rejects', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    const wrapper = mount(PromptList, {
      props: { groups: [{ label: 'Start here', prompts: [{ text: 'Nope.' }] }] },
    })

    const button = wrapper.get('[data-testid="copy-button"]')
    await button.trigger('click')
    expect(button.text()).toBe('Copy')
  })
})
