import type { Common } from '@ethereumjs/common'
import { getOpcodesForHF } from '@ethereumjs/evm'
import { bytesToHex } from '@ethereumjs/util'

import type { InstructionRow } from './types'

const PUSH1 = 0x60
const PUSH32 = 0x7f
const DUPN = 0xe6
const SWAPN = 0xe7
const EXCHANGE = 0xe8

function instructionSize(opcodeByte: number): number {
  if (opcodeByte >= PUSH1 && opcodeByte <= PUSH32) {
    return 1 + (opcodeByte - PUSH1 + 1)
  }
  if (opcodeByte === DUPN || opcodeByte === SWAPN || opcodeByte === EXCHANGE) {
    return 2
  }
  return 1
}

function formatRawBytes(bytes: Uint8Array): string {
  return bytesToHex(bytes)
    .substring(2)
    .match(/.{1,2}/g)!
    .join(' ')
}

function formatName(opcodeByte: number, name: string, immediate?: Uint8Array): string {
  if (!immediate || immediate.length === 0) {
    return name
  }
  const immHex = bytesToHex(immediate).substring(2)
  if (opcodeByte >= PUSH1 && opcodeByte <= PUSH32) {
    return `PUSH${immediate.length} 0x${immHex}`
  }
  return `${name} 0x${immHex}`
}

export function disassembleBytecode(code: Uint8Array, common: Common): InstructionRow[] {
  const opcodes = getOpcodesForHF(common).opcodes
  const rows: InstructionRow[] = []
  let pc = 0

  while (pc < code.length) {
    const opcodeByte = code[pc]
    const opcode = opcodes.get(opcodeByte)
    const name = opcode?.name ?? `UNKNOWN(0x${opcodeByte.toString(16)})`
    const size = instructionSize(opcodeByte)
    const immediate = size > 1 ? code.subarray(pc + 1, pc + size) : undefined
    const instructionBytes = code.subarray(pc, pc + size)

    rows.push({
      pc,
      opcodeByte,
      name: formatName(opcodeByte, name, immediate),
      immediateHex: immediate ? bytesToHex(immediate) : undefined,
      size,
      rawBytes: formatRawBytes(instructionBytes),
    })

    pc += size
  }

  return rows
}
