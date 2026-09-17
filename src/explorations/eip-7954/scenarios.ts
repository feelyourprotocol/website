export type DeploymentDimension = 'runtime-code' | 'initcode'

export interface DeploymentScenario {
  id: string
  title: string
  lesson: string
  dimension: DeploymentDimension
  sizeBytes: number
}

export const LEGACY_RUNTIME_LIMIT = 24_576
export const GLAMSTERDAM_RUNTIME_LIMIT = 65_536
export const LEGACY_INITCODE_LIMIT = 49_152
export const GLAMSTERDAM_INITCODE_LIMIT = 131_072

export const SCENARIO_ORDER = [
  '01-runtime-old-wall',
  '02-runtime-new-ceiling',
  '03-runtime-too-large',
  '04-initcode-old-wall',
] as const

export const SCENARIOS: Record<string, DeploymentScenario> = {
  '01-runtime-old-wall': {
    id: '01-runtime-old-wall',
    title: '24 KiB + 1 — cross the old wall',
    lesson:
      'One extra byte makes this contract invalid on Fusaka. Glamsterdam moves the wall far enough away for the same deployment to succeed.',
    dimension: 'runtime-code',
    sizeBytes: LEGACY_RUNTIME_LIMIT + 1,
  },
  '02-runtime-new-ceiling': {
    id: '02-runtime-new-ceiling',
    title: '64 KiB — land on the new ceiling',
    lesson:
      'The largest runtime code allowed by EIP-7954 fits exactly. This is more than two and a half times the previous limit.',
    dimension: 'runtime-code',
    sizeBytes: GLAMSTERDAM_RUNTIME_LIMIT,
  },
  '03-runtime-too-large': {
    id: '03-runtime-too-large',
    title: '64 KiB + 1 — still too large',
    lesson:
      'The limit grew; it did not disappear. One byte beyond the new ceiling is rejected on both forks.',
    dimension: 'runtime-code',
    sizeBytes: GLAMSTERDAM_RUNTIME_LIMIT + 1,
  },
  '04-initcode-old-wall': {
    id: '04-initcode-old-wall',
    title: '48 KiB + 1 — cross the initcode wall',
    lesson:
      'Deployment input has its own limit. The same one-byte boundary test moves from 48 KiB on Fusaka to 128 KiB on Glamsterdam.',
    dimension: 'initcode',
    sizeBytes: LEGACY_INITCODE_LIMIT + 1,
  },
}

export function getScenario(id: string): DeploymentScenario {
  const scenario = SCENARIOS[id]
  if (scenario === undefined) {
    throw new Error(`Unknown EIP-7954 scenario: ${id}`)
  }
  return scenario
}

export function limitsForDimension(dimension: DeploymentDimension): {
  fusaka: number
  glamsterdam: number
} {
  return dimension === 'runtime-code'
    ? { fusaka: LEGACY_RUNTIME_LIMIT, glamsterdam: GLAMSTERDAM_RUNTIME_LIMIT }
    : { fusaka: LEGACY_INITCODE_LIMIT, glamsterdam: GLAMSTERDAM_INITCODE_LIMIT }
}
