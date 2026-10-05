import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import IconGrid from '../IconGrid.vue'
import Motto from '../Motto.vue'

describe('IconGrid', () => {
  it('renders titles, details, and an external link', () => {
    const wrapper = mount(IconGrid, {
      props: {
        items: [
          { icon: 'book', title: 'Textbook', detail: 'Learn the change.' },
          {
            icon: 'terminal',
            title: 'Server',
            detail: 'Run the change.',
            href: 'https://mcp-docs.feelyourprotocol.org',
          },
        ],
      },
    })

    expect(wrapper.findAll('.fyp-icon-card')).toHaveLength(2)
    expect(wrapper.text()).toContain('Textbook')
    expect(wrapper.text()).toContain('Learn the change.')
    const link = wrapper.get('a.fyp-icon-card')
    expect(link.attributes('href')).toBe('https://mcp-docs.feelyourprotocol.org')
    expect(link.attributes('target')).toBe('_blank')
    expect(wrapper.find('.fyp-icon-card__glyph').exists()).toBe(true)
  })

  it('keeps an internal link in the same tab', () => {
    const wrapper = mount(IconGrid, {
      props: {
        items: [{ icon: 'calendar', title: 'Launch week', detail: 'When.', href: '/roadmap/launch' }],
      },
    })

    const link = wrapper.get('a')
    expect(link.attributes('href')).toBe('/roadmap/launch')
    expect(link.attributes('target')).toBeUndefined()
  })

  it('renders a card when the icon id is unknown', () => {
    const wrapper = mount(IconGrid, {
      props: {
        items: [{ icon: 'missing' as 'book', title: 'Still here', detail: 'No glyph.' }],
      },
    })

    expect(wrapper.text()).toContain('Still here')
    expect(wrapper.find('.fyp-icon-card__glyph').exists()).toBe(false)
  })

  it('marks a three-column grid', () => {
    const wrapper = mount(IconGrid, {
      props: {
        columns: 3,
        items: [
          { icon: 'inbox', title: 'Bring', detail: 'Accounts.' },
          { icon: 'trace', title: 'Receive', detail: 'A trace.' },
          { icon: 'boundary', title: 'Outside', detail: 'Not an archive.' },
        ],
      },
    })

    expect(wrapper.get('[data-testid="icon-grid"]').classes()).toContain('fyp-icon-grid--three')
  })
})

describe('Motto', () => {
  it('renders the quote', () => {
    const wrapper = mount(Motto, { slots: { default: 'Deterministic truth.' } })
    expect(wrapper.get('[data-testid="motto"]').text()).toBe('Deterministic truth.')
  })
})
