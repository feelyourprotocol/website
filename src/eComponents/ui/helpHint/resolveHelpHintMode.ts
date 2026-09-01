export type HelpHintMode = 'auto' | 'tooltip' | 'inline' | 'popover' | 'none'
export type HelpHintTier = 'essential' | 'useful' | 'decorative'
export type HelpHintTouchFallback = 'inline' | 'popover'
export type ResolvedHelpHintMode = 'tooltip' | 'inline' | 'popover' | 'none'

export interface ResolveHelpHintModeOptions {
  mode: HelpHintMode
  tier: HelpHintTier
  canHover: boolean
  text: string
  touchFallback?: HelpHintTouchFallback
}

/** Pick tooltip, inline, popover, or none from modality, tier, and hint text. */
export function resolveHelpHintMode(options: ResolveHelpHintModeOptions): ResolvedHelpHintMode {
  const text = options.text.trim()
  if (!text || options.mode === 'none') return 'none'

  const touchFallback = options.touchFallback ?? 'inline'

  if (options.mode === 'inline') return 'inline'
  if (options.mode === 'popover') return 'popover'

  if (options.mode === 'tooltip') {
    if (options.canHover) return 'tooltip'
    if (options.tier === 'decorative') return 'none'
    return touchFallback
  }

  // auto
  if (options.canHover) return 'tooltip'
  if (options.tier === 'decorative') return 'none'
  return touchFallback
}
