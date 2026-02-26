import { getTopicExplorationIds } from './REGISTRY'

export const TOPICS: Topics = {
  fusaka: {
    title: 'Fusaka',
    path: '/fusaka',
    url: 'https://forkcast.org/upgrade/fusaka',
    image: 'fusaka.webp',
    introText:
      "Fusaka is Ethereum's next major network upgrade following Pectra. " +
      'It brings significant changes to data availability with PeerDAS, adjusts precompile gas costs ' +
      'for ModExp, and introduces a new secp256r1 signature verification precompile enabling ' +
      'seamless wallet interactions from modern devices.',
    explorations: getTopicExplorationIds('fusaka'),
  },
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
