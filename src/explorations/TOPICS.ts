import { getTopicExplorationIds } from './REGISTRY'

export type TopicColor = 'blue' | 'yellow' | 'green' | 'red'

export const TOPIC_COLOR_CLASSES: Record<
  TopicColor,
  { bg200: string; text900: string; border200: string }
> = {
  blue: { bg200: 'bg-blue-50', text900: 'text-blue-800', border200: 'border-blue-200' },
  yellow: { bg200: 'bg-amber-50', text900: 'text-amber-800', border200: 'border-amber-200' },
  green: { bg200: 'bg-emerald-50', text900: 'text-emerald-800', border200: 'border-emerald-200' },
  red: { bg200: 'bg-rose-50', text900: 'text-rose-800', border200: 'border-rose-200' },
}

/**
 * CSS custom properties for topic-aware styling inside explorations.
 * Set on ExplorationC's root element; inherited by all child components.
 */
const CSS_COLOR_MAP: Record<TopicColor, string> = {
  blue: 'blue',
  yellow: 'amber',
  green: 'emerald',
  red: 'rose',
}

export function topicCSSVars(color: TopicColor): Record<string, string> {
  const c = CSS_COLOR_MAP[color]
  return {
    '--e-text': `var(--color-${c}-800)`,
    '--e-bg': `var(--color-${c}-50)`,
    '--e-bg-light': `var(--color-white)`,
    '--e-bg-medium': `var(--color-${c}-100)`,
    '--e-bg-dark': `var(--color-${c}-900)`,
    '--e-border': `var(--color-${c}-200)`,
    '--e-border-dark': `var(--color-${c}-800)`,
    '--e-accent': `var(--color-${c}-500)`,
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
