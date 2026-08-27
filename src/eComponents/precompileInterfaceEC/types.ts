/** One input field in a precompile exploration (hex value, optional length hint). */
export interface PrecompileValueDef {
  /** Label shown beside the input. */
  title: string
  /** URL query key for deep-linking this value. */
  urlParam?: string
  /** Expected byte length for validation/display. */
  expectedLen?: bigint
  /** Initial hex string (with or without `0x`). */
  initialHex?: string
  /** Show bigint interpretation alongside hex. */
  showBigInt?: boolean
  /** Render an editable input (false = display-only). */
  showInput?: boolean
}

/** Exploration-local config passed to PrecompileInterfaceEC. Execution stays in MyC.vue. */
export interface PrecompileConfig {
  /** Must match exploration folder id and REGISTRY key. */
  explorationId: string
  /** Key from `examples.ts` selected on first load. */
  defaultExample: string
  /** Default for bigint display toggle. */
  showBigInt?: boolean
  /** Ordered value fields assembled into precompile input data. */
  values: PrecompileValueDef[]
  /** Custom encoder when default hex concatenation is insufficient. */
  assembleData?: (hexVals: string[], byteLengths: bigint[]) => string
  /** Custom decoder to populate fields from returned data. */
  parseData?: (data: string, byteLengths: bigint[]) => void
}
