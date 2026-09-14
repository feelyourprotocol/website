import { describe, expect, it } from 'vitest'

import { buildAuthUrl, googleErrorMessage, parseOAuthCallback } from '../oauth.ts'

describe('buildAuthUrl', () => {
  it('asks for a refresh token and both YouTube scopes', () => {
    const url = new URL(
      buildAuthUrl('client.apps.googleusercontent.com', 'http://127.0.0.1:9/oauth2callback', 'st'),
    )
    expect(url.origin).toBe('https://accounts.google.com')
    expect(url.searchParams.get('access_type')).toBe('offline')
    expect(url.searchParams.get('prompt')).toBe('consent')
    expect(url.searchParams.get('state')).toBe('st')
    expect(url.searchParams.get('scope')).toContain('youtube.upload')
    expect(url.searchParams.get('scope')).toContain('youtube')
    expect(url.searchParams.get('url')).toBeNull()
  })
})

describe('parseOAuthCallback', () => {
  it('returns the code when state matches', () => {
    expect(parseOAuthCallback('/oauth2callback?code=abc&state=st', 'st')).toBe('abc')
  })

  it('rejects a state mismatch or Google error', () => {
    expect(() => parseOAuthCallback('/oauth2callback?code=abc&state=nope', 'st')).toThrow(/state/)
    expect(() => parseOAuthCallback('/oauth2callback?error=access_denied&state=st', 'st')).toThrow(
      /access_denied/,
    )
  })
})

describe('googleErrorMessage', () => {
  it('prefers nested YouTube API messages without dumping bodies', () => {
    expect(
      googleErrorMessage({ error: { code: 403, message: 'The request cannot be completed' } }, 403),
    ).toBe('The request cannot be completed')
    expect(googleErrorMessage({ error: 'invalid_grant', error_description: 'Token expired' }, 400)).toBe(
      'invalid_grant (Token expired)',
    )
  })
})
