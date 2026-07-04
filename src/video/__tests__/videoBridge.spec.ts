import { describe, expect, it, vi } from 'vitest'

import type { VideoContentConfig } from '../types'
import {
  createVideoBridge,
  resolveActiveHighlightSet,
  resolveActiveOverlay,
  type VideoBridgeHandlers,
} from '../videoBridge'

const sampleConfig: VideoContentConfig = {
  explorationId: 'eip-8024',
  overlays: {
    hook: {
      id: 'hook',
      type: 'title',
      lines: ['EIP-8024'],
      question: 'Stack too deep?',
    },
  },
  highlightSets: {
    'dupn-windup': {
      id: 'dupn-windup',
      marks: [{ target: 'stack-depth-17' }],
    },
  },
}

describe('resolveActiveOverlay', () => {
  it('returns null when config or id is missing', () => {
    expect(resolveActiveOverlay(undefined, 'hook')).toBeNull()
    expect(resolveActiveOverlay(sampleConfig, null)).toBeNull()
  })

  it('returns null for unknown overlay id', () => {
    expect(resolveActiveOverlay(sampleConfig, 'missing')).toBeNull()
  })

  it('returns active overlay for known id', () => {
    const active = resolveActiveOverlay(sampleConfig, 'hook')
    expect(active?.id).toBe('hook')
    expect(active?.definition.type).toBe('title')
  })
})

describe('resolveActiveHighlightSet', () => {
  it('returns null when config or id is missing', () => {
    expect(resolveActiveHighlightSet(undefined, 'dupn-windup')).toBeNull()
    expect(resolveActiveHighlightSet(sampleConfig, null)).toBeNull()
  })

  it('returns active highlight set for known id', () => {
    const active = resolveActiveHighlightSet(sampleConfig, 'dupn-windup')
    expect(active?.id).toBe('dupn-windup')
    expect(active?.marks).toHaveLength(1)
  })
})

describe('createVideoBridge', () => {
  it('delegates show/hide to handlers and reports ready state', async () => {
    const handlers: VideoBridgeHandlers = {
      onShowOverlay: vi.fn(),
      onHideOverlay: vi.fn(),
      onShowAnnotation: vi.fn(),
      onHideAnnotation: vi.fn(),
      onShowHighlightSet: vi.fn(),
      onHideHighlights: vi.fn(),
      isReady: vi.fn(() => true),
    }
    const bridge = createVideoBridge(handlers)

    await bridge.showOverlay('hook', { placement: 'top-banner' })
    expect(handlers.onShowOverlay).toHaveBeenCalledWith('hook', { placement: 'top-banner' })

    await bridge.hideOverlay()
    expect(handlers.onHideOverlay).toHaveBeenCalled()

    await bridge.showAnnotation('guide-stack')
    expect(handlers.onShowAnnotation).toHaveBeenCalledWith('guide-stack')

    await bridge.hideAnnotation()
    expect(handlers.onHideAnnotation).toHaveBeenCalled()

    await bridge.showHighlightSet('dupn-windup')
    expect(handlers.onShowHighlightSet).toHaveBeenCalledWith('dupn-windup')

    await bridge.hideHighlights()
    expect(handlers.onHideHighlights).toHaveBeenCalled()

    expect(bridge.ready()).toBe(true)
  })

  it('wait resolves after the requested delay', async () => {
    vi.useFakeTimers()
    const bridge = createVideoBridge({
      onShowOverlay: vi.fn(),
      onHideOverlay: vi.fn(),
      onShowAnnotation: vi.fn(),
      onHideAnnotation: vi.fn(),
      onShowHighlightSet: vi.fn(),
      onHideHighlights: vi.fn(),
      isReady: () => true,
    })

    const pending = bridge.wait(500)
    vi.advanceTimersByTime(500)
    await expect(pending).resolves.toBeUndefined()
    vi.useRealTimers()
  })
})
