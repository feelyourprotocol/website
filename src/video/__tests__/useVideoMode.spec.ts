import { describe, expect, it } from 'vitest'

import { FYP_VIDEO_QUERY_PARAM, isVideoModeQuery } from '../useVideoMode'

describe('isVideoModeQuery', () => {
  it('activates for fyp-video=1, true, or empty string', () => {
    expect(isVideoModeQuery({ [FYP_VIDEO_QUERY_PARAM]: '1' })).toBe(true)
    expect(isVideoModeQuery({ [FYP_VIDEO_QUERY_PARAM]: 'true' })).toBe(true)
    expect(isVideoModeQuery({ [FYP_VIDEO_QUERY_PARAM]: '' })).toBe(true)
  })

  it('is inactive when param is absent or other values', () => {
    expect(isVideoModeQuery({})).toBe(false)
    expect(isVideoModeQuery({ [FYP_VIDEO_QUERY_PARAM]: '0' })).toBe(false)
    expect(isVideoModeQuery({ [FYP_VIDEO_QUERY_PARAM]: 'false' })).toBe(false)
    expect(isVideoModeQuery({ example: 'dupn' })).toBe(false)
  })
})

describe('FYP_VIDEO_QUERY_PARAM', () => {
  it('is the documented query key', () => {
    expect(FYP_VIDEO_QUERY_PARAM).toBe('fyp-video')
  })
})
