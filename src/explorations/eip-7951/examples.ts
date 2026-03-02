import { type Examples } from '@/components/lib/general.js'

export const examples: Examples = {
  valid: {
    title: 'Valid ("Hello Fusaka!")',
    values: [
      '4dfb1eae8ed41e188b8a44a1109d982d01fc24bb85a933e6283e8838e46942fd',
      'eb3dc5ce2902f162745057efb7a3308eba992c0d843623603516845ffccd3f10',
      '3b91fedfb22f40063245c621036a040c159f02ae02e6d450ff9b53235e9232c4',
      'bfa6d0a419b5bc625939cccb8db65a16f7c30c697928660e9da53eda031e80fa',
      'db5998a893f9b8971a3892aecd132c0eca1bc9622e542f428d8129222f26bdc5',
    ],
  },
  'invalid-sig-r': {
    title: 'Invalid ("Hello Fusaka!"), modified sigR value',
    values: [
      '4dfb1eae8ed41e188b8a44a1109d982d01fc24bb85a933e6283e8838e46942fd',
      'ee3dc5ce2902f162745057efb7a3308eba992c0d843623603516845ffccd3f10',
      '3b91fedfb22f40063245c621036a040c159f02ae02e6d450ff9b53235e9232c4',
      'bfa6d0a419b5bc625939cccb8db65a16f7c30c697928660e9da53eda031e80fa',
      'db5998a893f9b8971a3892aecd132c0eca1bc9622e542f428d8129222f26bdc5',
    ],
  },
  'invalid-sig-0': {
    title: 'Invalid ("Hello Fusaka!"), sigR and sigS values 0',
    values: [
      '4dfb1eae8ed41e188b8a44a1109d982d01fc24bb85a933e6283e8838e46942fd',
      '0000000000000000000000000000000000000000000000000000000000000000',
      '0000000000000000000000000000000000000000000000000000000000000000',
      'bfa6d0a419b5bc625939cccb8db65a16f7c30c697928660e9da53eda031e80fa',
      'db5998a893f9b8971a3892aecd132c0eca1bc9622e542f428d8129222f26bdc5',
    ],
  },
  'valid-wycheproof-special-case-hash': {
    title: 'Valid (Wycheproof), special case hash',
    values: [
      '00000000690ed426ccf17803ebe2bd0884bcd58a1bb5e7477ead3645f356e7a9',
      '16aea964a2f6506d6f78c81c91fc7e8bded7d397738448de1e19a0ec580bf266',
      '252cd762130c6667cfe8b7bc47d27d78391e8e80c578d1cd38c3ff033be928e9',
      '2927b10512bae3eddcfe467828128bad2903269919f7086069c8c4df6c732838',
      'c7787964eaac00e5921fb1498a60f4606766b3d9685001558d1a974e7341513e',
    ],
  },
  'invalid-wycheproof-r-too-large': {
    title: 'Invalid (Wycheproof), r value too large',
    values: [
      '532eaabd9574880dbf76b9b8cc00832c20a6ec113d682299550d7a6e0f345e25',
      'ffffffff00000001000000000000000000000000fffffffffffffffffffffffc',
      'ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc63254e',
      'd705d16f80987e2d9b1a6957d29ce22febf7d10fa515153182415c8361baaca4',
      'b1fc105ee5ce80d514ec1238beae2037a6f83625593620d460819e8682160926',
    ],
  },
}
