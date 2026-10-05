import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import IconNote from '../IconNote.vue'

describe('IconNote', () => {
  it('renders a title, the note, and a glyph', () => {
    const wrapper = mount(IconNote, {
      props: { icon: 'book', title: 'Learning is the front door' },
      slots: { default: 'People arrive to understand a change.' },
    })

    expect(wrapper.get('[data-testid="icon-note"]').text()).toContain('Learning is the front door')
    expect(wrapper.text()).toContain('People arrive to understand a change.')
    expect(wrapper.find('.fyp-icon-note__glyph').exists()).toBe(true)
  })

  it('still shows the note when the icon id is unknown', () => {
    const wrapper = mount(IconNote, {
      props: { icon: 'missing', title: 'Still here' },
      slots: { default: 'No glyph.' },
    })

    expect(wrapper.text()).toContain('Still here')
    expect(wrapper.text()).toContain('No glyph.')
    expect(wrapper.find('.fyp-icon-note__glyph').exists()).toBe(false)
  })
})
