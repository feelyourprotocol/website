import type { VideoFocusAreaRef } from './types.ts'

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
