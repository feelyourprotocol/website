import { type Examples } from '../../components/lib/general.js'
import { countUpwardsHexStr } from '../../components/lib/byteFormUtils.js'

export const examples: Examples = {
  simple: {
    title: 'Simple',
    values: ['03', '03', '02'],
  },
  '5-byte-exponent': {
    title: '5-Byte Exponent',
    values: ['03', countUpwardsHexStr(5), '02'],
  },
  '20-byte-exponent': {
    title: '20-Byte Exponent',
    values: ['03', countUpwardsHexStr(20), '02'],
  },
  '32-byte-exponent': {
    title: '32-Byte Exponent',
    values: ['03', countUpwardsHexStr(32), '02'],
  },
  '33-byte-exponent': {
    title: '33-Byte Exponent',
    values: ['03', countUpwardsHexStr(33), '02'],
  },
  '1024-byte-exponent': {
    title: '1024-Byte Exponent',
    values: ['03', countUpwardsHexStr(1024), '02'],
  },
  '1025-byte-exponent': {
    title: '1025-Byte Exponent (invalid with EIP-7823)',
    values: ['03', countUpwardsHexStr(1025), '02'],
  },
  'rsa-random-2048-bit': {
    title: 'Random RSA 2048-bit',
    values: [
      '657468657265756d',
      '010001',
      'a709e2f84ac0e21eb0caa018cf7f697f774e96f8115fc2359e9cf60b1dd8d4048d974cdf8422bef6be3c162b04b916f7ea2133f0e3e4e0eee164859bd9c1e0ef0357c142f4f633b4add4aab86c8f8895cd33fbf4e024d9a3ad6be6267570b4a72d2c34354e0139e74ada665a16a2611490debb8e131a6cffc7ef25e74240803dd71a4fcd953c988111b0aa9bbc4c57024fc5e8c4462ad9049c7f1abed859c63455fa6d58b5cc34a3d3206ff74b9e96c336dbacf0cdd18ed0c66796ce00ab07f36b24cbe3342523fd8215a8e77f89e86a08db911f237459388dee642dae7cb2644a03e71ed5c6fa5077cf4090fafa556048b536b879a88f628698f0c7b420c4b7',
    ],
  },
}
