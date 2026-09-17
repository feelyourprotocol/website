/**
 * Cypress coverage contract for live explorations.
 *
 * Vitest (`e2eCatalog.spec.ts`) fails if this list drifts from `REGISTRY`.
 * `cypress/e2e/explorations.cy.ts` visits every row; family execute and layout
 * specs use the representatives below — not one extra play path per EIP.
 */

export const E2E_FAMILIES = ['form', 'scenario', 'bytecode'] as const
export type E2eFamily = (typeof E2E_FAMILIES)[number]

export interface E2eExploration {
  id: string
  path: string
  family: E2eFamily
  /** Do not click the primary execute control (slow KZG / similar). */
  skipExecute?: boolean
}

export const E2E_EXPLORATIONS: E2eExploration[] = [
  { id: 'eip-7708', path: '/eip-7708-eth-transfer-logs', family: 'scenario' },
  { id: 'eip-7843', path: '/eip-7843-slotnum-opcode', family: 'bytecode' },
  { id: 'eip-7883', path: '/eip-7883-modexp-gas-cost-increase', family: 'form' },
  { id: 'eip-7928', path: '/eip-7928-block-level-access-lists', family: 'scenario' },
  { id: 'eip-7951', path: '/eip-7951-secp256r1-precompile', family: 'form' },
  { id: 'eip-7954', path: '/eip-7954-contract-size-limit', family: 'scenario' },
  { id: 'eip-8024', path: '/eip-8024-stack-opcodes-dupn-swapn-exchange', family: 'bytecode' },
  { id: 'eip-8037', path: '/eip-8037-state-creation-gas', family: 'scenario' },
  { id: 'eip-8038', path: '/eip-8038-state-access-gas', family: 'scenario' },
]

export function e2eExploration(id: string): E2eExploration {
  const row = E2E_EXPLORATIONS.find((item) => item.id === id)
  if (!row) throw new Error(`e2eCatalog missing ${id}`)
  return row
}

export type E2eFamilyPlay =
  | { family: 'form'; id: string; kind: 'select-example'; exampleTestId: string }
  | {
      family: 'scenario'
      id: string
      kind: 'run'
      testId: string
      doneTestId: string
      doneAttr: string
      doneValue: string
    }
  | { family: 'bytecode'; id: string; kind: 'run'; testId: string }

/** One cheap play path per family — not one execute click per exploration. */
export const E2E_FAMILY_PLAY: E2eFamilyPlay[] = [
  {
    family: 'form',
    id: 'eip-7883',
    kind: 'select-example',
    exampleTestId: 'example-5-byte-exponent',
  },
  {
    family: 'scenario',
    id: 'eip-8038',
    kind: 'run',
    testId: 'run-program',
    doneTestId: 'cost-breakdown',
    doneAttr: 'data-has-run',
    doneValue: 'true',
  },
  {
    family: 'bytecode',
    id: 'eip-8024',
    kind: 'run',
    testId: 'bytecode-run',
  },
]

/** Layout representatives — one touch chrome, one companion sheet. */
export const E2E_LAYOUT = {
  touchChromeId: 'eip-8038',
  companionId: 'eip-7708',
  companionPanelTestId: 'receipts-panel',
} as const
