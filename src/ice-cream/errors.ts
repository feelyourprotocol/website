import type { IceCreamErrorCode, IceCreamErrorView } from './types'

const ERROR_VIEWS: Record<IceCreamErrorCode, IceCreamErrorView> = {
  wallet_rejected: {
    code: 'wallet_rejected',
    title: 'Wallet said “nah”',
    message:
      'You closed the wallet before the scoop cleared. The stand is still here — we did not charge you.',
    hint: 'Connect again and hit Buy when you are ready. No shame in double-checking gas.',
  },
  insufficient_fyp: {
    code: 'insufficient_fyp',
    title: 'Not enough $FYP in the cone',
    message:
      'Your wallet is light on $FYP. We cannot hand over premium meme ice cream on credit — house rules.',
    hint: 'Grab $FYP on Base, then come back hungry. The freezer stays cold.',
  },
  network: {
    code: 'network',
    title: 'Base is having a meltdown',
    message:
      'The chain hiccuped mid-scoop. Your payment may or may not have landed — check your wallet before retrying.',
    hint: 'Wait a moment, refresh, and try again. If it keeps failing, blame the heat wave.',
  },
  mint_failed: {
    code: 'mint_failed',
    title: 'Payment landed, NFT did not',
    message:
      'We got your $FYP, but the soulbound receipt mint tripped. Rare, annoying, and entirely our problem to fix.',
    hint: 'Ping us on X (@FeelEthereum) with your tx hash. We will make the receipt right.',
  },
  unknown: {
    code: 'unknown',
    title: 'Brain freeze at the register',
    message:
      'Something unexpected happened between wallet and freezer. The vendor is as confused as you are.',
    hint: 'Try once more. If the stand keeps glitching, walk away and come back after a cold drink.',
  },
}

export function getIceCreamErrorView(code: IceCreamErrorCode): IceCreamErrorView {
  return ERROR_VIEWS[code]
}
