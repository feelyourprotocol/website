/**
 * Shared types for the EIP-8141 Frame Transaction exploration.
 */

export type FrameMode = 'VERIFY' | 'SENDER' | 'DEFAULT'

export interface FrameDefinition {
  mode: FrameMode
  label: string
  targetLabel?: string
  gasLimit: bigint
  dataHex: string
  description: string
}

export interface ExtraAccount {
  label: string
  addressHex: string
  balance: bigint
}

export interface FrameExampleDefinition {
  id: string
  title: string
  description: string
  senderBalance: bigint
  extraAccounts?: ExtraAccount[]
  frames: FrameDefinition[]
  expectSuccess: boolean
}

export interface FrameStepResult {
  frameIndex: number
  mode: FrameMode
  label: string
  status: number
  gasUsed: bigint
  senderApproved: boolean
  payerApproved: boolean
  senderBalance: bigint
  senderNonce: bigint
  observation: string
}

export interface FrameTxExecutionResult {
  success: boolean
  error?: string
  txType: number
  gasLimit: bigint
  totalGasSpent: bigint
  frameSteps: FrameStepResult[]
  recipientBalances: Record<string, bigint>
}
