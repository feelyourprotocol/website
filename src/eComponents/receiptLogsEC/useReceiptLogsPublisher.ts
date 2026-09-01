import { inject, provide, ref } from 'vue'

import { RECEIPT_LOGS_CONTEXT, type ReceiptLogsContext } from './receiptLogsContext'
import type { ReceiptLogsViewState } from './types'

export function provideReceiptLogs(): ReceiptLogsContext {
  const state = ref<ReceiptLogsViewState | null>(null)

  function setState(next: ReceiptLogsViewState | null) {
    state.value = next
  }

  const ctx: ReceiptLogsContext = { state, setState }
  provide(RECEIPT_LOGS_CONTEXT, ctx)
  return ctx
}

export function useReceiptLogsPublisher(): ReceiptLogsContext['setState'] {
  return inject(RECEIPT_LOGS_CONTEXT, null)?.setState ?? (() => {})
}

export function useReceiptLogsState(): ReceiptLogsContext['state'] | null {
  return inject(RECEIPT_LOGS_CONTEXT, null)?.state ?? null
}
