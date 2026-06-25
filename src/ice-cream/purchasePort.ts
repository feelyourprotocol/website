import type { IceCreamMeme, IceCreamPurchasePort, PurchaseOutcome } from './types'
import { createViemPurchasePort } from './createViemPurchasePort'

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

/** Production port — MetaMask / injected wallet on Base. */
export function createDefaultPurchasePort(): IceCreamPurchasePort {
  return createViemPurchasePort()
}

/** Stand-in for unit tests — same port shape as production. */
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
