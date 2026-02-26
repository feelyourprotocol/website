export const EXPLORATIONS: Explorations = {
  'eip-7594': {
    path: '/eip-7594-peerdas-data-availability-sampling',
    title: 'EIP-7594 Peer Data Availability Sampling',
    infoURL: 'https://eips.ethereum.org/EIPS/eip-7594',
    topics: ['fusaka'],
    image: 'fusaka.webp',
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
  },
  'eip-7883': {
    path: '/eip-7883-modexp-gas-cost-increase',
    title: 'EIP-7883 ModExp Gas Cost Increase',
    infoURL: 'https://eips.ethereum.org/EIPS/eip-7883',
    topics: ['fusaka'],
    image: 'precompiles.webp',
    introText:
      '<b>How are ModExp gas costs changing with Fusaka?</b> ' +
      'EIP-7883 changes the gas calculation algorithm of the ModExp precompile.',
    usageText:
      'Especially interesting to explore are values around 32 bytes. Also take note of the new base ' +
      'costs. A major use case in smart contracts is to verify RSA signatures, e.g. in the context ' +
      'of airdrops. You can find a realistic RSA value setup in the examples. The widget also ' +
      'respects the new ModExp value boundaries set with EIP-7823 (also Fusaka).',
    poweredBy: [
      { name: 'EthereumJS', href: 'https://github.com/ethereumjs/ethereumjs-monorepo' },
    ],
  },
  'eip-7951': {
    path: '/eip-7951-secp256r1-precompile',
    title: 'EIP-7951 secp256r1 Precompile Support',
    infoURL: 'https://eips.ethereum.org/EIPS/eip-7951',
    topics: ['fusaka'],
    image: 'precompiles.webp',
    introText:
      '<b>How can I interact with the new curve precompile?</b> The ' +
      '<a href="https://www.nervos.org/knowledge-base/what_is_secp256r1" target="_blank">secp256r1</a> ' +
      '(also know as P-256) precompile improves Ethereum\'s UX by allowing efficient ' +
      'in-contract-signature verification (e.g. for multisig wallets) from ' +
      '<a href="https://developer.apple.com/documentation/cryptokit/p256" target="_blank">Apple</a> and ' +
      '<a href="https://developer.android.com/privacy-and-security/keystore" target="_blank">Android</a> ' +
      'devices as well as <a href="https://webauthn.io/" target="_blank">FIDO2/WebAuthn</a> supporting browsers.',
    usageText:
      'The interface below lets you explore how to directly interact with the precompile (at ' +
      'address <code>0x100</code>). You can use libraries like ' +
      '<a href="https://github.com/paulmillr/noble-curves?tab=readme-ov-file#secp256k1-p256-p384-p521-ed25519-ed448-brainpool" target="_blank">Noble Curves</a> ' +
      'to generate a valid signature to test - see ' +
      '<a href="https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm#eip-7951-precompile-for-secp256r1-curve-support-osaka" target="_blank">here</a> ' +
      'for example code - or use one of the examples provided. The precompile will return ' +
      '<code>0x01</code> (as 32-bytes) if the signature is valid.',
    poweredBy: [
      { name: 'Noble Curves', href: 'https://github.com/paulmillr/noble-curves' },
      { name: 'EthereumJS', href: 'https://github.com/ethereumjs/ethereumjs-monorepo' },
    ],
  },
}

export const TOPICS: Topics = {
  fusaka: {
    title: 'Fusaka',
    path: '/fusaka',
    url: 'https://forkcast.org/upgrade/fusaka',
    image: 'fusaka.webp',
    introText:
      'Fusaka is Ethereum\'s next major network upgrade following Pectra. ' +
      'It brings significant changes to data availability with PeerDAS, adjusts precompile gas costs ' +
      'for ModExp, and introduces a new secp256r1 signature verification precompile enabling ' +
      'seamless wallet interactions from modern devices.',
    explorations: getTopicExplorationIds('fusaka'),
  },
}

export interface PoweredByItem {
  name: string
  href: string
}

export interface Exploration {
  path: string
  title: string
  infoURL: string
  topics?: string[]
  image?: string
  introText?: string
  usageText?: string
  poweredBy?: PoweredByItem[]
}
export interface Explorations {
  [key: string]: Exploration
}

export interface Topic {
  title: string
  path: string
  url: string
  image?: string
  introText?: string
  explorations: string[]
}
export interface Topics {
  [key: string]: Topic
}

export function getTopicExplorationIds(topicId: string): string[] {
  const ids: string[] = []
  for (const [id, exploration] of Object.entries(EXPLORATIONS)) {
    if (exploration.topics?.includes(topicId)) {
      ids.push(id)
    }
  }
  return ids
}
