import type { IceCreamMeme, IceCreamPurchasePort, PurchaseOutcome } from './types'

export type SimulatedPurchaseOptions = {
  delayMs?: number
  outcome?: PurchaseOutcome | ((meme: IceCreamMeme) => PurchaseOutcome)
}

function resolveOutcome(
  meme: IceCreamMeme,
  outcome: SimulatedPurchaseOptions['outcome'],
): PurchaseOutcome {
  if (!outcome) return { status: 'success' }
  return typeof outcome === 'function' ? outcome(meme) : outcome
}

/** Stand-in until viem/wagmi wallet flow lands — same port shape as production. */
export function createSimulatedPurchasePort(
  options: SimulatedPurchaseOptions = {},
): IceCreamPurchasePort {
  const delayMs = options.delayMs ?? 900

  return {
    async buy(meme) {
      if (delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
      return resolveOutcome(meme, options.outcome)
    },
  }
}
