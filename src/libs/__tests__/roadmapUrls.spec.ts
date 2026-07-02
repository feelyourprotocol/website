import { describe, expect, it } from 'vitest'

import { FYP_X_HANDLE, FYP_X_URL, ROADMAP_HOME, ROADMAP_ORIGIN, roadmapPage } from '@/libs/roadmapUrls'

describe('roadmapUrls', () => {
  it('ROADMAP_HOME points at roadmap index', () => {
    expect(ROADMAP_HOME).toBe('https://roadmap.feelyourprotocol.org/index.html')
  })

  it('roadmapPage builds slug paths', () => {
    expect(roadmapPage('monetization/token')).toBe(
      'https://roadmap.feelyourprotocol.org/monetization/token.html',
    )
  })

  it('roadmapPage supports hash fragments', () => {
    expect(roadmapPage('vision/problem-vision', 'the-problem')).toBe(
      'https://roadmap.feelyourprotocol.org/vision/problem-vision.html#the-problem',
    )
  })

  it('ROADMAP_ORIGIN is stable', () => {
    expect(ROADMAP_ORIGIN).toBe('https://roadmap.feelyourprotocol.org')
  })

  it('FYP_X_URL is the project handle', () => {
    expect(FYP_X_URL).toBe('https://x.com/FeelEthereum')
    expect(FYP_X_HANDLE).toBe('@FeelEthereum')
  })
})
