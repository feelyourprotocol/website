import { ContractFunctionRevertedError, UserRejectedRequestError } from 'viem'
import { describe, expect, it } from 'vitest'

import { mapPurchaseError } from '../mapPurchaseError'

describe('mapPurchaseError', () => {
  it('maps wallet rejection', () => {
    const error = new UserRejectedRequestError(new Error('User rejected'))
    expect(mapPurchaseError(error)).toBe('wallet_rejected')
  })

  it('maps AlreadyScooped from revert text', () => {
    expect(
      mapPurchaseError(
        new Error(
          'The contract function "buyScoop" reverted with the following signature: AlreadyScooped(address,uint256)',
        ),
      ),
    ).toBe('already_scooped')
  })

  it('maps ERC20 balance errors to insufficient_fyp', () => {
    expect(mapPurchaseError(new Error('ERC20: transfer amount exceeds balance'))).toBe(
      'insufficient_fyp',
    )
  })

  it('maps generic reverts to mint_failed', () => {
    const error = new ContractFunctionRevertedError({
      abi: [],
      data: '0x',
      functionName: 'buyScoop',
    })
    expect(mapPurchaseError(error)).toBe('mint_failed')
  })

  it('maps unknown errors', () => {
    expect(mapPurchaseError(new Error('boom'))).toBe('unknown')
  })
})
