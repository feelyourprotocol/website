import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import { TOPICS } from '@/explorations/TOPICS'

import BalExplorerPanel from './BalExplorerPanel.vue'

const topic = TOPICS.scaling

describe('BalExplorerPanel', () => {
  it('renders idle shell before a run with reserved explorer height', () => {
    const wrapper = mount(BalExplorerPanel, {
      props: {
        topic,
        groups: [],
        activePath: null,
        hasResult: false,
      },
    })

    expect(wrapper.find('[data-testid="bal-explorer-panel"]').attributes('data-has-result')).toBe(
      'false',
    )
    expect(wrapper.text()).toContain('Waiting for block execution')
    expect(wrapper.find('.min-h-\\[24rem\\]').exists()).toBe(true)
  })
})
