import { describe, expect, it } from 'vitest'

import type { ProtocolChangeCanonical } from '@/explorations/canonicalTypes'
import { MCP_FORK_IDS } from '@/explorations/forkCatalog'
import { EXPLORATIONS } from '@/explorations/REGISTRY'
import { TIMELINE } from '@/explorations/TIMELINE'
import { TOPIC_IDS } from '@/explorations/topicIds'
import { TOPICS } from '@/explorations/TOPICS'

describe('canonical taxonomy ids', () => {
  it('maps every TOPIC_IDS entry to TOPICS', () => {
    for (const id of TOPIC_IDS) {
      expect(TOPICS[id]).toBeDefined()
    }
  })

  it('keeps live explorations on known topic and timeline pills', () => {
    for (const exploration of Object.values(EXPLORATIONS)) {
      expect(TOPIC_IDS).toContain(exploration.topic)
      expect(Object.keys(TIMELINE)).toContain(exploration.timeline)
    }
  })

  it('pins Glamsterdam spec URLs to GitHub EIP commits and a test release', async () => {
    const modules = import.meta.glob('../eip-*/canonical.ts', { eager: true }) as Record<
      string,
      { CANONICAL: ProtocolChangeCanonical }
    >
    for (const mod of Object.values(modules)) {
      const { identity, taxonomy } = mod.CANONICAL
      if (taxonomy.timeline !== 'glamsterdam') continue
      expect(identity.specUrl).toMatch(
        /^https:\/\/github\.com\/ethereum\/EIPs\/blob\/[0-9a-f]{40}\/EIPS\/eip-\d+\.md$/,
      )
      expect(identity.status).toBeTruthy()
      expect(identity.specDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(identity.testReleaseUrl).toContain('tests-glamsterdam-devnet@v8.1.0')
    }
  })

  it('documents MCP fork ids for drift checks (engine lineage mirror)', () => {
    expect(MCP_FORK_IDS).toContain('fusaka')
    expect(MCP_FORK_IDS).toContain('glamsterdam')
  })
})
