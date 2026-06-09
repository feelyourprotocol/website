import { describe, expect, it } from 'vitest'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'

import { disassembleBytecode } from '../disassemble'

async function createAmsterdamEvm() {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
  return createEVM({ common })
}

describe('disassembleBytecode', () => {
  it('disassembles PUSH1 ADD STOP sequence', async () => {
    const evm = await createAmsterdamEvm()
    const code = new Uint8Array([0x60, 0x01, 0x60, 0x02, 0x01, 0x00])

    const rows = disassembleBytecode(code, evm.common)

    expect(rows).toHaveLength(4)
    expect(rows[0]).toMatchObject({ pc: 0, name: 'PUSH1 0x01', size: 2, rawBytes: '60 01' })
    expect(rows[1]).toMatchObject({ pc: 2, name: 'PUSH1 0x02', size: 2 })
    expect(rows[2]).toMatchObject({ pc: 4, name: 'ADD', size: 1 })
    expect(rows[3]).toMatchObject({ pc: 5, name: 'STOP', size: 1 })
  })

  it('disassembles EIP-8024 opcodes with immediates', async () => {
    const evm = await createAmsterdamEvm()
    const code = new Uint8Array([0xe6, 0x10, 0xe7, 0x10, 0xe8, 0x8e, 0x00])

    const rows = disassembleBytecode(code, evm.common)

    expect(rows.map((r) => r.name)).toEqual(['DUPN 0x10', 'SWAPN 0x10', 'EXCHANGE 0x8e', 'STOP'])
    expect(rows.map((r) => r.rawBytes)).toEqual(['e6 10', 'e7 10', 'e8 8e', '00'])
  })
})
