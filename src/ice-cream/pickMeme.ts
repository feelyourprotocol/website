import type { IceCreamMeme } from './types'

/** Pick a random vendor, optionally excluding the current one. */
export function pickRandomMeme(memes: IceCreamMeme[], excludeId?: string): IceCreamMeme {
  const pool = excludeId ? memes.filter((m) => m.id !== excludeId) : memes
  const candidates = pool.length > 0 ? pool : memes
  return candidates[Math.floor(Math.random() * candidates.length)]!
}

export function canPurchase(phase: import('./types').IceCreamPhase): boolean {
  return phase === 'idle' || phase === 'error'
}

export function canShuffleVendor(phase: import('./types').IceCreamPhase): boolean {
  return phase === 'idle' || phase === 'error'
}
