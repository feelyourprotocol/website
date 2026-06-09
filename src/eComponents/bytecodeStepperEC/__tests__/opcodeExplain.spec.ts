import { describe, expect, it } from 'vitest'

import { explainInstruction } from '../opcodeExplain'
import type { InstructionRow } from '../types'

function row(
  partial: Partial<InstructionRow> &
    Pick<InstructionRow, 'pc' | 'opcodeByte' | 'name' | 'rawBytes'>,
): InstructionRow {
  return { size: 1, ...partial }
}

describe('explainInstruction', () => {
  it('explains PUSH with decimal value', () => {
    expect(
      explainInstruction(
        row({
          pc: 0,
          opcodeByte: 0x60,
          name: 'PUSH1 0x02',
          rawBytes: '60 02',
          size: 2,
          immediateHex: '0x02',
        }),
      ),
    ).toBe('Push 2 onto the stack')
  })

  it('explains ADD', () => {
    expect(explainInstruction(row({ pc: 4, opcodeByte: 0x01, name: 'ADD', rawBytes: '01' }))).toBe(
      'Pop two values, add them, and push the result',
    )
  })

  it('explains DUP1', () => {
    expect(explainInstruction(row({ pc: 0, opcodeByte: 0x80, name: 'DUP1', rawBytes: '80' }))).toBe(
      'Copy the stack item at depth 1 (top) onto the top of the stack',
    )
  })

  it('explains DUPN with decoded depth', () => {
    expect(
      explainInstruction(
        row({
          pc: 36,
          opcodeByte: 0xe6,
          name: 'DUPN 0x80',
          rawBytes: 'e6 80',
          size: 2,
        }),
      ),
    ).toBe('Copy the stack item at depth 17 onto the top of the stack')
  })

  it('explains EXCHANGE with decoded depths', () => {
    expect(
      explainInstruction(
        row({
          pc: 40,
          opcodeByte: 0xe8,
          name: 'EXCHANGE 0x8e',
          rawBytes: 'e8 8e',
          size: 2,
        }),
      ),
    ).toBe('Swap the stack item at depth 2 with the stack item at depth 3')
  })

  it('explains STOP', () => {
    expect(explainInstruction(row({ pc: 5, opcodeByte: 0x00, name: 'STOP', rawBytes: '00' }))).toBe(
      'Halt execution',
    )
  })
})
