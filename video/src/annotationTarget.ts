import type { VideoFocusAreaRef } from './types.ts'

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
