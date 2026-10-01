import { resolve } from 'node:path'

import { WEBSITE_ROOT } from './config.ts'

/** mcp-docs/public/og — render template + generated default.webp (no Playwright import). */
export const MCP_DOCS_OG_PUBLIC_DIR = resolve(WEBSITE_ROOT, 'mcp-docs', 'public', 'og')
export const MCP_DOCS_OG_RENDER_HTML = resolve(MCP_DOCS_OG_PUBLIC_DIR, 'render.html')
export const MCP_DOCS_OG_OUTPUT = resolve(MCP_DOCS_OG_PUBLIC_DIR, 'default.webp')
