import type { Exploration } from '../REGISTRY'
import image from './image.webp'

export const INFO: Exploration = {
  id: 'eip-7951',
  path: '/eip-7951-secp256r1-precompile',
  title: 'EIP-7951 secp256r1 Precompile Support',
  infoURL: 'https://eips.ethereum.org/EIPS/eip-7951',
  topic: 'fusaka',
  image,
  introText:
    '<b>How can I interact with the new curve precompile?</b> The ' +
    '<a href="https://www.nervos.org/knowledge-base/what_is_secp256r1" target="_blank">secp256r1</a> ' +
    "(also know as P-256) precompile improves Ethereum's UX by allowing efficient " +
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
}
