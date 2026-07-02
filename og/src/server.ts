import { readFileSync, statSync } from 'node:fs'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { extname, join, normalize } from 'node:path'

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
}

/** Map a URL pathname to a file under `rootDir` (SPA-aware: `/` → index.html). */
export function resolveStaticFile(rootDir: string, pathname: string): string {
  const root = normalize(rootDir)
  const slug = pathname === '/' || pathname === '' ? 'index.html' : pathname.replace(/^\//, '')
  let file = normalize(join(root, slug))

  if (!file.startsWith(root)) {
    throw new Error('Path escapes static root')
  }

  try {
    if (statSync(file).isDirectory()) {
      file = join(file, 'index.html')
    }
  } catch {
    // Not found as-is — fall through to caller (404).
  }

  return file
}

export async function startStaticServer(rootDir: string): Promise<{ url: string; close: () => Promise<void> }> {
  const root = normalize(rootDir)

  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://local').pathname)
      const file = resolveStaticFile(root, pathname)
      if (!file.startsWith(root)) {
        res.writeHead(403)
        res.end('Forbidden')
        return
      }

      const body = readFileSync(file)
      const type = MIME[extname(file).toLowerCase()] ?? 'application/octet-stream'
      res.writeHead(200, { 'Content-Type': type, 'Content-Length': body.length })
      res.end(body)
    } catch {
      res.writeHead(404)
      res.end('Not found')
    }
  })

  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  if (!address || typeof address === 'string') {
    throw new Error('Failed to start static server')
  }

  return {
    url: `http://127.0.0.1:${address.port}`,
    close: () =>
      new Promise((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()))
      }),
  }
}

export function fileExists(path: string): boolean {
  try {
    return statSync(path).isFile()
  } catch {
    return false
  }
}
