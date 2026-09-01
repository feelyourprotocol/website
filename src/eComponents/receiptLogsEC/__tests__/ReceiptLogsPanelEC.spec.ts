import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import { TOPICS } from '@/explorations/TOPICS'

import ReceiptLogsPanelEC from '../ReceiptLogsPanelEC.vue'
import type { ReceiptLogsViewState } from '../types'

const topic = TOPICS.ux

describe('ReceiptLogsPanelEC', () => {
  it('shows idle state before a run', () => {
    const wrapper = mount(ReceiptLogsPanelEC, {
      props: { topic, state: null, hasRun: false },
    })
    expect(wrapper.text()).toContain('Receipt logs')
    expect(wrapper.text()).toContain('Waiting for execution')
  })

  it('renders decoded ETH transfer rows after a run', () => {
    const state: ReceiptLogsViewState = {
      hardforkId: 'amsterdam',
      hardforkLabel: 'Amsterdam',
      focusKind: 'eth-transfer',
      rows: [
        {
          index: 0,
          txIndex: 0,
          raw: {
            address: '0xff00000000000000000000000000000000000000fe',
            topics: ['0xddf2…', '0x01', '0x02'],
            data: '0x01',
          },
          decoration: {
            kind: 'eth-transfer',
            from: '0x1111111111111111111111111111111111111111',
            to: '0x2222222222222222222222222222222222222222',
            valueWei: 1n,
            valueLabel: '1 wei',
            emitterNote: 'system address (EIP-7708)',
          },
        },
      ],
    }

    const wrapper = mount(ReceiptLogsPanelEC, {
      props: { topic, state, hasRun: true },
    })

    expect(wrapper.text()).toContain('ETH Transfer (EIP-7708)')
    expect(wrapper.text()).toContain('1 wei')
    expect(wrapper.text()).toContain('system address')
  })

  it('shows empty-run hint when receipt has no logs', () => {
    const state: ReceiptLogsViewState = {
      hardforkId: 'osaka',
      hardforkLabel: 'Osaka',
      emptyHint: 'Osaka has no EIP-7708 transfer logs.',
      rows: [],
    }

    const wrapper = mount(ReceiptLogsPanelEC, {
      props: { topic, state, hasRun: true },
    })

    expect(wrapper.text()).toContain('Osaka has no EIP-7708 transfer logs.')
  })
})
