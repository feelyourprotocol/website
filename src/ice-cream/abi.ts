export const iceCreamStandAbi = [
  {
    type: 'function',
    name: 'buyScoop',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'hasMinted',
    stateMutability: 'view',
    inputs: [
      { name: 'buyer', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'error',
    name: 'AlreadyScooped',
    inputs: [
      { name: 'buyer', type: 'address' },
      { name: 'tokenId', type: 'uint256' },
    ],
  },
  {
    type: 'error',
    name: 'UnknownFlavor',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
  },
  {
    type: 'error',
    name: 'SoulboundTransferNotAllowed',
    inputs: [],
  },
] as const
