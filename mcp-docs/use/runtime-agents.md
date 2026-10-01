# Runtime agents

::: info Humans start elsewhere
If you are connecting an agent for the first time, use **[Connect](/use/connect)** and **[What you can ask](/use/capabilities)**. This page is a short pointer for automated readers.
:::

When the **feel-your-protocol** MCP server is connected, trust the **live server** first:

1. **`listTools`** — names, descriptions, input schemas  
2. **`describe_capabilities`** — forks, runnable EIPs, opcodes, ceilings, spec snapshots  

Markdown on this site can lag a release; the probe and schemas cannot.

**Machine-readable index:** [`/llms.txt`](/llms.txt) · **Full use-layer text:** [`/llms-full.txt`](/llms-full.txt)

**Behavior rules for connected agents** (plain language to humans, probe before run, cite provenance, do not substitute local lab scripts) live in **`llms.txt`** and **`llms-full.txt`** — not duplicated here.

## Changelog

<Changelog
  title="Runtime Agents Changelog"
  :entries="[
    { version: 'v0.20', date: '2026-10-01', summary: 'Stub — playbook moved to llms.txt; humans use Connect and What you can ask.' },
    { version: 'v0.19', date: '2026-09-29', summary: 'Probe coverage adds networking and informational; do not put those ids in eips.' },
    { version: 'v0.18', date: '2026-09-22', summary: 'Probe queryShapes + tools (MCP names); do not call catalog shape ids.' },
    { version: 'v0.17', date: '2026-09-22', summary: 'Routing includes generate_artifact and inspect_artifact.' },
    { version: 'v0.16', date: '2026-09-18', summary: 'Cite the EIP spec snapshot once on EIP-specific answers; named eips[] runs put Spec: on provenance.caveat.' },
    { version: 'v0.15', date: '2026-09-17', summary: 'Fusaka runs are first-class for current-mainnet features, not only preview compares.' },
    { version: 'v0.14', date: '2026-09-16', summary: 'Generic hardfork runs (no EIP required); namedForks are catalog capabilities; provenance lists advertised modules.' },
    { version: 'v0.12', date: '2026-09-10', summary: 'run_block routing for header slot and multi-tx lab blocks.' },
    { version: 'v0.11', date: '2026-09-08', summary: 'run_bytecode + run_transaction routing; renamed from run_evm_bytecode.' },
    { version: 'v0.10', date: '2026-09-02', summary: 'No self-host onboarding — agents wait for the public MCP; lab is not a user fallback.' },
    { version: 'v0.9', date: '2026-08-27', summary: 'compare_evm_variants removed — simulate twice to diff.' },
    { version: 'v0.8', date: '2026-08-27', summary: 'Narrow scope — MCP-first runtime playbook; renamed from for-ai-agents; builders pointed to engine AGENTS.md.' },
    { version: 'v0.7', date: '2026-08-27', summary: 'Replying to humans — plain language; hide tool names and JSON fields unless asked.' },
    { version: 'v0.6', date: '2026-08-27', summary: 'Agents construct bytecode; catalog exposes opcodes/encoding, not demo programs.' },
    { version: 'v0.4', date: '2026-07-22', summary: 'Live MCP tools, schema URLs, explicit guidance to prefer MCP over local lab.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Initial AI/LLM reader guide under use/.' },
  ]"
/>
