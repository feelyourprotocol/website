import { describe, expect, it } from 'vitest'

import { EXPLORATIONS } from '@/explorations/REGISTRY'

import {
  catalogExplorationIds,
  catalogForkLabels,
  FEATURED_EXPLORATION_IDS,
  LATEST_COUNT,
  latestExplorationIds,
} from '../homeCatalog'

describe('homeCatalog', () => {
  it('takes the first three featured ids as Latest', () => {
    expect(latestExplorationIds()).toEqual(FEATURED_EXPLORATION_IDS.slice(0, LATEST_COUNT))
  })

  it('puts remaining featured ids in the catalog', () => {
    const catalog = catalogExplorationIds()
    expect(catalog).toEqual(FEATURED_EXPLORATION_IDS.slice(LATEST_COUNT))
    expect(catalog).not.toContain(FEATURED_EXPLORATION_IDS[0])
  })

  it('appends registry ids that are missing from featured', () => {
    const catalog = catalogExplorationIds(['eip-7708'])
    expect(catalog).not.toContain('eip-7708')
    expect(catalog.length).toBe(Object.keys(EXPLORATIONS).length - 1)
  })

  it('lists fork titles from live explorations', () => {
    expect(catalogForkLabels()).toEqual(['Fusaka', 'Glamsterdam'])
  })
})
