import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import LaunchFacts from '../LaunchFacts.vue'

describe('LaunchFacts', () => {
  it('renders each fact title and detail', () => {
    const wrapper = mount(LaunchFacts, {
      props: {
        facts: [
          { title: 'Open', detail: 'No API key, no payment' },
          { title: 'Glamsterdam', detail: 'The upcoming hardfork' },
          { title: 'Hosted', detail: 'mcp.feelyourprotocol.org' },
        ],
      },
    })

    const items = wrapper.findAll('.fyp-launch-facts__item')
    expect(items).toHaveLength(3)
    expect(wrapper.text()).toContain('Open')
    expect(wrapper.text()).toContain('No API key, no payment')
    expect(wrapper.text()).toContain('mcp.feelyourprotocol.org')
  })

  it('renders an empty strip when there are no facts', () => {
    const wrapper = mount(LaunchFacts, { props: { facts: [] } })
    expect(wrapper.find('[data-testid="launch-facts"]').exists()).toBe(true)
    expect(wrapper.findAll('.fyp-launch-facts__item')).toHaveLength(0)
  })
})
