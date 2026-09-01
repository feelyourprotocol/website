import { describe, expect, it } from 'vitest'

import { formatWeiValue, indexReceiptLogRows, shortAddress, shortTopic } from '../format'

describe('receiptLogsEC format', () => {
  it('shortens addresses', () => {
    expect(shortAddress('0x1234567890123456789012345678901234567890')).toBe('0x123456…7890')
  })

  it('formats wei values readably', () => {
    expect(formatWeiValue(1n)).toBe('1 wei')
    expect(formatWeiValue(1_000_000_000_000_000_000n)).toBe('1 ETH')
  })

  it('shortens long topics', () => {
    const topic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    expect(shortTopic(topic)).toContain('…')
  })

  it('indexes log rows in order', () => {
    const rows = indexReceiptLogRows([
      {
        txIndex: 0,
        raw: { address: '0x01', topics: [], data: '0x' },
      },
      {
        txIndex: 0,
        raw: { address: '0x02', topics: [], data: '0x' },
      },
    ])
    expect(rows.map((row) => row.index)).toEqual([0, 1])
  })
})
