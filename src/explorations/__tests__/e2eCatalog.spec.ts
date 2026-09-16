import { describe, expect, it } from 'vitest'

import {
  E2E_EXPLORATIONS,
  E2E_FAMILIES,
  E2E_FAMILY_PLAY,
  E2E_LAYOUT,
  e2eExploration,
  type E2eFamily,
} from '@/explorations/e2eCatalog'
import { EXPLORATIONS } from '@/explorations/REGISTRY'

describe('e2eCatalog', () => {
  it('covers every live registry id and no extras', () => {
    const catalogIds = E2E_EXPLORATIONS.map((row) => row.id).sort()
    const registryIds = Object.keys(EXPLORATIONS).sort()
    expect(catalogIds).toEqual(registryIds)
  })

  it('keeps path in sync with REGISTRY', () => {
    for (const row of E2E_EXPLORATIONS) {
      expect(EXPLORATIONS[row.id]!.path).toBe(row.path)
    }
  })

  it('uses only known families, with one play representative each', () => {
    const catalogFamilies = new Set(E2E_EXPLORATIONS.map((row) => row.family))
    expect([...catalogFamilies].sort()).toEqual([...E2E_FAMILIES].sort())

    const playFamilies = E2E_FAMILY_PLAY.map((play) => play.family).sort()
    expect(playFamilies).toEqual([...E2E_FAMILIES].sort())
    expect(new Set(playFamilies).size).toBe(E2E_FAMILIES.length)
  })

  it('points family play at a matching catalog row that is allowed to execute', () => {
    for (const play of E2E_FAMILY_PLAY) {
      const row = e2eExploration(play.id)
      expect(row.family).toBe(play.family)
      expect(row.skipExecute).toBeFalsy()
    }
  })

  it('marks skip-execute rows so Cypress never treats them as family play', () => {
    const skipIds = E2E_EXPLORATIONS.filter((row) => row.skipExecute).map((row) => row.id)
    expect(skipIds).toContain('eip-7594')
    const playIds = new Set(E2E_FAMILY_PLAY.map((play) => play.id))
    for (const id of skipIds) {
      expect(playIds.has(id)).toBe(false)
    }
  })

  it('picks layout representatives that exist and match their chrome', () => {
    const touch = e2eExploration(E2E_LAYOUT.touchChromeId)
    expect(touch.family).toBe('scenario')

    const companion = e2eExploration(E2E_LAYOUT.companionId)
    expect(EXPLORATIONS[companion.id]!.rightPanel).toBe(true)
  })

  it('types every catalog family as an E2eFamily', () => {
    const families: E2eFamily[] = E2E_EXPLORATIONS.map((row) => row.family)
    expect(families.every((family) => (E2E_FAMILIES as readonly string[]).includes(family))).toBe(
      true,
    )
  })
})
