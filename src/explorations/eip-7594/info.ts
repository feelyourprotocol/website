import type { Exploration } from '@/explorations/REGISTRY'
import { Tag } from '@/explorations/TAGS'

import image from './image.webp'
import imageSmall from './image_small.webp'

export const INFO: Exploration = {
  id: 'eip-7594',
  path: '/eip-7594-peerdas-data-availability-sampling',
  title: 'EIP-7594 Peer Data Availability Sampling',
  seoDescription:
    'Interactive PeerDAS explainer for EIP-7594 — Ethereum data availability sampling with real cryptography in your browser.',
  infoURL: 'https://eips.ethereum.org/EIPS/eip-7594',
  topic: 'scaling',
  timeline: 'fusaka',
  tags: [Tag.PeerDAS],
  image,
  imageSmall,
  introText:
    '<b>How do blob transactions change with PeerDAS?</b> ' +
    'With the Fusaka hardfork, data availability sampling (DAS) replaces single blob proofs with ' +
    '128 cell proofs per blob. Blob transactions get a new network wrapper (version 1) and an ' +
    'updated EIP-4844 serialization format on the wire.',
  usageText:
    'Choose a real blob from the examples (or paste your own hex), then press ' +
    '<b>COMMIT/PROOF/RUN</b>. Compare the commitment, versioned hash, blob proof, and cell proofs ' +
    'against your local tooling or explorers like ' +
    '<a href="https://blobscan.org/" target="_blank">Blobscan</a>. ' +
    'Proofs are computed with Noble ' +
    '<a href="https://github.com/paulmillr/micro-eth-signer?tab=readme-ov-file#kzg--peerdas" target="_blank">micro-eth-signer</a>.',
  creatorName: 'HolgerD77',
  creatorURL: 'https://x.com/HolgerD77',
  poweredBy: [
    { name: 'Ethers', href: 'https://github.com/ethers-io/ethers.js' },
    { name: 'Noble', href: 'https://github.com/paulmillr/noble-curves' },
    { name: 'EthereumJS', href: 'https://github.com/ethereumjs/ethereumjs-monorepo' },
  ],
}
