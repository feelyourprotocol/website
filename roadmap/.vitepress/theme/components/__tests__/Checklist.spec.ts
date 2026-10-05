import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import Checklist from '../Checklist.vue'

describe('Checklist', () => {
  it('renders the label and every item', () => {
    const wrapper = mount(Checklist, {
      props: {
        label: 'Before we call it live',
        items: ['HTTP endpoint reachable', 'Open to connect'],
      },
    })

    expect(wrapper.get('[data-testid="checklist"]').text()).toContain('Before we call it live')
    expect(wrapper.findAll('.fyp-checklist__items li')).toHaveLength(2)
    expect(wrapper.text()).toContain('Open to connect')
    expect(wrapper.find('.fyp-checklist__mark').exists()).toBe(true)
  })

  it('renders an empty list when there are no items', () => {
    const wrapper = mount(Checklist, { props: { label: 'Empty', items: [] } })
    expect(wrapper.find('[data-testid="checklist"]').exists()).toBe(true)
    expect(wrapper.findAll('li')).toHaveLength(0)
  })
})
