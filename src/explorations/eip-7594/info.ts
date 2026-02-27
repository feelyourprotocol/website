import type { Exploration } from '../REGISTRY'
import image from './image.webp'

export const INFO: Exploration = {
  id: 'eip-7594',
  path: '/eip-7594-peerdas-data-availability-sampling',
  title: 'EIP-7594 Peer Data Availability Sampling',
  infoURL: 'https://eips.ethereum.org/EIPS/eip-7594',
  topics: ['fusaka'],
  image,
  introText:
    '<b>How do blob transactions change with PeerDAS?</b> ' +
    'Data availability sampling (DAS) - introduced along the Fusaka hardfork - comes with a new ' +
    'proof format for blobs, dividing the previous per-blob proofs into 128 cell proofs per blob. ' +
    'The network wrapper gets a new version 1 and the EIP-4844 blob transaction serialization ' +
    'format changes when submitting a blob transaction to the network. Libraries like ' +
    '<a href="https://github.com/ethers-io/ethers.js/issues/5062" target="_blank">Ethers</a> or ' +
    '<a href="https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/examples/blobTx.ts" target="_blank">EthereumJS</a> ' +
    'give some illustration.',
  usageText:
    'Below you can check if the values for versioned hashes, commitments and proofs (computed ' +
    'using Noble <a href="https://github.com/paulmillr/micro-eth-signer?tab=readme-ov-file#kzg--peerdas" target="_blank">micro-eth-signer</a>) ' +
    'match with your local values or values from blob explorers like ' +
    '<a href="https://blobscan.org/" target="_blank">Blobscan</a>.',
  poweredBy: [
    { name: 'Ethers', href: 'https://github.com/ethers-io/ethers.js' },
    { name: 'Noble Curves', href: 'https://github.com/paulmillr/noble-curves' },
    { name: 'EthereumJS', href: 'https://github.com/ethereumjs/ethereumjs-monorepo' },
  ],
}
