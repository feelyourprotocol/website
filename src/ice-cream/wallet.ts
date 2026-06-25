import type { EIP1193Provider } from 'viem'

import { BASE_CHAIN_ID, FYP_TOKEN_ADDRESS, FYP_TOKEN_SYMBOL } from './constants'

export type AddFypToWalletResult = 'added' | 'rejected' | 'unavailable'

const FYP_DECIMALS = 18

export function getInjectedProvider(): EIP1193Provider | undefined {
  if (typeof window === 'undefined') return undefined
  return (window as Window & { ethereum?: EIP1193Provider }).ethereum
}

export async function ensureBaseChain(provider: EIP1193Provider): Promise<void> {
  const hexChainId = `0x${BASE_CHAIN_ID.toString(16)}`

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: hexChainId }],
    })
  } catch (error) {
    const switchError = error as { code?: number }
    if (switchError.code !== 4902) throw error

    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: hexChainId,
          chainName: 'Base',
          nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
          rpcUrls: ['https://mainnet.base.org'],
          blockExplorerUrls: ['https://basescan.org'],
        },
      ],
    })
  }
}

/** Prompt MetaMask (etc.) to show $FYP on Base — balance may exist before this. */
export async function addFypToWallet(): Promise<AddFypToWalletResult> {
  const provider = getInjectedProvider()
  if (!provider) return 'unavailable'

  try {
    await ensureBaseChain(provider)
    const added = (await provider.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: FYP_TOKEN_ADDRESS,
          symbol: FYP_TOKEN_SYMBOL,
          decimals: FYP_DECIMALS,
        },
      },
    })) as boolean
    return added ? 'added' : 'rejected'
  } catch {
    return 'rejected'
  }
}
