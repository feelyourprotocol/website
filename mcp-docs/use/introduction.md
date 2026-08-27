# Introduction

> **Status:** MCP docs site live. **Local stdio gateway v0.1 live.** Remote HTTP endpoint planned (Step 5).

Feel Your Protocol provides a **headless MCP server** that wraps the EthereumJS stack so AI agents can run **exact, deterministic simulations** of the *future* Ethereum protocol — upcoming forks, EIPs, and research — and receive rich JSON traces they can reason over.

This section describes **what you can do** and **how to connect**. For architecture, repositories, and build procedures, see [Internals](/internals/architecture).

For vision, strategy, and draft concepts, see the [roadmap site](https://roadmap.feelyourprotocol.org).

## What works today

Connect locally via **stdio** ([Connect](/use/connect)) and use two MCP tools:

- **`describe_capabilities`** — forks (osaka baseline, amsterdam preview), runnable EIP modules, opcodes, encoding
- **`run_evm_bytecode`** — run bytecode under a fork config (default preview: **amsterdam**)

**Optional:** run the same bytecode on **osaka** too when you want a mainnet baseline comparison — not required for Amsterdam-only work (e.g. EIP-8024).

Payments, remote HTTP, and additional tools (BAL generate) come in later steps.

## Mental model

From the [two-legs vision](https://roadmap.feelyourprotocol.org/vision/two-legs.html): the explorations **website** is the textbook; the **MCP server** is the lab equipment.

## Changelog

<Changelog
  title="Introduction Changelog"
  :entries="[
    { version: 'v0.8', date: '2026-08-27', summary: 'Osaka mainnet baseline fork for run-twice comparisons against Amsterdam preview.' },
    { version: 'v0.7', date: '2026-08-27', summary: 'Two live MCP tools — compare removed; use simulate twice.' },
    { version: 'v0.6', date: '2026-08-27', summary: 'Catalog describes capabilities (opcodes/encoding), not website demo programs.' },
    { version: 'v0.4', date: '2026-07-22', summary: 'Local stdio gateway v0.1 live — two MCP tools.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Split from overview — end-user introduction under use/.' },
    { version: 'v0.1', date: '2026-07-15', summary: 'Initial overview content (pre-split).' },
  ]"
/>
