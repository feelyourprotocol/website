import { describe, expect, it } from 'vitest'

import {
  CLAUDE_CODE_ADD_COMMAND,
  CODEX_ADD_COMMAND,
  CODEX_CONFIG_TOML,
  CURSOR_INSTALL_LINK,
  cursorMcpInstallLink,
  FYP_MCP_URL,
} from '../mcpConstants'

describe('mcpConstants', () => {
  it('builds a Cursor install deeplink whose config decodes to the server entry', () => {
    const link = cursorMcpInstallLink('feel-your-protocol', { url: FYP_MCP_URL })
    expect(link.startsWith('cursor://anysphere.cursor-deeplink/mcp/install?')).toBe(true)
    const params = new URL(link.replace('cursor://', 'https://')).searchParams
    expect(params.get('name')).toBe('feel-your-protocol')
    const decoded = JSON.parse(Buffer.from(params.get('config') ?? '', 'base64').toString('utf8'))
    expect(decoded).toEqual({ url: FYP_MCP_URL })
    expect(CURSOR_INSTALL_LINK).toBe(link)
  })

  it('encodes unusual server names safely', () => {
    const link = cursorMcpInstallLink('a b&c', { url: FYP_MCP_URL })
    expect(link).toContain('name=a%20b%26c')
  })

  it('uses the documented Claude Code and Codex forms', () => {
    expect(CLAUDE_CODE_ADD_COMMAND).toBe(
      `claude mcp add --transport http feel-your-protocol ${FYP_MCP_URL}`,
    )
    expect(CODEX_ADD_COMMAND).toBe(`codex mcp add feel-your-protocol --url ${FYP_MCP_URL}`)
    expect(CODEX_CONFIG_TOML).toContain('[mcp_servers.feel-your-protocol]')
    expect(CODEX_CONFIG_TOML).toContain(`url = "${FYP_MCP_URL}"`)
  })
})
