import type { Exploration } from '@/explorations/REGISTRY'

import image from './image.webp'

export const INFO: Exploration = {
  id: 'custom-addition-precompile',
  path: '/custom-addition-precompile',
  title: 'Custom Addition Precompile',
  infoURL: 'https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm',
  topic: 'research',
  image,
  introText:
    '<b>Can you define your own precompile and run it in the EVM?</b> ' +
    'This exploration demonstrates the EthereumJS EVM ' +
    '<a href="https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/evm" target="_blank">custom precompile</a> ' +
    'feature. A simple addition precompile is registered at a custom address and executed ' +
    'through the standard EVM precompile call path — including gas metering.',
  usageText:
    'Enter two 32-byte unsigned integers (A and B). The custom precompile adds them together ' +
    'and returns the 32-byte result. Gas is charged at a flat rate of 15. Try values that ' +
    'overflow 256 bits to see wrapping behavior.',
  poweredBy: [
    { name: 'EthereumJS', href: 'https://github.com/ethereumjs/ethereumjs-monorepo' },
  ],
}
