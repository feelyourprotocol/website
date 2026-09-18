---
name: update-ethereumjs
description: >-
  Refresh Feel Your Protocol after an EthereumJS library bump: confirm the
  execution-specs test release, re-pin EIP spec URLs, and update twins.
  Use when EthereumJS packages change, EST/devnet fixtures bump, or the user
  asks to update EthereumJS on the website or MCP engine.
---

# Update EthereumJS (FYP)

Stub playbook. Library/wiring steps land here on a later concrete bump. **This round:** after EthereumJS (or the EST snapshot it tracks) changes, refresh EIP version pins.

## Spec pins (required)

Follow [eip-canonical-data.mdc](../../rules/eip-canonical-data.mdc) § Spec versioning.

EthereumJS hardfork EIP work tracks official cross-client spec tests. The EthereumJS repo is a **hint**, not the unquestioned source of truth — confirm against [ethereum/execution-specs releases](https://github.com/ethereum/execution-specs/releases).

**Do not** use a local `ethereum/EIPs` or execution-specs git checkout. Collect from GitHub/web only. If the test release, devnet branch, or `ref_spec` is unclear, **ask**.

Then write `identity.specUrl`, `identity.specDate`, `identity.status`, and `identity.testReleaseUrl` on affected `canonical.ts` files, replicate into engine modules / provenance, and update mcp-docs “Canonical spec” / “Spec date” rows.

## Later

EthereumJS package bump, engine dependency, fixture alignment, and lab behaviour checks — add when the next concrete update runs.
