export interface IceCreamMeme {
  id: string
  name: string
  /** In-character vendor pitch — no “demo” framing. */
  quote: string
  flavor: string
  /** Short flavor line under the scoop name (idle state). */
  flavorBlurb: string
  /** In-character success copy after mint. */
  successLine: string
  vendorImg: string
  successImg: string
  priceFyp: string
  nftId: number
}

export type IceCreamPhase = 'idle' | 'purchasing' | 'success' | 'error'

export type IceCreamErrorCode =
  | 'wallet_rejected'
  | 'insufficient_fyp'
  | 'already_scooped'
  | 'network'
  | 'mint_failed'
  | 'unknown'

export interface IceCreamErrorView {
  code: IceCreamErrorCode
  title: string
  message: string
  hint: string
}

export type PurchaseOutcome = { status: 'success' } | { status: 'error'; code: IceCreamErrorCode }

export interface IceCreamPurchasePort {
  buy(meme: IceCreamMeme): Promise<PurchaseOutcome>
}
