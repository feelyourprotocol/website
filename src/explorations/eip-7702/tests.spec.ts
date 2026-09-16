import { describe, expect, it } from 'vitest'

import { CANONICAL } from './canonical'

describe('EIP-7702 canonical', () => {
  it('matches MCP runnable module metadata', () => {
    expect(CANONICAL.question.changeNature).toBe('new-exec-model')
    expect(CANONICAL.mcp.shapes).toContain('transaction')
    expect(CANONICAL.mcp.shapes).toContain('inspect')
    expect(CANONICAL.mcp.docsStatus).toBe('runnable')
    expect(CANONICAL.mcp.comparison?.baselineForkId).toBe('cancun')
    expect(CANONICAL.mcp.comparison?.previewForkId).toBe('prague')
  })
})
