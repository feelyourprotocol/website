import type { VideoTextSegment } from './types'

/** Split long copy into staggered upper-left / lower-right segments. */
export function autoSplitText(text: string): VideoTextSegment[] {
  const trimmed = text.trim()
  const words = trimmed.split(/\s+/)
  if (words.length <= 3) {
    return [{ text: trimmed, size: 'xl', emphasis: true, slot: 'a' }]
  }
  const mid = Math.ceil(words.length / 2)
  return [
    { text: words.slice(0, mid).join(' '), size: 'lg', slot: 'a' },
    { text: words.slice(mid).join(' '), size: 'hero', emphasis: true, slot: 'b' },
  ]
}
