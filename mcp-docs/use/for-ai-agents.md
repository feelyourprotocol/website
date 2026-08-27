# For AI Agents

This site is written for **human integrators and AI agents** alike. Use the layers below depending on your task.

## Runtime agents (calling tools)

### Prefer MCP tools when connected

If the **`feel-your-protocol`** MCP server is available (stdio or, later, HTTP):

1. Call **`describe_capabilities`** to learn forks, runnable EIP modules, and opcode encoding
2. Call **`simulate_evm_bytecode`** or **`compare_evm_variants`** with **caller-supplied** bytecode
3. **Do not** use the local `mcp-execution-engine` lab, `npm run lab`, or repository source as a substitute unless MCP is unavailable

Stale docs in the repo may say tools are "planned" — **trust `listTools` on the connected MCP server**. As of gateway v0.1, tools are: `describe_capabilities`, `simulate_evm_bytecode`, `compare_evm_variants`.

### Reading order

1. [Capabilities](/use/capabilities) — query shapes and live tool names
2. Per-tool pages: [Describe Capabilities](/use/tools/describe-capabilities), [Simulate Bytecode](/use/tools/simulate-bytecode), [Compare Variants](/use/tools/compare-variants)
3. [Guarantees](/use/guarantees) — determinism, provenance, ceilings
4. [Connect](/use/connect) — stdio setup and restart after gateway changes

**Machine-readable index:** [`/llms.txt`](/llms.txt)

**Full use-layer text:** [`/llms-full.txt`](/llms-full.txt) — concatenated end-user documentation for one-shot ingestion.

### JSON schemas

- [describe_capabilities.input.json](/schemas/describe_capabilities.input.json)
- [simulate_evm_bytecode.input.json](/schemas/simulate_evm_bytecode.input.json)
- [compare_evm_variants.input.json](/schemas/compare_evm_variants.input.json)

### Reporting results

Always cite `provenance.engineVersion` and `provenance.forkConfig` when reporting simulation outcomes.

## Coding assistants (integrating or extending)

Add [Internals](/internals/architecture) for repository layout, execution engine API, quality procedures, and deployment shape.

## Conventions

- **Present tense** — pages describe what exists or are explicitly marked planned
- **Provenance** — cite `provenance.engineVersion` and fork config when reporting simulation results
- **Vision vs reality** — strategic sketches live on [roadmap.feelyourprotocol.org](https://roadmap.feelyourprotocol.org); this site is the operational reference

## Changelog

<Changelog
  title="For AI Agents Changelog"
  :entries="[
    { version: 'v0.6', date: '2026-08-27', summary: 'Agents construct bytecode; catalog exposes opcodes/encoding, not demo programs.' },
    { version: 'v0.4', date: '2026-07-22', summary: 'Live MCP tools, schema URLs, explicit guidance to prefer MCP over local lab.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Initial AI/LLM reader guide under use/.' },
  ]"
/>
