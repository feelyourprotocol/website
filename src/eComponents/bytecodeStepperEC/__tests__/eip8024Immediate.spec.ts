import { describe, expect, it } from 'vitest'

import {
  decodeDupnSwapnOperand,
  decodeExchangeOperands,
  encodeDupnFromStackDepth,
  encodeDupnSwapnImmediate,
  encodeExchangeFromStackDepths,
  encodeExchangeImmediate,
  encodeSwapnFromSwapDepth,
  exchangeOperandToStackDepth,
  explainDupnImmediate,
  explainExchangeImmediate,
  explainSwapnImmediate,
  isValidExchangeImmediateByte,
} from '../eip8024Immediate'

describe('eip8024Immediate', () => {
  describe('DUPN / SWAPN decode_single', () => {
    it('decodes 0x80 to n=17', () => {
      expect(decodeDupnSwapnOperand(0x80)).toBe(17)
    })

    it('encodes depth 17 to 0x80 and round-trips', () => {
      const encoded = encodeDupnFromStackDepth(17)
      expect(encoded.ok).toBe(true)
      if (!encoded.ok) return
      expect(encoded.immediateHex).toBe('0x80')
      expect(decodeDupnSwapnOperand(encoded.immediate)).toBe(17)
    })

    it('builds DUPN summary for 0x80', () => {
      const breakdown = explainDupnImmediate(0x80)
      expect(breakdown.summary).toBe('0x80 → n=17 → copy depth 17')
      expect(breakdown.expertSteps).toHaveLength(4)
    })

    it('encodes SWAPN swap depth 18 via n=17', () => {
      const encoded = encodeSwapnFromSwapDepth(18)
      expect(encoded.ok).toBe(true)
      if (!encoded.ok) return
      expect(encoded.immediateHex).toBe('0x80')
      expect(encoded.operandN).toBe(17)
    })

    it('builds SWAPN summary for 0x80', () => {
      const breakdown = explainSwapnImmediate(0x80)
      expect(breakdown.summary).toBe('0x80 → n=17 → swap top with depth 18')
    })

    it('rejects SWAPN swap depth 17 (needs depth 18+)', () => {
      expect(encodeSwapnFromSwapDepth(17).ok).toBe(false)
    })

    it('rejects DUPN depth below 17', () => {
      expect(encodeDupnFromStackDepth(16).ok).toBe(false)
    })

    it('round-trips encodeDupnSwapnImmediate with decodeDupnSwapnOperand', () => {
      for (let n = 17; n <= 235; n++) {
        const encoded = encodeDupnSwapnImmediate(n)
        expect(encoded.ok).toBe(true)
        if (!encoded.ok) return
        expect(decodeDupnSwapnOperand(encoded.immediate)).toBe(n)
      }
    })
  })

  describe('EXCHANGE decode_pair', () => {
    it('decodes 0x8e to operands 1, 2 (stack depths 2 & 3)', () => {
      expect(decodeExchangeOperands(0x8e)).toEqual([1, 2])
      expect(exchangeOperandToStackDepth(1)).toBe(2)
      expect(exchangeOperandToStackDepth(2)).toBe(3)
    })

    it('decodes EIP example 0x9d to operands 2, 3', () => {
      expect(decodeExchangeOperands(0x9d)).toEqual([2, 3])
    })

    it('builds summary for 0x8e', () => {
      const breakdown = explainExchangeImmediate(0x8e)
      expect(breakdown.summary).toBe('0x8e → n=1, m=2 → depths 2 & 3')
    })

    it('documents XOR and nibble split for 0x8e in expert steps', () => {
      const breakdown = explainExchangeImmediate(0x8e)
      expect(breakdown.k).toBe(1)
      expect(breakdown.q).toBe(0)
      expect(breakdown.r).toBe(1)
      expect(breakdown.usedLessThanBranch).toBe(true)
      expect(breakdown.expertSteps).toHaveLength(5)
      expect(breakdown.expertSteps[1]?.detail).toContain('XOR 0x8f = 0x01')
      expect(breakdown.expertSteps[4]?.detail).toContain('depth 2 ↔ depth 3')
    })

    describe('encodeExchangeImmediate', () => {
      it('encodes operands 1, 2 to 0x8e', () => {
        const result = encodeExchangeImmediate(1, 2)
        expect(result.ok).toBe(true)
        if (!result.ok) return
        expect(result.immediateHex).toBe('0x8e')
        expect(result.stackDepthA).toBe(2)
        expect(result.stackDepthB).toBe(3)
      })

      it('encodes operands 2, 3 to 0x9d (EIP example)', () => {
        const result = encodeExchangeImmediate(2, 3)
        expect(result.ok).toBe(true)
        if (!result.ok) return
        expect(result.immediateHex).toBe('0x9d')
      })

      it('round-trips with decodeExchangeOperands', () => {
        for (const immediate of [0x8e, 0x9d, 0x80, 0xff]) {
          if (!isValidExchangeImmediateByte(immediate)) continue
          const [n, m] = decodeExchangeOperands(immediate)
          const encoded = encodeExchangeImmediate(n, m)
          expect(encoded.ok).toBe(true)
          if (!encoded.ok) return
          expect(encoded.immediate).toBe(immediate)
        }
      })

      it('rejects operands with n >= m', () => {
        expect(encodeExchangeImmediate(2, 2).ok).toBe(false)
        expect(encodeExchangeImmediate(3, 2).ok).toBe(false)
      })

      it('rejects operands where n + m > 30', () => {
        expect(encodeExchangeImmediate(15, 16).ok).toBe(false)
      })
    })

    describe('encodeExchangeFromStackDepths', () => {
      it('encodes stack depths 2 & 3 to 0x8e regardless of input order', () => {
        expect(encodeExchangeFromStackDepths(2, 3).ok).toBe(true)
        const forward = encodeExchangeFromStackDepths(2, 3)
        const reverse = encodeExchangeFromStackDepths(3, 2)
        expect(forward.ok && reverse.ok).toBe(true)
        if (!forward.ok || !reverse.ok) return
        expect(forward.immediateHex).toBe('0x8e')
        expect(reverse.immediateHex).toBe('0x8e')
      })

      it('rejects depth 1 (the top item)', () => {
        expect(encodeExchangeFromStackDepths(1, 3).ok).toBe(false)
      })

      it('rejects identical depths', () => {
        expect(encodeExchangeFromStackDepths(4, 4).ok).toBe(false)
      })
    })
  })
})
