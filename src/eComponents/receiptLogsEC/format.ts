import type { ReceiptLogRow } from './types'

/** Shorten a checksummed or lowercase hex address for compact UI. */
export function shortAddress(address: string, head = 6, tail = 4): string {
  const normalized = address.toLowerCase()
  if (!normalized.startsWith('0x') || normalized.length < head + tail + 2) {
    return address
  }
  return `${normalized.slice(0, head + 2)}…${normalized.slice(-tail)}`
}

/** Human-readable wei amount for log teaching panels. */
export function formatWeiValue(valueWei: bigint): string {
  if (valueWei === 0n) return '0 wei'
  if (valueWei === 1n) return '1 wei'
  const oneEth = 1_000_000_000_000_000_000n
  if (valueWei % oneEth === 0n) {
    const eth = valueWei / oneEth
    return `${eth} ETH`
  }
  if (valueWei >= 1_000_000_000_000n) {
    return `${Number(valueWei) / 1e12} gwei`
  }
  return `${valueWei} wei`
}

/** Shorten a 32-byte topic for table display. */
export function shortTopic(topic: string): string {
  if (topic.length <= 18) return topic
  return `${topic.slice(0, 10)}…${topic.slice(-6)}`
}

/** Assign stable row indices across one or more transactions. */
export function indexReceiptLogRows(rows: Omit<ReceiptLogRow, 'index'>[]): ReceiptLogRow[] {
  return rows.map((row, index) => ({ ...row, index }))
}
