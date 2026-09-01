import type { Exploration } from '@/explorations/REGISTRY'

import { CANONICAL } from './canonical'
import image from './image.webp'
import imageSmall from './image_small.webp'

export const INFO: Exploration = {
  id: CANONICAL.identity.id,
  path: '/eip-7951-secp256r1-precompile',
  title: CANONICAL.identity.name,
  seoDescription:
    'EIP-7951 secp256r1 precompile — try passkey-friendly signature verification on Ethereum with an interactive precompile demo.',
  infoURL: CANONICAL.identity.specUrl,
  topic: CANONICAL.taxonomy.topic,
  timeline: CANONICAL.taxonomy.timeline,
  tags: CANONICAL.taxonomy.tags,
  image,
  imageSmall,
  coreQuestion: CANONICAL.question.coreQuestion,
  mcpDocsStatus: CANONICAL.mcp.docsStatus,
  introText:
    `<b>${CANONICAL.question.coreQuestion}</b> ` +
    'The curve (also known as P-256) is the native signing algorithm on ' +
    '<a href="https://developer.apple.com/documentation/cryptokit/p256" target="_blank">Apple</a> ' +
    'and <a href="https://developer.android.com/privacy-and-security/keystore" target="_blank">Android</a> ' +
    'devices and in ' +
    '<a href="https://webauthn.io/" target="_blank">FIDO2/WebAuthn</a> browsers. ' +
    'EIP-7951 exposes it at precompile address <code>0x100</code> so contracts can verify these ' +
    'signatures on-chain — useful for passkey-backed wallets and multisig flows.',
  usageText:
    'Select an example or paste a valid signature payload into the input fields, then run the ' +
    'precompile. A valid signature returns <code>0x01</code> (32 bytes). Invalid examples show ' +
    'how verification fails. To generate your own test vectors, see ' +
    '<a href="https://github.com/paulmillr/noble-curves?tab=readme-ov-file#secp256k1-p256-p384-p521-ed25519-ed448-brainpool" target="_blank">Noble Curves</a> ' +
    'or the ' +
    '<a href="https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm#eip-7951-precompile-for-secp256r1-curve-support-osaka" target="_blank">EthereumJS example</a>.',
  creatorName: 'HolgerD77',
  creatorURL: 'https://x.com/HolgerD77',
  poweredBy: [
    { name: 'Noble', href: 'https://github.com/paulmillr/noble-curves' },
    { name: 'EthereumJS', href: 'https://github.com/ethereumjs/ethereumjs-monorepo' },
  ],
}
