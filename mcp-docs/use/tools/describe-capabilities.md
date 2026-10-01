# Describe Capabilities

> **Status:** Implemented — ships on the public MCP at launch. MCP tool: `describe_capabilities`. **Public endpoint not live.**

## Purpose

Return a machine-readable snapshot of what this server can **actually run**: engine version, ceilings, **named fork capabilities**, **`inspectKinds`**, and **runnable EIP modules**. Each named fork describes a generic hardfork run (summary, keywords, **`tools`**, advertised `relatedEips`) — you do not need to name an EIP. Each EIP module describes **what became possible** (opcodes, encoding rules, keywords, **`tools`**) — not demo programs. Unimplemented EIPs are omitted. Use **`eips[].tools`** / **`namedForks[].tools`** to pick **`run_bytecode`**, **`run_transaction`**, **`run_block`**, **`generate_artifact`**, or **`inspect_artifact`**. **`queryShapes[]`** is the dictionary from internal catalog ids (`simulate`, `generate`, …) to those MCP names — do not call the `id`.

## When to use

- **First call** when connecting — learn forks, modules, limits, and which EIP spec snapshot this lab implements before simulating
- Answer support questions: “Is Glamsterdam available?”, “Which EIPs does that fork advertise?”, “Is EIP-8024 supported?”, “Can I run Glamsterdam bytecode with DUPN?”
- Read the `glamsterdam` named-fork row for a generic preview run; read opcode encoding so you can **construct** bytecode (this tool does not hand you a canned example program)

## MCP tool name

`describe_capabilities`

## Inputs

None required. Pass `{}` or omit arguments.

## Outputs

| Field | Description |
| --- | --- |
| `engineVersion` | Semver of `mcp-execution-engine` |
| `ceilings` | `maxGasLimit`, `maxTransactionGasLimit`, `defaultGasLimit`, `maxBytecodeBytes`, `maxTraceSteps`, `maxTxsPerBlock` |
| `baselineForkId` | Current mainnet EL (`fusaka`) — probe label for mainnet-today; run the fork the user asked for |
| `queryShapes` | Dictionary: catalog `id` (`simulate`, `generate`, …) → `mcpTool` (`run_bytecode`, `generate_artifact`, …). Agents call `mcpTool`. |
| `namedForks` | Berlin→Glamsterdam lineage — `order`, `predecessorId`, `successorId`, `role`, `activatedEips`, advertised `relatedEips`, **`tools`** (MCP names) |
| `eipIntroductions` | When each EIP activated. **`coverage`** is `twin` (runnable module), `supported` (hardfork already applies it — omit that id from `eips` and use the fork tools), `consensus` (consensus-layer — this lab does not execute it; do not put it in `eips`), `networking` (wire protocol — this lab does not speak it; do not put it in `eips`), `informational` (analysis or a schedule — this lab does not execute it; do not put it in `eips`), or `listed` (name and fork only). **`observableTools`** are MCP names; `supported`, `consensus`, `networking`, and `informational` rows omit them |
| `eips` | Runnable modules — optional `comparison` lookup from `eipIntroductions` (use when the user asks for before/after); **`tools`** lists MCP names to call; each row includes `specUrl`, `specDate`, `status`, and optional `testReleaseUrl` / `testReleaseName` (or a live `eips.ethereum.org` page when unpinned) |
| `allowedBaseHardforks` | Lineage forks (`berlin` … `glamsterdam`) plus aliases; glacier/BPO ids rejected |

## Example

_Tool call:_

```json
{}
```

_Output (abbreviated):_

```json
{
  "engineVersion": "0.1.0",
  "baselineForkId": "fusaka",
  "queryShapes": [
    { "id": "simulate", "mcpTool": "run_bytecode", "summary": "…" }
  ],
  "namedForks": [
    { "id": "fusaka", "role": "current", "aliases": ["osaka", "mainnet-el"], "relatedEips": [7883, 7951], "tools": ["run_bytecode", "run_transaction", "run_block"], "…": "…" },
    { "id": "glamsterdam", "role": "preview", "aliases": ["amsterdam"], "relatedEips": [2780, 7708, 7843, 7928, 7954, 7976, 8024, 8037, 8038], "tools": ["run_bytecode", "run_transaction", "run_block"], "…": "…" }
  ],
  "eips": [{
    "eip": 8024,
    "runnable": true,
    "comparison": { "baselineForkId": "fusaka", "previewForkId": "glamsterdam", "note": "…" },
    "summary": "Glamsterdam EVM executes DUPN, SWAPN, and EXCHANGE. Supply any bytecode; this server does not ship demo programs.",
    "tools": ["run_bytecode"],
    "status": "Review",
    "specDate": "2026-06-10",
    "testReleaseName": "tests-glamsterdam-devnet@v8.1.0",
    "opcodes": [
      { "name": "DUPN", "opcodeHex": "0xe6", "effect": "Copy the stack item at depth n onto the top.", "immediate": { "encoding": "n = (immediate + 145) mod 256; …", "minDepth": 17, "maxDepth": 235 } }
    ]
  }]
}
```

## JSON schema

[describe_capabilities.input.json](/schemas/describe_capabilities.input.json)

## Changelog

<Changelog
  title="Describe Capabilities Changelog"
  :entries="[
    { version: 'v0.21', date: '2026-09-29', summary: 'eipIntroductions.coverage adds networking and informational: wire protocol and notes this lab does not execute.' },
    { version: 'v0.20', date: '2026-09-29', summary: 'eipIntroductions.coverage adds consensus: consensus-layer EIPs this lab does not execute.' },
    { version: 'v0.19', date: '2026-09-29', summary: 'eipIntroductions.coverage: twin, supported (omit from eips), or listed.' },
    { version: 'v0.17', date: '2026-09-22', summary: 'shapes generate/inspect map to generate_artifact / inspect_artifact.' },
    { version: 'v0.16', date: '2026-09-18', summary: 'eips[] rows include specUrl, specDate, status, and named test release (or live EIP page).' },
    { version: 'v0.15', date: '2026-09-17', summary: 'maxTransactionGasLimit exposes the separate 110M transaction-only ceiling.' },
    { version: 'v0.14', date: '2026-09-17', summary: 'baselineForkId is a first-class run target, not only a compare hint.' },
    { version: 'v0.13', date: '2026-09-16', summary: 'namedForks are catalog capabilities (summary, relatedEips, shapes); generic hardfork questions are first-class.' },
    { version: 'v0.11', date: '2026-09-10', summary: 'EIP-7843 SLOTNUM in the live catalog (shapes: block).' },
    { version: 'v0.10', date: '2026-09-10', summary: 'ceilings.maxTxsPerBlock; shapes may include block (run_block).' },
    { version: 'v0.9', date: '2026-09-08', summary: 'shapes distinguish run_bytecode vs run_transaction (7708/8037 include transaction).' },
    { version: 'v0.8', date: '2026-09-02', summary: 'Implemented for public launch — not a local stdio product path.' },
    { version: 'v0.7', date: '2026-08-27', summary: 'baselineForkId (osaka) and fork role metadata for mainnet vs preview comparisons.' },
    { version: 'v0.6', date: '2026-08-27', summary: 'Modules describe opcodes and encoding; demo scenarios removed from the catalog.' },
    { version: 'v0.5', date: '2026-08-27', summary: 'Runnable EIP modules with questions and scenarios; stub EIPs and presets removed.' },
    { version: 'v0.4', date: '2026-07-22', summary: 'Live MCP tool page — gateway v0.1 stdio ships describe_capabilities.' },
  ]"
/>
