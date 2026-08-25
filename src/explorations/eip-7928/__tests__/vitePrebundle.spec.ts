/**
 * Browser dev/preview serves @ethereumjs/* through Vite's dependency prebundle
 * (`node_modules/.vite/deps/`). That cache is NOT invalidated on every `npm install`,
 * so method-level API drift after a bump can pass Vitest (fresh ESM) while "Run block"
 * fails in the browser. This spec imports the same prebundle the client uses.
 *
 * After bumping @ethereumjs/*: `rm -rf node_modules/.vite` and restart dev, or
 * `npx vite optimize --force`.
 */
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createAddressFromString } from '@ethereumjs/util'
import { describe, expect, it } from 'vitest'

describe('Vite prebundle parity (@ethereumjs/tx)', () => {
  it('createLegacyTx exposes getIntrinsicGas on the optimized client bundle', async () => {
    const prebundlePath = '../../../../node_modules/.vite/deps/@ethereumjs_tx.js'
    const { createLegacyTx } = (await import(
      /* @vite-ignore */ prebundlePath
    )) as typeof import('@ethereumjs/tx')
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
    const tx = createLegacyTx(
      {
        gasLimit: 1n,
        gasPrice: 10n,
        value: 1n,
        to: createAddressFromString('0x0000000000000000000000000000000000000001'),
      },
      { common },
    )
    expect(typeof tx.getIntrinsicGas).toBe('function')
    expect(tx.getIntrinsicGas()).toBeGreaterThan(0n)
  })
})
