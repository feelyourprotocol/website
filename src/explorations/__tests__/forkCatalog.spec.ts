import { describe, expect, it } from 'vitest'

import {
  FORK_MASCOT_EMOJI,
  forkDisplayLabel,
  fypHardforkToggleOptions,
  MCP_FORK_IDS,
} from '@/explorations/forkCatalog'
import { TIMELINE } from '@/explorations/TIMELINE'

describe('forkCatalog mascots', () => {
  it('keeps TIMELINE emoji aligned with FORK_MASCOT_EMOJI', () => {
    for (const [id, entry] of Object.entries(TIMELINE)) {
      expect(entry.emoji).toBe(FORK_MASCOT_EMOJI[id as keyof typeof FORK_MASCOT_EMOJI])
    }
  })

  it('lists zebra and polar bear on hardfork toggles', () => {
    const labels = fypHardforkToggleOptions().map((row) => row.label)
    expect(labels).toEqual(['🐻‍❄️ Glamsterdam', '🦓 Fusaka'])
  })

  it('covers every mascot id in MCP_FORK_IDS', () => {
    const mascotIds = Object.keys(FORK_MASCOT_EMOJI).sort()
    expect(
      mascotIds.every((id) => MCP_FORK_IDS.includes(id as (typeof MCP_FORK_IDS)[number])),
    ).toBe(true)
    expect(forkDisplayLabel('pectra', 'Pectra')).toBe('🦒 Pectra')
  })
})
