import type { Exploration } from '../REGISTRY'

export const INFO: Exploration = {
  id: 'eip-7883',
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
}
