import { afterEach, describe, expect, it, vi } from 'vitest'

import { FYP_TOKEN_ADDRESS } from '../constants'
import { addFypToWallet } from '../wallet'

describe('addFypToWallet', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns unavailable without injected wallet', async () => {
    vi.stubGlobal('window', {})
    await expect(addFypToWallet()).resolves.toBe('unavailable')
  })

  it('requests wallet_watchAsset for FYP on Base', async () => {
    const request = vi.fn().mockResolvedValueOnce(undefined).mockResolvedValueOnce(true)
    vi.stubGlobal('window', { ethereum: { request } })

    await expect(addFypToWallet()).resolves.toBe('added')

    expect(request).toHaveBeenLastCalledWith({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: FYP_TOKEN_ADDRESS,
          symbol: 'FYP',
          decimals: 18,
        },
      },
    })
  })
})
