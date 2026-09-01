import type { Log } from '@ethereumjs/evm'
import {
  decodeEIP7708BurnLog,
  decodeEIP7708TransferLog,
  EIP7708_SYSTEM_ADDRESS,
} from '@ethereumjs/evm'
import { bytesToHex, hexToBytes, type PrefixedHexString } from '@ethereumjs/util'

import { formatWeiValue, indexReceiptLogRows } from '@/eComponents/receiptLogsEC/format'
import type { RawReceiptLog, ReceiptLogRow } from '@/eComponents/receiptLogsEC/types'

export function logToRaw(log: Log): RawReceiptLog {
  const [address, topics, data] = log
  return {
    address: bytesToHex(address),
    topics: topics.map((topic) => bytesToHex(topic)),
    data: bytesToHex(data),
  }
}

export function rawToLog(raw: RawReceiptLog): Log {
  return [
    hexToBytes(raw.address as PrefixedHexString),
    raw.topics.map((topic) => hexToBytes(topic as PrefixedHexString)),
    hexToBytes(raw.data as PrefixedHexString),
  ]
}

export function decorateRawLog(raw: RawReceiptLog): ReceiptLogRow['decoration'] | undefined {
  const log = rawToLog(raw)

  const transfer = decodeEIP7708TransferLog(log)
  if (transfer) {
    return {
      kind: 'eth-transfer',
      from: transfer.from,
      to: transfer.to,
      valueWei: transfer.value,
      valueLabel: formatWeiValue(transfer.value),
      emitterNote: `system address (${bytesToHex(EIP7708_SYSTEM_ADDRESS)})`,
    }
  }

  const burn = decodeEIP7708BurnLog(log)
  if (burn) {
    return {
      kind: 'eth-burn',
      account: burn.account,
      valueWei: burn.value,
      valueLabel: formatWeiValue(burn.value),
    }
  }

  return undefined
}

export function receiptLogsToRows(receipts: Array<{ logs: Log[] }>): ReceiptLogRow[] {
  const pending: Omit<ReceiptLogRow, 'index'>[] = []

  receipts.forEach((receipt, txIndex) => {
    receipt.logs.forEach((log) => {
      const raw = logToRaw(log)
      pending.push({
        txIndex,
        raw,
        decoration: decorateRawLog(raw),
      })
    })
  })

  return indexReceiptLogRows(pending)
}

export function countTransferLogs(rows: ReceiptLogRow[]): number {
  return rows.filter((row) => row.decoration?.kind === 'eth-transfer').length
}
