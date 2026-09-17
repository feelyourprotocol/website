import { describe, expect, it } from 'vitest'

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

  it('documents MCP fork ids for drift checks (engine lineage mirror)', () => {
    expect(MCP_FORK_IDS).toContain('fusaka')
    expect(MCP_FORK_IDS).toContain('glamsterdam')
  })
})
