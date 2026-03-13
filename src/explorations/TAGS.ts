/**
 * Tags enrich exploration navigation with broader Ethereum technical concepts,
 * protocol-relevant areas, or general technology topics from the blockchain space.
 *
 * Unlike topics (1:1), each exploration can have up to 3–4 tags. Tags are contributed
 * alongside explorations and grow organically, but follow strict quality rules:
 *
 * **Semantic rules:**
 * - Each tag must go beyond a single exploration — it should be reusable across at
 *   least two (current or future) explorations.
 * - Prefer broader technical concepts ("EVM", "Signatures") over narrow specifics
 *   ("EIP-7883", "SECP256R1").
 * - No redundancy: once "Gas Costs" exists, don't add "Gas" or "Gas Increases".
 * - When in doubt, choose the more generic concept.
 *
 * **Format rules:**
 * - Enum members must be sorted alphabetically (enforced by lint).
 * - Left side (key): CamelCase, all-caps for multi-word abbreviations (e.g. `EVM`).
 * - Right side (value): short display name, all-caps for abbreviations (e.g. "EVM").
 * - Short form preferred (e.g. "EVM" not "Ethereum Virtual Machine").
 */
export enum Tag {
  EVM = 'EVM',
  GasCosts = 'Gas Costs',
  PeerDAS = 'PeerDAS',
  Precompiles = 'Precompiles',
  Signatures = 'Signatures',
}
