import { randomBytes } from 'node:crypto'

import { YOUTUBE_SCOPES } from './types.ts'

const AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth'
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'

export function newOAuthState(): string {
  return randomBytes(16).toString('hex')
}

export function buildAuthUrl(clientId: string, redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    state,
    scope: YOUTUBE_SCOPES.join(' '),
  })
  return `${AUTH_ENDPOINT}?${params.toString()}`
}

export function parseOAuthCallback(requestUrl: string, expectedState: string): string {
  const url = new URL(requestUrl, 'http://127.0.0.1')
  const err = url.searchParams.get('error')
  if (err) {
    const desc = url.searchParams.get('error_description')
    throw new Error(desc ? `Google OAuth error: ${err} (${desc})` : `Google OAuth error: ${err}`)
  }
  const state = url.searchParams.get('state')
  if (!state || state !== expectedState) {
    throw new Error('Google OAuth state mismatch — retry npm run video:youtube:auth')
  }
  const code = url.searchParams.get('code')
  if (!code) {
    throw new Error('Google OAuth callback missing code')
  }
  return code
}

export async function exchangeAuthCode(opts: {
  clientId: string
  clientSecret: string
  code: string
  redirectUri: string
  fetch: typeof fetch
}): Promise<{ refreshToken: string; accessToken: string }> {
  const body = new URLSearchParams({
    client_id: opts.clientId,
    client_secret: opts.clientSecret,
    code: opts.code,
    redirect_uri: opts.redirectUri,
    grant_type: 'authorization_code',
  })
  const json = await postToken(opts.fetch, body)
  const refreshToken = json.refresh_token
  const accessToken = json.access_token
  if (typeof refreshToken !== 'string' || !refreshToken) {
    throw new Error(
      'Google did not return a refresh token. Revoke Feel Your Protocol access at https://myaccount.google.com/permissions and run auth again.',
    )
  }
  if (typeof accessToken !== 'string' || !accessToken) {
    throw new Error('Google token response missing access_token')
  }
  return { refreshToken, accessToken }
}

export async function refreshAccessToken(opts: {
  clientId: string
  clientSecret: string
  refreshToken: string
  fetch: typeof fetch
}): Promise<string> {
  const body = new URLSearchParams({
    client_id: opts.clientId,
    client_secret: opts.clientSecret,
    refresh_token: opts.refreshToken,
    grant_type: 'refresh_token',
  })
  const json = await postToken(opts.fetch, body)
  if (typeof json.access_token !== 'string' || !json.access_token) {
    throw new Error('Google token refresh missing access_token')
  }
  return json.access_token
}

async function postToken(
  fetchImpl: typeof fetch,
  body: URLSearchParams,
): Promise<Record<string, unknown>> {
  const res = await fetchImpl(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  const text = await res.text()
  let json: Record<string, unknown> = {}
  try {
    json = JSON.parse(text) as Record<string, unknown>
  } catch {
    json = {}
  }
  if (!res.ok) {
    throw new Error(`YouTube token HTTP ${res.status}: ${googleErrorMessage(json, res.status)}`)
  }
  return json
}

export function googleErrorMessage(json: Record<string, unknown>, status: number): string {
  const nested = json.error
  if (nested && typeof nested === 'object') {
    const obj = nested as { message?: unknown; errors?: unknown }
    if (typeof obj.message === 'string' && obj.message) return obj.message
  }
  if (typeof json.error === 'string') {
    const desc = json.error_description
    return typeof desc === 'string' && desc ? `${json.error} (${desc})` : json.error
  }
  if (typeof json.error_description === 'string') return json.error_description
  return `request failed (${status})`
}
