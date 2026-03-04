import { getTopicExplorationIds } from './REGISTRY'

export type TopicColor = 'blue' | 'yellow' | 'green' | 'red'

export const TOPIC_COLOR_CLASSES: Record<
  TopicColor,
  { bg200: string; text900: string; border200: string }
> = {
  blue: { bg200: 'bg-blue-50', text900: 'text-blue-800', border200: 'border-blue-200' },
  yellow: { bg200: 'bg-yellow-50', text900: 'text-yellow-800', border200: 'border-yellow-200' },
  green: { bg200: 'bg-green-50', text900: 'text-green-800', border200: 'border-green-200' },
  red: { bg200: 'bg-red-50', text900: 'text-red-800', border200: 'border-red-200' },
}

/**
 * CSS custom properties for topic-aware styling inside explorations.
 * Set on ExplorationC's root element; inherited by all child components.
 */
const CSS_COLOR_MAP: Record<TopicColor, string> = {
  blue: 'blue',
  yellow: 'yellow',
  green: 'green',
  red: 'red',
}

export function topicCSSVars(color: TopicColor): Record<string, string> {
  const c = CSS_COLOR_MAP[color]
  return {
    '--e-text': `var(--color-${c}-800)`,
    '--e-bg': `var(--color-${c}-100)`,
    '--e-bg-light': `var(--color-white)`,
    '--e-bg-medium': `var(--color-${c}-100)`,
    '--e-bg-dark': `var(--color-${c}-900)`,
    '--e-border': `var(--color-${c}-300)`,
    '--e-border-dark': `var(--color-${c}-800)`,
    '--e-accent': `var(--color-${c}-600)`,
  }
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
