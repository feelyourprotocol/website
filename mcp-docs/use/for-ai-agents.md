# For AI Agents

This site is written for **human integrators and AI agents** alike. Use the layers below depending on your task.

## Runtime agents (calling tools)

1. Read [Capabilities](/use/capabilities) — what query shapes exist
2. Read per-tool pages under [Tools](/use/tools/simulate-bytecode) — inputs, outputs, limits
3. Read [Guarantees](/use/guarantees) — determinism, provenance, ceilings
4. Use [Connect](/use/connect) when the remote endpoint is live

**Machine-readable index:** [`/llms.txt`](/llms.txt) — curated page list for this site.

**Full use-layer text:** [`/llms-full.txt`](/llms-full.txt) — concatenated end-user documentation for one-shot ingestion.

## Coding assistants (integrating or extending)

Add [Internals](/internals/architecture) for repository layout, execution engine API, quality procedures, and deployment shape.

## Conventions

- **Present tense** — pages describe what exists or is explicitly marked planned
- **Provenance** — cite `provenance.engineVersion` and fork config when reporting simulation results
- **Vision vs reality** — strategic sketches live on [roadmap.feelyourprotocol.org](https://roadmap.feelyourprotocol.org); this site is the operational reference

Per-tool JSON schemas at stable URLs will be added as MCP tools ship in the gateway.

## Changelog

<Changelog
  title="For AI Agents Changelog"
  :entries="[
    { version: 'v0.3', date: '2026-07-20', summary: 'Initial AI/LLM reader guide under use/.' },
  ]"
/>
