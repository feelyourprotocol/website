# Runtime agents

> **Audience:** AI agents with (or about to use) the **feel-your-protocol** MCP server — not human onboarding, not server development.

## Source of truth

When MCP is **connected**, trust the live server first:

1. **`listTools`** — tool names, descriptions, and input schemas
2. **`describe_capabilities`** — forks, runnable EIP modules, opcodes, encoding, ceilings

Markdown on this site is **secondary**. It can lag behind a gateway release; the probe response and tool schemas cannot.

**If MCP is connected and working, you usually do not need this page** — unless the user pasted a doc URL or you need behavior rules below.

## Not this page

| If you are… | Go to… |
| --- | --- |
| A **human** connecting or exploring | [Connect](/use/connect), [EIP catalogue](/use/coverage), [EIP-8024](/use/eips/eip-8024) |
| **Extending** the engine or gateway | [Contributing](/internals/contributing) → [mcp-execution-engine AGENTS.md](https://github.com/feelyourprotocol/mcp-execution-engine/blob/main/AGENTS.md) |

## Calling tools

1. Probe first — learn what is runnable and how opcodes encode
2. Run with **caller-supplied** bytecode (call twice to compare gas — this server does not ship demo programs)
3. **Do not** substitute the local `mcp-execution-engine` lab, `npm run lab`, or repository source unless MCP is unavailable

## Replying to humans

When the user is a **human** (exploring protocol changes, not integrating the server):

- Answer in **plain language** about behavior and results (gas, success, stack, traces)
- **Call MCP tools silently**
- Do **not** expose tool names, JSON field names (such as `baseHardfork`), raw hex, or request payloads unless the user explicitly asks for implementation detail

## Reporting results

Always cite **`provenance.engineVersion`** and **`provenance.forkConfig`** when reporting simulation outcomes.

## When you are reading docs (no MCP)

Use this order:

1. [Capabilities](/use/capabilities) — query shapes
2. Per-tool reference: [Discover](/use/tools/describe-capabilities), [Run](/use/tools/run-bytecode)
3. [Guarantees](/use/guarantees) — determinism, provenance, ceilings

**Machine-readable index:** [`/llms.txt`](/llms.txt)

**Full use-layer text:** [`/llms-full.txt`](/llms-full.txt)

**JSON schemas:** [describe_capabilities](/schemas/describe_capabilities.input.json), [run_evm_bytecode](/schemas/run_evm_bytecode.input.json)

## Changelog

<Changelog
  title="Runtime Agents Changelog"
  :entries="[
    { version: 'v0.9', date: '2026-08-27', summary: 'compare_evm_variants removed — simulate twice to diff.' },
    { version: 'v0.8', date: '2026-08-27', summary: 'Narrow scope — MCP-first runtime playbook; renamed from for-ai-agents; builders pointed to engine AGENTS.md.' },
    { version: 'v0.7', date: '2026-08-27', summary: 'Replying to humans — plain language; hide tool names and JSON fields unless asked.' },
    { version: 'v0.6', date: '2026-08-27', summary: 'Agents construct bytecode; catalog exposes opcodes/encoding, not demo programs.' },
    { version: 'v0.4', date: '2026-07-22', summary: 'Live MCP tools, schema URLs, explicit guidance to prefer MCP over local lab.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Initial AI/LLM reader guide under use/.' },
  ]"
/>
