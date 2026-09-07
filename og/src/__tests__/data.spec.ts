import { describe, expect, it } from 'vitest'

import { readExplorationOgData } from '../data.ts'

describe('readExplorationOgData', () => {
  it('reads title and topic from canonical.ts when info.ts spreads CANONICAL', () => {
    const data = readExplorationOgData('eip-8037')
    expect(data.title).toBe('EIP-8037 State Creation Gas Cost Increase')
    expect(data.topicId).toBe('robustness')
    expect(data.specLabel).toBe('EIP-8037')
    expect(data.coverUrl).toContain('eip-8037/image.webp')
  })
})
