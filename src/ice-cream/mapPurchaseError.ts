import {
  BaseError,
  ContractFunctionRevertedError,
  InsufficientFundsError,
  UserRejectedRequestError,
} from 'viem'

import type { IceCreamErrorCode } from './types'

function collectErrorText(error: unknown): string {
  const parts: string[] = []
  let current: unknown = error

  while (current instanceof BaseError) {
    parts.push(current.shortMessage, current.message, current.details ?? '')

    if (current instanceof ContractFunctionRevertedError) {
      if (current.reason) parts.push(current.reason)
      const decoded = current.data
      if (decoded && typeof decoded === 'object' && 'errorName' in decoded) {
        parts.push(String(decoded.errorName))
      }
    }

    current = (current as BaseError & { cause?: unknown }).cause
  }

  if (current instanceof Error) {
    parts.push(current.message)
  }

  return parts.join(' ')
}

function findRevertError(error: unknown): ContractFunctionRevertedError | null {
  if (error instanceof ContractFunctionRevertedError) {
    return error
  }
  if (error instanceof BaseError && (error as BaseError & { cause?: unknown }).cause) {
    return findRevertError((error as BaseError & { cause?: unknown }).cause)
  }
  return null
}

function codeFromRevertBlob(blob: string): IceCreamErrorCode | null {
  if (blob.includes('AlreadyScooped')) {
    return 'already_scooped'
  }
  if (blob.includes('UnknownFlavor')) {
    return 'unknown'
  }
  if (
    blob.includes('SoulboundTransferNotAllowed') ||
    blob.includes('ERC20InsufficientBalance') ||
    blob.includes('ERC20InsufficientAllowance') ||
    blob.includes('insufficient allowance') ||
    blob.includes('transfer amount exceeds balance') ||
    blob.includes('insufficient balance')
  ) {
    return 'insufficient_fyp'
  }
  return null
}

export function mapPurchaseError(error: unknown): IceCreamErrorCode {
  if (error instanceof UserRejectedRequestError) {
    return 'wallet_rejected'
  }

  if (error instanceof InsufficientFundsError) {
    return 'network'
  }

  const blob = collectErrorText(error)

  const mapped = codeFromRevertBlob(blob)
  if (mapped) {
    return mapped
  }

  if (findRevertError(error)) {
    return 'mint_failed'
  }

  if (error instanceof BaseError) {
    const message = error.shortMessage.toLowerCase()
    if (message.includes('chain') || message.includes('network')) {
      return 'network'
    }
  }

  return 'unknown'
}
