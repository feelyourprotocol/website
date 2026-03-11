import { getTopicExplorationIds } from './REGISTRY'

export type TopicColor = 'blue' | 'yellow' | 'green' | 'red'

interface TopicColorConfig {
  /**
   * Tailwind color name used to construct CSS custom properties, e.g. `var(--color-blue-300)`.
   * Kept separate from the class strings so `topicCSSVars` can build arbitrary shade references
   * without requiring every shade to appear as a static utility class.
   */
  tw: string
  /**
   * Static Tailwind utility class strings used as `:class` bindings in templates.
   * They must be static (not interpolated) so Tailwind's content scanner includes them.
   * `borderCard` uses a heavier shade for perceptually-light colors (yellow, green) to ensure
   * visibility on the white topic intro card background.
   */
  classes: {
    text: string
    bg: string
    border: string
    borderCard: string
  }
}

export const TOPIC_COLORS: Record<TopicColor, TopicColorConfig> = {
  blue: {
    tw: 'blue',
    classes: {
      text: 'text-blue-800',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      borderCard: 'border-blue-300',
    },
  },
  yellow: {
    tw: 'yellow',
    classes: {
      text: 'text-yellow-800',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      borderCard: 'border-yellow-500',
    },
  },
  green: {
    tw: 'green',
    classes: {
      text: 'text-green-800',
      bg: 'bg-green-50',
      border: 'border-green-200',
      borderCard: 'border-green-400',
    },
  },
  red: {
    tw: 'red',
    classes: {
      text: 'text-red-800',
      bg: 'bg-red-50',
      border: 'border-red-200',
      borderCard: 'border-red-400',
    },
  },
}

/**
 * CSS custom properties for topic-aware styling inside explorations.
 * Set on ExplorationC's root element; inherited by all child components.
 */
export function topicCSSVars(color: TopicColor): Record<string, string> {
  const c = TOPIC_COLORS[color].tw
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
  research: {
    title: 'Research',
    path: '/research',
    url: 'https://ethereum.org/en/community/research/',
    color: 'yellow',
    introText:
      'Experimental explorations showcasing custom EVM functionality, protocol research ideas, ' +
      'and proof-of-concept implementations beyond mainnet hardfork scope.',
    explorations: getTopicExplorationIds('research'),
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
