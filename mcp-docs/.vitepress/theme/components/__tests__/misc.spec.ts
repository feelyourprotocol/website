import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import CollapsibleChangelog from '../CollapsibleChangelog.vue'
import DoorStrip from '../DoorStrip.vue'
import IconGrid from '../IconGrid.vue'
import SpecTable from '../SpecTable.vue'
import Steps from '../Steps.vue'

describe('SpecTable', () => {
  it('renders linked and plain rows; external links open safely', () => {
    const wrapper = mount(SpecTable, {
      props: {
        rows: [
          { label: 'Canonical spec', href: 'https://github.com/ethereum/EIPs', text: 'EIP on GitHub' },
          { label: 'Spec date', text: '2026-07-31' },
          { label: 'Coverage index', href: '/use/coverage', text: 'EIP catalogue' },
        ],
      },
    })
    const links = wrapper.findAll('a')
    expect(links[0].attributes('target')).toBe('_blank')
    expect(links[1].attributes('target')).toBeUndefined()
    expect(wrapper.text()).toContain('2026-07-31')
  })
})

describe('Steps', () => {
  it('numbers steps and links titles when href is set', () => {
    const wrapper = mount(Steps, {
      props: {
        steps: [
          { title: 'Discover', href: '/use/tools/describe-capabilities', detail: 'Probe.' },
          { title: 'Run' },
        ],
      },
    })
    expect(wrapper.findAll('.fyp-steps__marker').map((n) => n.text())).toEqual(['1', '2'])
    expect(wrapper.findAll('a')).toHaveLength(1)
  })
})

describe('IconGrid', () => {
  it('renders a card for an unknown icon id without a glyph', () => {
    const wrapper = mount(IconGrid, {
      props: { items: [{ icon: 'missing' as 'book', title: 'Still here', detail: 'No glyph.' }] },
    })
    expect(wrapper.text()).toContain('Still here')
    expect(wrapper.find('.fyp-icon-card__glyph').exists()).toBe(false)
  })

  it('links internal cards in the same tab and external ones in a new tab', () => {
    const wrapper = mount(IconGrid, {
      props: {
        items: [
          { icon: 'cube', title: 'Internal', detail: 'x', href: '/use/eips/eip-7954' },
          { icon: 'book', title: 'External', detail: 'y', href: 'https://feelyourprotocol.org' },
        ],
      },
    })
    const links = wrapper.findAll('a')
    expect(links[0].attributes('target')).toBeUndefined()
    expect(links[1].attributes('target')).toBe('_blank')
  })
})

describe('DoorStrip', () => {
  it('renders one link per door', () => {
    const wrapper = mount(DoorStrip, {
      props: { items: [{ title: 'Get started', detail: 'Connect.', href: '/use/introduction' }] },
    })
    expect(wrapper.get('a').attributes('href')).toBe('/use/introduction')
  })
})

describe('CollapsibleChangelog', () => {
  it('is closed by default and lists entries', () => {
    const wrapper = mount(CollapsibleChangelog, {
      props: { entries: [{ version: 'v0.1', summary: 'First.' }] },
    })
    expect(wrapper.get('details').attributes('open')).toBeUndefined()
    expect(wrapper.text()).toContain('First.')
  })
})
