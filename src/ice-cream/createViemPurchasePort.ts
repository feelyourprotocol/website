import {
  createPublicClient,
  createWalletClient,
  custom,
  erc20Abi,
  maxUint256,
  parseEther,
} from 'viem'
import { base } from 'viem/chains'

import { iceCreamStandAbi } from './abi'
import { FYP_TOKEN_ADDRESS, ICE_CREAM_PRICE_FYP, ICE_CREAM_STAND_ADDRESS } from './constants'
import { mapPurchaseError } from './mapPurchaseError'
import type { IceCreamMeme, IceCreamPurchasePort, PurchaseOutcome } from './types'
import { ensureBaseChain, getInjectedProvider } from './wallet'

export function createViemPurchasePort(): IceCreamPurchasePort {
  const scoopPrice = parseEther(ICE_CREAM_PRICE_FYP)

  return {
    async buy(meme: IceCreamMeme): Promise<PurchaseOutcome> {
      const provider = getInjectedProvider()
      if (!provider) {
        return { status: 'error', code: 'network' }
      }

      const tokenId = BigInt(meme.nftId)
      const transport = custom(provider)

      try {
        await ensureBaseChain(provider)

        const walletClient = createWalletClient({ chain: base, transport })
        const publicClient = createPublicClient({ chain: base, transport })
        const [account] = await walletClient.requestAddresses()

        const readAllowance = () =>
          publicClient.readContract({
            address: FYP_TOKEN_ADDRESS,
            abi: erc20Abi,
            functionName: 'allowance',
            args: [account, ICE_CREAM_STAND_ADDRESS],
            blockTag: 'latest',
          })

        const readHasMinted = () =>
          publicClient.readContract({
            address: ICE_CREAM_STAND_ADDRESS,
            abi: iceCreamStandAbi,
            functionName: 'hasMinted',
            args: [account, tokenId],
            blockTag: 'latest',
          })

        if (await readHasMinted()) {
          return { status: 'error', code: 'already_scooped' }
        }

        const balance = await publicClient.readContract({
          address: FYP_TOKEN_ADDRESS,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [account],
          blockTag: 'latest',
        })
        if (balance < scoopPrice) {
          return { status: 'error', code: 'insufficient_fyp' }
        }

        let allowance = await readAllowance()

        // One approval covers all scoops — exact 10 FYP resets to 0 after each buy.
        if (allowance < scoopPrice) {
          const approveHash = await walletClient.writeContract({
            account,
            address: FYP_TOKEN_ADDRESS,
            abi: erc20Abi,
            functionName: 'approve',
            args: [ICE_CREAM_STAND_ADDRESS, maxUint256],
          })
          const approveReceipt = await publicClient.waitForTransactionReceipt({
            hash: approveHash,
          })
          if (approveReceipt.status !== 'success') {
            if (await readHasMinted()) {
              return { status: 'success' }
            }
            return { status: 'error', code: 'mint_failed' }
          }

          // MetaMask can lag one beat after approve — poll via the same wallet RPC.
          for (let attempt = 0; attempt < 15; attempt++) {
            allowance = await readAllowance()
            if (allowance >= scoopPrice) break
            await new Promise((resolve) => setTimeout(resolve, 400))
          }
        }

        if (allowance < scoopPrice) {
          return { status: 'error', code: 'insufficient_fyp' }
        }

        const buyHash = await walletClient.writeContract({
          account,
          address: ICE_CREAM_STAND_ADDRESS,
          abi: iceCreamStandAbi,
          functionName: 'buyScoop',
          args: [tokenId],
        })
        const buyReceipt = await publicClient.waitForTransactionReceipt({ hash: buyHash })
        if (buyReceipt.status !== 'success') {
          if (await readHasMinted()) {
            return { status: 'success' }
          }
          return { status: 'error', code: 'mint_failed' }
        }

        return { status: 'success' }
      } catch (error) {
        try {
          const recoveryProvider = getInjectedProvider()
          if (recoveryProvider) {
            const recoveryTransport = custom(recoveryProvider)
            const walletClient = createWalletClient({
              chain: base,
              transport: recoveryTransport,
            })
            const publicClient = createPublicClient({
              chain: base,
              transport: recoveryTransport,
            })
            const [account] = await walletClient.requestAddresses()
            const minted = await publicClient.readContract({
              address: ICE_CREAM_STAND_ADDRESS,
              abi: iceCreamStandAbi,
              functionName: 'hasMinted',
              args: [account, tokenId],
              blockTag: 'latest',
            })
            if (minted) {
              return { status: 'success' }
            }
          }
        } catch {
          // fall through to mapped error
        }
        return { status: 'error', code: mapPurchaseError(error) }
      }
    },
  }
}
