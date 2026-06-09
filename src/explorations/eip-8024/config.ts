import type { BytecodeStepperConfig } from '@/eComponents/bytecodeStepperEC/types'

export const config: BytecodeStepperConfig = {
  explorationId: 'eip-8024',
  defaultExample: 'push-add',
  gasLimit: 1_000_000n,
  maxStackDisplay: 20,
}
