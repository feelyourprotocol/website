import type { VideoFocusAreaRef } from './types'

/** Resolve a zone key, live target alias, or raw CSS selector. */
export function resolveTargetSelector(
  target: string,
  focusAreas?: Record<string, VideoFocusAreaRef>,
): string {
  if (target === 'disassembly-active') return '[data-disassembly-active="true"]'
  if (target === 'stack-top') return '[data-stack-depth="1"]'
  const depthMatch = /^stack-depth-(\d+)$/.exec(target)
  if (depthMatch) return `[data-stack-depth="${depthMatch[1]}"]`

  const fromZone = focusAreas?.[target]?.selector
  if (fromZone) return fromZone
  if (target.startsWith('[') || target.startsWith('.') || target.startsWith('#')) return target
  return `[data-testid="${target}"]`
}

export type AnnotationCalloutSide = 'top' | 'bottom' | 'left' | 'right'

export function pickCalloutSide(
  rect: DOMRect,
  viewportH: number,
  preferred?: AnnotationCalloutSide | 'auto',
): AnnotationCalloutSide {
  if (preferred && preferred !== 'auto') return preferred

  const spaceAbove = rect.top
  const spaceBelow = viewportH - rect.bottom
  const spaceLeft = rect.left
  const spaceRight = window.innerWidth - rect.right

  if (rect.top > viewportH * 0.55) return 'top'
  if (rect.bottom < viewportH * 0.35) return 'bottom'

  const maxVertical = Math.max(spaceAbove, spaceBelow)
  const maxHorizontal = Math.max(spaceLeft, spaceRight)
  if (maxHorizontal > maxVertical + 40) {
    return spaceRight >= spaceLeft ? 'right' : 'left'
  }
  return spaceBelow >= spaceAbove ? 'bottom' : 'top'
}
