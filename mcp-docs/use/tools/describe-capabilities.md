# Describe Capabilities

> **Status:** **Live** (gateway v0.1, stdio). MCP tool: `describe_capabilities`.

## Purpose

Return a machine-readable snapshot of what the execution engine and MCP server support: engine version, gas/trace/bytecode ceilings, named forks, registered EIP capabilities (with query shapes), and seed presets.

## When to use

- **First call** when connecting to the server — learn forks, EIPs, and limits before simulating
- Check whether a specific EIP (e.g. 8024) is registered and which query shapes apply
- Read hard ceilings (max gas, bytecode size, trace steps)

## MCP tool name

`describe_capabilities`

## Inputs

None required. Pass `{}` or omit arguments.

## Outputs

| Field | Description |
| --- | --- |
| `engineVersion` | Semver of `mcp-execution-engine` |
| `ceilings` | `maxGasLimit`, `defaultGasLimit`, `maxBytecodeBytes`, `maxTraceSteps` |
| `namedForks` | Curated shortcuts (e.g. `amsterdam`) |
| `eips` | Seed capability registry — EIP number, nature, shapes, maturity notes |
| `allowedBaseHardforks` | Valid `baseHardfork` values |
| `presets` | Seed compare/simulate preset definitions |

## Example

_Tool call:_

```json
{}
```

_Output (abbreviated):_

```json
{
  "engineVersion": "0.1.0",
  "ceilings": {
    "maxGasLimit": "30000000",
    "defaultGasLimit": "1000000",
    "maxBytecodeBytes": 24576,
    "maxTraceSteps": 10000
  },
  "namedForks": [{ "id": "amsterdam", "label": "Amsterdam (scheduled EL fork)", "…": "…" }],
  "eips": [{ "eip": 8024, "name": "Backward compatible SWAPN, DUPN, EXCHANGE", "shapes": ["simulate", "compare"], "…": "…" }]
}
```

## JSON schema

[describe_capabilities.input.json](/schemas/describe_capabilities.input.json)

## Changelog

<Changelog
  title="Describe Capabilities Changelog"
  :entries="[
    { version: 'v0.4', date: '2026-07-22', summary: 'Live MCP tool page — gateway v0.1 stdio ships describe_capabilities.' },
  ]"
/>
