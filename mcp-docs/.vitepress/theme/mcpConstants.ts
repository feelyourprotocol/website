/** Hosted MCP endpoint — keep in sync with use/connect.md */
export const FYP_MCP_URL = 'https://mcp.feelyourprotocol.org/mcp'

export const FYP_MCP_SERVER_NAME = 'feel-your-protocol'

/** MCP tool id to docs path (stable URLs). */
export const TOOL_DOC_PATH: Record<string, string> = {
  describe_capabilities: '/use/tools/describe-capabilities',
  run_bytecode: '/use/tools/run-bytecode',
  run_transaction: '/use/tools/run-transaction',
  run_block: '/use/tools/run-block',
  generate_artifact: '/use/tools/generate-artifact',
  inspect_artifact: '/use/tools/inspect-artifact',
}

/**
 * Cursor install deeplink: base64 of the single-server config object
 * (https://cursor.com/docs/mcp/install-links).
 */
export function cursorMcpInstallLink(name: string, config: Record<string, unknown>): string {
  const json = JSON.stringify(config)
  const encoded =
    typeof btoa === 'function' ? btoa(json) : Buffer.from(json, 'utf8').toString('base64')
  return `cursor://anysphere.cursor-deeplink/mcp/install?name=${encodeURIComponent(name)}&config=${encoded}`
}

export const CURSOR_INSTALL_LINK = cursorMcpInstallLink(FYP_MCP_SERVER_NAME, { url: FYP_MCP_URL })

export const CURSOR_MCP_JSON = `{
  "mcpServers": {
    "${FYP_MCP_SERVER_NAME}": {
      "url": "${FYP_MCP_URL}"
    }
  }
}`

/** Claude Code CLI — `claude mcp add --transport http <name> <url>`. */
export const CLAUDE_CODE_ADD_COMMAND = `claude mcp add --transport http ${FYP_MCP_SERVER_NAME} ${FYP_MCP_URL}`

/** Codex CLI — `codex mcp add <name> --url <url>` (streamable HTTP). */
export const CODEX_ADD_COMMAND = `codex mcp add ${FYP_MCP_SERVER_NAME} --url ${FYP_MCP_URL}`

export const CODEX_CONFIG_TOML = `[mcp_servers.${FYP_MCP_SERVER_NAME}]
url = "${FYP_MCP_URL}"`
