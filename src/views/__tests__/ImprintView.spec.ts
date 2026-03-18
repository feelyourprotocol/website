import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import ImprintView from '../ImprintView.vue'

const wrapper = mount(ImprintView)

describe('ImprintView', () => {
  it('renders about section with maintainer context', () => {
    expect(wrapper.text()).toContain('ABOUT')
    expect(wrapper.text()).toContain('Holger Drewes')
    expect(wrapper.text()).toContain('EthereumJS')
  })

  it('renders acknowledgements with base tools', () => {
    expect(wrapper.text()).toContain('ACKNOWLEDGEMENTS')
    expect(wrapper.text()).toContain('Vue.js')
    expect(wrapper.text()).toContain('Tailwind CSS')
    expect(wrapper.text()).toContain('Vite')
  })

  it('renders data privacy section', () => {
    expect(wrapper.text()).toContain('DATA')
    expect(wrapper.text()).toContain('does not collect any personal data')
  })
})
