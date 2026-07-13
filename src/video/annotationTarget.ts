import type { VideoFocusAreaRef } from './types'

/** Resolve a zone key, live target alias, or raw CSS selector. */
export function resolveTargetSelector(
  target: string,
  focusAreas?: Record<string, VideoFocusAreaRef>,
): string {
  if (target === 'disassembly-active') return '[data-disassembly-active="true"]'
  if (target === 'disassembly-active-opcode') {
    return '[data-disassembly-active="true"] [data-disassembly-opcode]'
  }
  if (target === 'disassembly-dupn') {
    return '[data-disassembly-opcode][data-disassembly-mnemonic*="DUPN"]'
  }
  if (target === 'stack-top') return '[data-stack-depth="1"]'
  if (target === 'stack-top-value') return '[data-stack-depth="1"] [data-stack-value]'
  const depthValueMatch = /^stack-depth-(\d+)-value$/.exec(target)
  if (depthValueMatch) {
    return `[data-stack-depth="${depthValueMatch[1]}"] [data-stack-value]`
  }
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

const TOP_BANNER_SELECTORS = [
  '.video-float-layer .video-banner--top-banner',
  '.video-float-layer .video-punch--top-banner',
]

/** Story overlays at the top — annotations must not draw over these. */
export function collectTopBannerRects(root: ParentNode = document): DOMRect[] {
  const rects: DOMRect[] = []
  for (const sel of TOP_BANNER_SELECTORS) {
    for (const el of root.querySelectorAll(sel)) {
      const rect = el.getBoundingClientRect()
      if (rect.width > 0 && rect.height > 0) rects.push(rect)
    }
  }
  return rects
}

export function targetOverlapsTopBanner(
  target: DOMRect,
  bannerRects: DOMRect[],
  gapPx = 12,
): boolean {
  for (const banner of bannerRects) {
    const hOverlap = target.left < banner.right && target.right > banner.left
    if (hOverlap && target.top < banner.bottom + gapPx) return true
  }
  return false
}
