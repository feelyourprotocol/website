import type { InjectionKey, Ref } from 'vue'

import type { ReceiptLogsViewState } from './types'

/** Loose coupling: explorations publish receipt rows; companions subscribe. */
export interface ReceiptLogsContext {
  state: Ref<ReceiptLogsViewState | null>
  setState: (next: ReceiptLogsViewState | null) => void
}

export const RECEIPT_LOGS_CONTEXT: InjectionKey<ReceiptLogsContext> = Symbol('receiptLogsContext')
