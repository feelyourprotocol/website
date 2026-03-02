import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ImprintView from '../ImprintView.vue'

const wrapper = mount(ImprintView)

describe('ImprintView', () => {
  it('renders contact information', () => {
    expect(wrapper.text()).toContain('CONTACT')
    expect(wrapper.text()).toContain('Holger Drewes')
  })

  it('renders acknowledgements with key libraries', () => {
    expect(wrapper.text()).toContain('ACKNOWLEDGEMENTS')
    expect(wrapper.text()).toContain('EthereumJS')
    expect(wrapper.text()).toContain('Tailwind')
    expect(wrapper.text()).toContain('Midjourney')
  })

  it('renders data privacy section', () => {
    expect(wrapper.text()).toContain('DATA')
    expect(wrapper.text()).toContain('does not collect any personal data')
  })

  it('renders contributions section', () => {
    expect(wrapper.text()).toContain('CONTRIBUTIONS')
    expect(wrapper.text()).toContain('open for contributions on GitHub')
  })
})
