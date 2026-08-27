# Compare Variants

> **Status:** **Live** (gateway v0.1, stdio). MCP tool: `compare_evm_variants`.

## Purpose

Run **two or more labelled variants** — each with its own fork and bytecode — and return per-variant simulate results plus a `diffs` array (success, gas used, error, bytecode length) and merged provenance.

This is the action tool for research questions like “how does gas differ?” The server returns structured numbers; the agent draws tables or diagrams.

## When to use

- Same-fork program diffs (original vs rewritten bytecode, two encodings of the same logic)
- Future repricing EIPs: identical bytecode, different fork configs
- Semantic equivalence: different bytecode per side

**Amsterdam / EIP-8024:** Amsterdam already bundles EIP-8024 in EthereumJS v10. Compare is for caller-supplied variants (rewrites, gas diffs, fork what-if). There is no pre-8024 base hardfork on this server yet, so you cannot toggle 8024 off.

## MCP tool name

`compare_evm_variants`

## Inputs

| Field | Required | Description |
| --- | --- | --- |
| `variants` | Yes | Array of at least two variant objects |
| `variants[].label` | Yes | Unique label (diff column) |
| `variants[].bytecode` | Yes | Hex bytecode (`0x` prefix optional) |
| `variants[].fork` | Yes | `{ baseHardfork, eips[] }` |
| `variants[].gasLimit` | No | Decimal string |
| `variants[].trace` | No | Stack-only steps when true |

Call `describe_capabilities` first for opcode encoding, then pass **your** bytecode variants.

## Outputs

| Field | Description |
| --- | --- |
| `variants` | Full simulate result per label |
| `diffs` | Dimensions compared across labels |
| `provenance` | Always present — engine version, merged fork config |

## Example — DUPN demo vs PUSH1 STOP

```json
{
  "variants": [
    {
      "label": "push1-stop",
      "bytecode": "0x600100",
      "fork": { "baseHardfork": "amsterdam", "eips": [] }
    },
    {
      "label": "dupn-demo",
      "bytecode": "0x600160026003600460056006600760086009600a600b600c600d600e600f60106011e68000",
      "fork": { "baseHardfork": "amsterdam", "eips": [] }
    }
  ]
}
```

Expected: both `success: true`; `gasUsed` higher on `dupn-demo`.

## JSON schema

[compare_evm_variants.input.json](/schemas/compare_evm_variants.input.json)

## Limits

Same ceilings as [Simulate Bytecode](/use/tools/simulate-bytecode). See [Guarantees](/use/guarantees).

## Changelog

<Changelog
  title="Compare Variants Changelog"
  :entries="[
    { version: 'v0.6', date: '2026-08-27', summary: 'Callers supply bytecode; catalog no longer ships compare demo programs.' },
  ]"
/>
