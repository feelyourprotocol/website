# Describe Capabilities

> **Status:** Implemented — ships on the public MCP at launch. MCP tool: `describe_capabilities`. **Public endpoint not live.**

## Purpose

Return a machine-readable snapshot of what this server can **actually run**: engine version, ceilings, **named fork capabilities**, and **runnable EIP modules**. Each named fork describes a generic hardfork run (summary, keywords, shapes, advertised `relatedEips`) — you do not need to name an EIP. Each EIP module describes **what became possible** (opcodes, encoding rules, keywords, `shapes`) — not demo programs. Unimplemented EIPs are omitted. Use `shapes` to pick **`run_bytecode`**, **`run_transaction`**, or **`run_block`**.

## When to use

- **First call** when connecting — learn forks, modules, and limits before simulating
- Answer support questions: “Is Amsterdam available?”, “Which EIPs does that fork advertise?”, “Is EIP-8024 supported?”, “Can I run Amsterdam bytecode with DUPN?”
- Read the `amsterdam` named-fork row for a generic preview run; read opcode encoding so you can **construct** bytecode (this tool does not hand you a canned example program)

## MCP tool name

`describe_capabilities`

## Inputs

None required. Pass `{}` or omit arguments.

## Outputs

| Field | Description |
| --- | --- |
| `engineVersion` | Semver of `mcp-execution-engine` |
| `ceilings` | `maxGasLimit`, `defaultGasLimit`, `maxBytecodeBytes`, `maxTraceSteps`, `maxTxsPerBlock` |
| `baselineForkId` | Optional mainnet EL baseline for comparisons (`osaka`) — not required for every run |
| `namedForks` | Catalog capabilities (`osaka` baseline, `amsterdam` preview, `prague` historical) — `summary`, `keywords`, `shapes`, advertised `relatedEips`, optional `plannedEips` |
| `eips` | Runnable modules only — `runnable`, `summary`, `opcodes`, `comparison`, `keywords`, `shapes` |
| `allowedBaseHardforks` | Valid `baseHardfork` values (`prague`, `osaka`, `amsterdam`) |

## Example

_Tool call:_

```json
{}
```

_Output (abbreviated):_

```json
{
  "engineVersion": "0.1.0",
  "baselineForkId": "osaka",
  "namedForks": [
    { "id": "osaka", "role": "baseline", "aliases": ["mainnet-el"], "relatedEips": [7883, 7951], "…": "…" },
    { "id": "amsterdam", "role": "preview", "aliases": ["glamsterdam"], "relatedEips": [7708, 7843, 8024, 8037, 8038], "plannedEips": [7928], "…": "…" }
  ],
  "eips": [{
    "eip": 8024,
    "runnable": true,
    "comparison": { "baselineForkId": "osaka", "previewForkId": "amsterdam", "note": "…" },
    "summary": "Amsterdam EVM executes DUPN, SWAPN, and EXCHANGE. Supply any bytecode; this server does not ship demo programs.",
    "shapes": ["simulate"],
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
