import { inject, type InjectionKey,provide, reactive } from 'vue'

export interface CompanionStatus {
  label: string
  state: 'idle' | 'active'
  changeTick: number
}

export interface CompanionStatusContext {
  status: CompanionStatus
  setStatus: (update: Partial<Pick<CompanionStatus, 'label' | 'state'>>) => void
}

export const COMPANION_STATUS_KEY: InjectionKey<CompanionStatusContext> = Symbol('companionStatus')

export function provideCompanionStatus(idleLabel: string): CompanionStatusContext {
  const status = reactive<CompanionStatus>({
    label: idleLabel,
    state: 'idle',
    changeTick: 0,
  })

  function setStatus(update: Partial<Pick<CompanionStatus, 'label' | 'state'>>) {
    if (update.label !== undefined) status.label = update.label
    if (update.state !== undefined) status.state = update.state
    status.changeTick++
  }

  const ctx = { status, setStatus }
  provide(COMPANION_STATUS_KEY, ctx)
  return ctx
}

export function useCompanionStatus(): CompanionStatusContext | null {
  return inject(COMPANION_STATUS_KEY, null)
}

/** No-op publisher when ExplorationView did not provide a channel (e.g. unit tests). */
export function useCompanionStatusPublisher(): CompanionStatusContext['setStatus'] {
  return useCompanionStatus()?.setStatus ?? (() => {})
}
