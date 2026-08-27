# Introduction

> **Status:** MCP docs site live. **Local stdio gateway v0.1 live.** Remote HTTP endpoint planned (Step 5).

Feel Your Protocol provides a **headless MCP server** that wraps the EthereumJS stack so AI agents can run **exact, deterministic simulations** of the *future* Ethereum protocol — upcoming forks, EIPs, and research — and receive rich JSON traces they can reason over.

This section describes **what you can do** and **how to connect**. For architecture, repositories, and build procedures, see [Internals](/internals/architecture).

For vision, strategy, and draft concepts, see the [roadmap site](https://roadmap.feelyourprotocol.org).

## What works today

Connect locally via **stdio** ([Connect](/use/connect)) and use three MCP tools:

- **`describe_capabilities`** — what forks and EIP modules are supported (opcodes, encoding; no demo programs)
- **`simulate_evm_bytecode`** — run bytecode under Amsterdam (and registered fork configs)
- **`compare_evm_variants`** — diff labelled variants (gas, success, error)

Payments, remote HTTP, and additional tools (BAL generate) come in later steps.

## Mental model

From the [two-legs vision](https://roadmap.feelyourprotocol.org/vision/two-legs.html): the explorations **website** is the textbook; the **MCP server** is the lab equipment.

## Changelog

<Changelog
  title="Introduction Changelog"
  :entries="[
    { version: 'v0.6', date: '2026-08-27', summary: 'Catalog describes capabilities (opcodes/encoding), not website demo programs.' },
    { version: 'v0.4', date: '2026-07-22', summary: 'Local stdio gateway v0.1 live — two MCP tools.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Split from overview — end-user introduction under use/.' },
    { version: 'v0.1', date: '2026-07-15', summary: 'Initial overview content (pre-split).' },
  ]"
/>
