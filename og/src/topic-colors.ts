export type TopicColor = 'blue' | 'yellow' | 'green' | 'red' | 'orange' | 'purple'

export interface TopicPalette {
  /** Primary accent (Tailwind 500). */
  accent: string
  /** Light background tint (Tailwind 50). */
  bg: string
  /** Dark text on light bg (Tailwind 800). */
  text: string
  /** Badge background (Tailwind 100). */
  badgeBg: string
}

/** Hex values aligned with docs/contributing/images.md topic palettes. */
export const TOPIC_PALETTES: Record<TopicColor, TopicPalette> = {
  orange: {
    accent: '#f97316',
    bg: '#fff7ed',
    text: '#9a3412',
    badgeBg: '#ffedd5',
  },
  yellow: {
    accent: '#eab308',
    bg: '#fefce8',
    text: '#854d0e',
    badgeBg: '#fef9c3',
  },
  blue: {
    accent: '#3b82f6',
    bg: '#eff6ff',
    text: '#1e40af',
    badgeBg: '#dbeafe',
  },
  green: {
    accent: '#22c55e',
    bg: '#f0fdf4',
    text: '#166534',
    badgeBg: '#dcfce7',
  },
  purple: {
    accent: '#a855f7',
    bg: '#faf5ff',
    text: '#6b21a8',
    badgeBg: '#f3e8ff',
  },
  red: {
    accent: '#ef4444',
    bg: '#fef2f2',
    text: '#991b1b',
    badgeBg: '#fee2e2',
  },
}
