# Describe Capabilities

> **Status:** **Live** (gateway v0.1, stdio). MCP tool: `describe_capabilities`.

## Purpose

Return a machine-readable snapshot of what this server can **actually run**: engine version, ceilings, named forks, and **runnable EIP modules**. Each module describes **what became possible** (opcodes, encoding rules, keywords) — not demo programs. Unimplemented EIPs are omitted. Callers supply bytecode to `simulate_evm_bytecode` / `compare_evm_variants`.

## When to use

- **First call** when connecting — learn forks, modules, and limits before simulating
- Answer support questions: “Is EIP-8024 supported?”, “Can I run Amsterdam bytecode with DUPN?”
- Read opcode encoding so you can **construct** bytecode (this tool does not hand you a canned example program)

## MCP tool name

`describe_capabilities`

## Inputs

None required. Pass `{}` or omit arguments.

## Outputs

| Field | Description |
| --- | --- |
| `engineVersion` | Semver of `mcp-execution-engine` |
| `ceilings` | `maxGasLimit`, `defaultGasLimit`, `maxBytecodeBytes`, `maxTraceSteps` |
| `namedForks` | Curated shortcuts (`amsterdam`, alias `glamsterdam`) |
| `eips` | Runnable modules only — `runnable`, `summary`, `opcodes`, `keywords`, `shapes` |
| `allowedBaseHardforks` | Valid `baseHardfork` values |

## Example

_Tool call:_

```json
{}
```

_Output (abbreviated):_

```json
{
  "engineVersion": "0.1.0",
  "namedForks": [{ "id": "amsterdam", "aliases": ["glamsterdam"], "…": "…" }],
  "eips": [{
    "eip": 8024,
    "runnable": true,
    "summary": "Amsterdam EVM executes DUPN, SWAPN, and EXCHANGE. Supply any bytecode; this server does not ship demo programs.",
    "shapes": ["simulate", "compare"],
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
    { version: 'v0.6', date: '2026-08-27', summary: 'Modules describe opcodes and encoding; demo scenarios removed from the catalog.' },
    { version: 'v0.5', date: '2026-08-27', summary: 'Runnable EIP modules with questions and scenarios; stub EIPs and presets removed.' },
    { version: 'v0.4', date: '2026-07-22', summary: 'Live MCP tool page — gateway v0.1 stdio ships describe_capabilities.' },
  ]"
/>
