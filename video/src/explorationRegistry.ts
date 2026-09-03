import type { VideoTheme } from './types.ts'

export interface ExplorationMeta {
  path: string
  topic: keyof typeof TOPIC_THEMES
}

/** Known explorations for video projects (path + topic palette). */
export const EXPLORATION_REGISTRY: Record<string, ExplorationMeta> = {
  'eip-8024': {
    path: '/eip-8024-stack-opcodes-dupn-swapn-exchange',
    topic: 'robustness',
  },
  'eip-7928': {
    path: '/eip-7928-block-level-access-lists',
    topic: 'security',
  },
  'eip-7883': {
    path: '/eip-7883-modexp-gas-cost-increase',
    topic: 'robustness',
  },
  'eip-7951': {
    path: '/eip-7951-secp256r1-precompile',
    topic: 'interoperability',
  },
  'eip-7594': {
    path: '/eip-7594-peerdas-data-availability-sampling',
    topic: 'scaling',
  },
  'eip-7708': {
    path: '/eip-7708-eth-transfer-logs',
    topic: 'ux',
  },
}

/** Topic → overlay theme (aligned with og/src/topic-colors.ts). */
export const TOPIC_THEMES: Record<string, VideoTheme> = {
  scaling: { accent: '#3b82f6', bg: '#eff6ff', text: '#1e40af', badgeBg: '#dbeafe' },
  privacy: { accent: '#22c55e', bg: '#f0fdf4', text: '#166534', badgeBg: '#dcfce7' },
  ux: { accent: '#eab308', bg: '#fefce8', text: '#854d0e', badgeBg: '#fef9c3' },
  security: { accent: '#ef4444', bg: '#fef2f2', text: '#991b1b', badgeBg: '#fee2e2' },
  robustness: { accent: '#a855f7', bg: '#faf5ff', text: '#6b21a8', badgeBg: '#f3e8ff' },
  interoperability: { accent: '#f97316', bg: '#fff7ed', text: '#9a3412', badgeBg: '#ffedd5' },
}

export function getExplorationMeta(explorationId: string): ExplorationMeta {
  const meta = EXPLORATION_REGISTRY[explorationId]
  if (!meta) {
    throw new Error(`Unknown exploration id for video: ${explorationId}`)
  }
  return meta
}

export function themeForExploration(explorationId: string): VideoTheme {
  const meta = getExplorationMeta(explorationId)
  return TOPIC_THEMES[meta.topic]!
}
