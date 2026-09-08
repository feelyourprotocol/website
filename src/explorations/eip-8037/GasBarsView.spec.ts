import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import GasBarsView from './GasBarsView.vue'

function executionBarStyle(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('.e-bg-dark').attributes('style') ?? ''
}

function stateBarStyle(wrapper: ReturnType<typeof mount>) {
  const bars = wrapper.findAll('.relative.h-4.rounded.e-bg-medium.overflow-hidden')
  return bars[1]?.find('div[style*="background-color"]').attributes('style') ?? ''
}

describe('GasBarsView', () => {
  it('renders idle shell before run with placeholders and stable test id', () => {
    const wrapper = mount(GasBarsView, {
      props: {
        hasRun: false,
        regular: 0n,
        state: 0n,
        gasLimit: 21_000n,
        txSuccessful: true,
        gasLimitMode: 'recommended',
      },
    })

    expect(wrapper.find('[data-testid="gas-bars"]').attributes('data-has-run')).toBe('false')
    expect(wrapper.find('[data-testid="gas-bar-execution-value"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="gas-bar-state-value"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="gas-bar-status"]').attributes('data-out-of-gas')).toBe(
      'false',
    )
    expect(wrapper.text()).toContain('Gas dimensions')
    expect(wrapper.text()).toContain('—')
    expect(wrapper.text()).toContain('Run tx to fill execution and state bars')
    expect(wrapper.text()).toContain('Recommended')
    expect(executionBarStyle(wrapper)).toMatch(/width:\s*0/)
    expect(stateBarStyle(wrapper)).toMatch(/width:\s*0/)
  })

  it('renders filled bars after run', () => {
    const wrapper = mount(GasBarsView, {
      props: {
        hasRun: true,
        regular: 21_000n,
        state: 183_600n,
        gasLimit: 250_000n,
        txSuccessful: true,
        gasLimitMode: 'recommended',
      },
    })

    expect(wrapper.attributes('data-has-run')).toBe('true')
    expect(wrapper.text()).toContain('21,000')
    expect(wrapper.text()).toContain('183,600')
    expect(wrapper.text()).not.toContain('Run tx to fill execution and state bars')
    expect(executionBarStyle(wrapper)).toMatch(/width:\s*[1-9]/)
    expect(stateBarStyle(wrapper)).toMatch(/width:\s*[1-9]/)
  })

  it('keeps execution bar visible after run when state gas is zero (Osaka baseline)', () => {
    const wrapper = mount(GasBarsView, {
      props: {
        hasRun: true,
        regular: 21_000n,
        state: 0n,
        gasLimit: 21_000n,
        txSuccessful: true,
        gasLimitMode: 'classic',
      },
    })

    expect(wrapper.text()).toContain('0')
    expect(wrapper.find('.e-bg-dark').classes()).toContain('e-bg-dark')
    expect(executionBarStyle(wrapper)).toMatch(/width:\s*100/)
    expect(stateBarStyle(wrapper)).toMatch(/width:\s*0/)
  })

  it('shows out-of-gas label when a run failed', () => {
    const wrapper = mount(GasBarsView, {
      props: {
        hasRun: true,
        regular: 21_000n,
        state: 183_600n,
        gasLimit: 21_000n,
        txSuccessful: false,
        gasLimitMode: 'classic',
      },
    })

    expect(wrapper.text()).toContain('out of gas')
    expect(wrapper.text()).toContain('21,000')
    expect(wrapper.find('[data-testid="gas-bar-status"]').attributes('data-out-of-gas')).toBe(
      'true',
    )
  })
})
