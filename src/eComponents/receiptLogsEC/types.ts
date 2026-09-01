/** Library-neutral raw log shape — explorations map VM logs into this before display. */
export interface RawReceiptLog {
  address: string
  topics: string[]
  data: string
}

/** Known decodings the panel can render with teaching labels. */
export type ReceiptLogDecoration =
  | {
      kind: 'eth-transfer'
      from: string
      to: string
      valueWei: bigint
      valueLabel: string
      emitterNote?: string
    }
  | {
      kind: 'eth-burn'
      account: string
      valueWei: bigint
      valueLabel: string
    }
  | {
      kind: 'custom'
      label: string
      fields: Array<{ key: string; value: string }>
    }

export interface ReceiptLogRow {
  /** Zero-based index in the flattened receipt list for this run. */
  index: number
  /** Transaction index within the block (0 when single-tx scenarios). */
  txIndex: number
  raw: RawReceiptLog
  decoration?: ReceiptLogDecoration
}

/** Input bundle explorations publish to {@link ReceiptLogsPanelEC}. */
export interface ReceiptLogsViewState {
  rows: ReceiptLogRow[]
  hardforkId: string
  hardforkLabel: string
  /** Short teaching line shown when the list is empty after a run. */
  emptyHint?: string
  /** When set, panel highlights rows whose decoration kind matches. */
  focusKind?: ReceiptLogDecoration['kind']
}

export interface ReceiptLogsPanelConfig {
  /** Panel heading — default "Receipt logs". */
  title?: string
  /** Idle copy before the first run. */
  idleHint?: string
  /** Shown under the heading after a run with zero rows. */
  emptyRunHint?: string
}
