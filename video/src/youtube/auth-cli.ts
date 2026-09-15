#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { join } from 'node:path'

import { loadVideoEnv } from '../loadEnv.ts'
import { buildAuthUrl, exchangeAuthCode, newOAuthState, parseOAuthCallback } from './oauth.ts'
import { upsertEnvValue } from './upsertEnv.ts'

const VIDEO_ROOT = join(import.meta.dirname, '../..')
const ENV_PATH = join(VIDEO_ROOT, '.env')
const SUCCESS_HTML =
  '<!doctype html><meta charset="utf-8"><title>Feel Your Protocol</title><p>YouTube access granted. You can close this tab and return to the terminal.</p>'

function openBrowser(url: string): void {
  spawn('open', [url], { stdio: 'ignore', detached: true }).unref()
}

async function listenForAuthorizationCode(opts: {
  clientId: string
  state: string
}): Promise<{ code: string; redirectUri: string }> {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      if (!req.url?.startsWith('/oauth2callback')) {
        res.statusCode = 404
        res.end()
        return
      }
      try {
        const code = parseOAuthCallback(req.url, opts.state)
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(SUCCESS_HTML)
        server.close()
        resolve({ code, redirectUri })
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        res.statusCode = 400
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(message)
        server.close()
        reject(err)
      }
    })

    let redirectUri = ''
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address()
      if (!addr || typeof addr === 'string') {
        server.close()
        reject(new Error('Failed to bind loopback OAuth callback'))
        return
      }
      redirectUri = `http://127.0.0.1:${addr.port}/oauth2callback`
      const authUrl = buildAuthUrl(opts.clientId, redirectUri, opts.state)
      console.log('Sign in as the Google account that owns the @FeelEthereum YouTube channel.')
      console.log('If you see a channel picker, choose Feel Your Protocol.')
      console.log('')
      console.log(authUrl)
      console.log('')
      openBrowser(authUrl)
    })

    const timer = setTimeout(() => {
      server.close()
      reject(
        new Error('Timed out waiting for Google sign-in (5 minutes). Re-run npm run video:youtube:auth.'),
      )
    }, 5 * 60 * 1000)
    server.on('close', () => clearTimeout(timer))
  })
}

async function main(): Promise<void> {
  loadVideoEnv()
  const clientId = process.env.YOUTUBE_CLIENT_ID?.trim()
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET?.trim()
  if (!clientId || !clientSecret) {
    console.error(
      'Missing YOUTUBE_CLIENT_ID or YOUTUBE_CLIENT_SECRET in video/.env. See video/YOUTUBE.md.',
    )
    process.exit(1)
  }

  const state = newOAuthState()
  const { code, redirectUri } = await listenForAuthorizationCode({ clientId, state })
  const tokens = await exchangeAuthCode({
    clientId,
    clientSecret,
    code,
    redirectUri,
    fetch,
  })
  upsertEnvValue(ENV_PATH, 'YOUTUBE_REFRESH_TOKEN', tokens.refreshToken)
  console.log('Wrote YOUTUBE_REFRESH_TOKEN to video/.env (value not printed).')
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
