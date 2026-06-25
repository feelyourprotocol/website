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
    hint:
      'Grab $FYP on Base, then come back hungry. Balance hidden? Tap “FYP not in wallet?” below.',
  },
  already_scooped: {
    code: 'already_scooped',
    title: 'You already have this flavor',
    message:
      'This wallet already minted a soulbound receipt for that scoop. One per flavor — try a different vendor.',
    hint: 'Hit “Different vendor” and pick a flavor you have not scooped yet.',
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
    title: 'Scoop did not mint',
    message:
      'The on-chain mint did not finish. If MetaMask shows a failed transaction, your $FYP was not taken — only gas may apply.',
    hint: 'Try again in a moment. If MetaMask keeps failing, ping us on X (@FeelEthereum) with the tx hash.',
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
