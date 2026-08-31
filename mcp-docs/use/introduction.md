# Introduction

> **Status:** **MCP server — not publicly launched.** This docs site is live; **`mcp.feelyourprotocol.org` is planned (Step 5).** Local stdio v0.1 exists for developers who self-host.

## For most visitors

If you heard about Feel Your Protocol from the community or Bankr and want to **explore Ethereum protocol changes interactively**, start on the main site:

**[feelyourprotocol.org](https://feelyourprotocol.org)** — browser explorations (textbook). No install, no MCP config.

This MCP docs site describes the **lab equipment** we are building: a headless server so agents can run the same problem sets with arbitrary inputs. That product is **in progress** — not something you connect to from the web today.

| What | Status | Who it is for |
| --- | --- | --- |
| [Website explorations](https://feelyourprotocol.org) | **Live** | Everyone — curiosity, learning, feeling the protocol |
| **Public MCP endpoint** (`mcp.feelyourprotocol.org`) | **Not launched** | Future — agents and integrators without local setup |
| **Local stdio gateway** (v0.1) | Early access | Developers / power users who build from source — see [Connect](/use/connect) |

## What the MCP server will do (when launched)

Feel Your Protocol will provide a **headless MCP server** wrapping the EthereumJS stack so AI agents can run **exact, deterministic simulations** of the *future* Ethereum protocol — upcoming forks, EIPs, and research — and receive rich JSON traces they can reason over.

**Today (local early access only):** two MCP tools via stdio — `describe_capabilities` and `run_evm_bytecode`. EIP catalogue pages describe how each exploration maps to agent prompts once you can connect.

Payments, remote HTTP, and additional tools (BAL generate) come in later steps.

## Mental model

From the [two-legs vision](https://roadmap.feelyourprotocol.org/vision/two-legs.html): the explorations **website** is the textbook; the **MCP server** is the lab equipment. The textbook is live; the hosted lab is not open yet.

For architecture, repositories, and build procedures, see [Internals](/internals/architecture). For vision and draft concepts, see the [roadmap site](https://roadmap.feelyourprotocol.org).

## Changelog

<Changelog
  title="Introduction Changelog"
  :entries="[
    { version: 'v0.9', date: '2026-08-31', summary: 'Lead with not publicly launched — website explorations for most visitors; local stdio as early access only.' },
    { version: 'v0.8', date: '2026-08-27', summary: 'Osaka mainnet baseline fork for run-twice comparisons against Amsterdam preview.' },
    { version: 'v0.7', date: '2026-08-27', summary: 'Two live MCP tools — compare removed; use simulate twice.' },
    { version: 'v0.6', date: '2026-08-27', summary: 'Catalog describes capabilities (opcodes/encoding), not website demo programs.' },
    { version: 'v0.4', date: '2026-07-22', summary: 'Local stdio gateway v0.1 live — two MCP tools.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Split from overview — end-user introduction under use/.' },
    { version: 'v0.1', date: '2026-07-15', summary: 'Initial overview content (pre-split).' },
  ]"
/>
