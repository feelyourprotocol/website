export const COMPANION_EXPAND_EVENT = 'fyp:companion-expand'

export type CompanionExpandMode = 'half' | 'full'

export function dispatchCompanionExpand(mode: CompanionExpandMode): void {
  window.dispatchEvent(new CustomEvent(COMPANION_EXPAND_EVENT, { detail: { mode } }))
}
