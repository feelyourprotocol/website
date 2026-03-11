import { getTopicExplorationIds } from './REGISTRY'

export type TopicColor = 'blue' | 'yellow' | 'green' | 'red'

interface TopicColorConfig {
  /**
   * Static Tailwind utility class strings serving a dual purpose:
   *
   * 1. Used as `:class` bindings in templates (e.g. `borderCard` on TopicIntroView).
   * 2. **Must cover every shade referenced by `topicCSSVars`** so Tailwind's content
   *    scanner emits the corresponding `--color-*` CSS variable. Since `topicCSSVars`
   *    uses string interpolation (invisible to the scanner), the classes here are the
   *    only anchor that keeps those CSS variables alive in the build output.
   *
   * Shade coverage required by `topicCSSVars`: 100 (`bg`), 300 (`borderMid`),
   * 600 (`accent`), 800 (`text`), 900 (`bgDark`). All others are for template use.
   */
  classes: {
    /** Exploration heading text; anchors --color-*-800. */
    text: string
    /** Very subtle item background (e.g. inside exploration sidebar). */
    bgItem: string
    /** Main exploration card fill; anchors --color-*-100 for --e-bg / --e-bg-medium. */
    bg: string
    /** Dark result-box fill; anchors --color-*-900 for --e-bg-dark. */
    bgDark: string
    /** Subtle item borders. */
    border: string
    /** Standard border on coloured backgrounds; anchors --color-*-300 for --e-border. */
    borderMid: string
    /**
     * Card border on white/neutral page background.
     * Uses a heavier shade for perceptually-light colours (yellow, green)
     * so the border is clearly visible against white.
     */
    borderCard: string
    /** Accent / interactive-focus colour; anchors --color-*-600 for --e-accent. */
    accent: string
  }
}

export const TOPIC_COLORS: Record<TopicColor, TopicColorConfig> = {
  blue: {
    classes: {
      text: 'text-blue-800',
      bgItem: 'bg-blue-50',
      bg: 'bg-blue-100',
      bgDark: 'bg-blue-900',
      border: 'border-blue-200',
      borderMid: 'border-blue-300',
      borderCard: 'border-blue-300',
      accent: 'text-blue-600',
    },
  },
  yellow: {
    classes: {
      text: 'text-yellow-800',
      bgItem: 'bg-yellow-50',
      bg: 'bg-yellow-100',
      bgDark: 'bg-yellow-900',
      border: 'border-yellow-200',
      borderMid: 'border-yellow-300',
      borderCard: 'border-yellow-500',
      accent: 'text-yellow-600',
    },
  },
  green: {
    classes: {
      text: 'text-green-800',
      bgItem: 'bg-green-50',
      bg: 'bg-green-100',
      bgDark: 'bg-green-900',
      border: 'border-green-200',
      borderMid: 'border-green-300',
      borderCard: 'border-green-400',
      accent: 'text-green-600',
    },
  },
  red: {
    classes: {
      text: 'text-red-800',
      bgItem: 'bg-red-50',
      bg: 'bg-red-100',
      bgDark: 'bg-red-900',
      border: 'border-red-200',
      borderMid: 'border-red-300',
      borderCard: 'border-red-400',
      accent: 'text-red-600',
    },
  },
}

/**
 * Derives a CSS `var(--color-*)` reference from a Tailwind utility class string.
 * E.g. `'bg-yellow-100'` → `'var(--color-yellow-100)'`.
 * The class string must end in `-{colorName}-{shade}`.
 */
function classToVar(cls: string): string {
  const match = cls.match(/-([\w]+-\d+)$/)
  if (!match) throw new Error(`Cannot derive CSS variable from Tailwind class: ${cls}`)
  return `var(--color-${match[1]})`
}

/**
 * CSS custom properties for topic-aware styling inside explorations.
 * Set on ExplorationC's root element; inherited by all child components.
 * Values are derived from `TOPIC_COLORS[color].classes` so the scanner-visible
 * class strings and the runtime CSS vars always stay in sync.
 */
export function topicCSSVars(color: TopicColor): Record<string, string> {
  const c = TOPIC_COLORS[color].classes
  return {
    '--e-text': classToVar(c.text),
    '--e-bg': classToVar(c.bg),
    '--e-bg-light': 'var(--color-white)',
    '--e-bg-medium': classToVar(c.bg),
    '--e-bg-dark': classToVar(c.bgDark),
    '--e-border': classToVar(c.borderMid),
    '--e-border-dark': classToVar(c.text),
    '--e-accent': classToVar(c.accent),
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
