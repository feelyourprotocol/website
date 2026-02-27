import { getTopicExplorationIds } from './REGISTRY'

export type TopicColor = 'blue' | 'yellow' | 'green' | 'red'

export const TOPIC_COLOR_CLASSES: Record<
  TopicColor,
  { bg200: string; text900: string; border200: string }
> = {
  blue: { bg200: 'bg-blue-200', text900: 'text-blue-900', border200: 'border-blue-200' },
  yellow: { bg200: 'bg-yellow-200', text900: 'text-yellow-900', border200: 'border-yellow-200' },
  green: { bg200: 'bg-green-200', text900: 'text-green-900', border200: 'border-green-200' },
  red: { bg200: 'bg-red-200', text900: 'text-red-900', border200: 'border-red-200' },
}

export const TOPICS: Topics = {
  fusaka: {
    title: 'Fusaka',
    path: '/fusaka',
    url: 'https://forkcast.org/upgrade/fusaka',
    color: 'blue',
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
  color: TopicColor
  introText?: string
  explorations: string[]
}
export interface Topics {
  [key: string]: Topic
}
