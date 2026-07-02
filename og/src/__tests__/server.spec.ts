import { describe, expect, it } from 'vitest'

import { resolveStaticFile } from '../server.ts'

describe('resolveStaticFile', () => {
  const root = '/tmp/fyp-social/dist'

  it('maps / to index.html', () => {
    expect(resolveStaticFile(root, '/')).toBe(`${root}/index.html`)
  })

  it('maps empty path to index.html', () => {
    expect(resolveStaticFile(root, '')).toBe(`${root}/index.html`)
  })

  it('maps asset paths without double root', () => {
    expect(resolveStaticFile(root, '/assets/index.js')).toBe(`${root}/assets/index.js`)
  })

  it('rejects path traversal', () => {
    expect(() => resolveStaticFile(root, '/../secret')).toThrow(/escapes static root/)
  })
})
