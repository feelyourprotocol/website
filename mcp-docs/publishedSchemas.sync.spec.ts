import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const websiteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publishedDir = path.join(websiteRoot, 'mcp-docs/public/schemas')

type SchemaManifest = {
  tools: Record<string, string>
}

function loadGatewayManifest(): { gatewayDir: string; manifest: SchemaManifest } | undefined {
  const gatewayDir = path.resolve(websiteRoot, '../mcp-gateway/schemas')
  try {
    const manifest = JSON.parse(
      readFileSync(path.join(gatewayDir, 'manifest.json'), 'utf8'),
    ) as SchemaManifest
    return { gatewayDir, manifest }
  } catch {
    return undefined
  }
}

const gateway = loadGatewayManifest()
const expectedFiles = gateway ? Object.values(gateway.manifest.tools).sort() : []

describe('mcp-docs published input schemas', () => {
  it('matches mcp-gateway manifest when sibling checkout exists', () => {
    if (gateway === undefined) {
      return
    }
    const onDisk = readdirSync(publishedDir)
      .filter((name) => name.endsWith('.input.json'))
      .sort()
    expect(onDisk).toEqual(expectedFiles)
  })

  it.each(expectedFiles.length > 0 ? expectedFiles : [])(
    'matches mcp-gateway/schemas/%s',
    (fileName) => {
      if (gateway === undefined) {
        return
      }
      const gatewayText = readFileSync(path.join(gateway.gatewayDir, fileName), 'utf8')
      const websiteText = readFileSync(path.join(publishedDir, fileName), 'utf8')
      expect(websiteText).toBe(gatewayText)
    },
  )
})
