# Public MCP Launch Week

> **5–9 October 2026.** A public MCP server for the next Ethereum hardfork. During this week, agents can connect to `mcp.feelyourprotocol.org` and run exact simulations under Glamsterdam rules — a program, a transaction, or a small block — before those rules are on mainnet.

Until the endpoint is up, the same changes are on [feelyourprotocol.org](https://feelyourprotocol.org), with the tool catalogue on [mcp-docs](https://mcp-docs.feelyourprotocol.org).

<LaunchFacts
  :facts="[
    { title: 'Open', detail: 'No API key, no payment' },
    { title: 'Glamsterdam', detail: 'The upcoming hardfork, plus mainnet forks back to Berlin' },
    { title: 'Hosted', detail: 'mcp.feelyourprotocol.org' },
  ]"
/>

## What you can do

Six tools. An agent calls them by name.

| Tool | What it does |
| --- | --- |
| `describe_capabilities` | Ask what this server can run: forks, EIPs, and which tool to call. |
| `run_bytecode` | Run a program under a named fork. Read the gas, the return value, and the trace. |
| `run_transaction` | Run a paid transaction and read the receipt. |
| `run_block` | Run a small lab block of one to eight transactions. |
| `generate_artifact` | Build a block access list from that same kind of block. |
| `inspect_artifact` | Check a structure you already have, such as a block access list, without chain state. |

The catalogue on mcp-docs names which EIPs are runnable today. The [explorations](https://feelyourprotocol.org) are the same changes, written for a person to try by hand.

## After this week

The open server covers Glamsterdam and the forks already on mainnet. EIPs that are still ahead of that hardfork start on a paid tier a few weeks later, paid with [x402](/concepts/x402) (USDC on Base). The first expected one is [frame transactions (EIP-8141)](https://eips.ethereum.org/EIPS/eip-8141). Those EIPs join the open server when the next hardfork comes into view. The cycle is on [Pricing](/monetization/pricing#access-cycle).

You supply the accounts, the code, and the transactions. The server runs them in a fresh lab world. It does not read mainnet, compile Solidity, or replay history.

## Where to go

- **Explorations:** [feelyourprotocol.org](https://feelyourprotocol.org)
- **Connect and the tool catalogue:** [mcp-docs.feelyourprotocol.org](https://mcp-docs.feelyourprotocol.org)
- **Countdown:** [X @FeelEthereum](https://x.com/FeelEthereum)

The [roadmap](/roadmap/roadmap) and the [timeline](/roadmap/timeline) are the longer view.

## Changelog

<Changelog
  title="Launch Week Changelog"
  :entries="[
    { version: 'v0.5', date: '2026-10-05', summary: 'Reader-facing launch page. The internal checklist stays on Principles.' },
    { version: 'v0.4', date: '2026-10-01', summary: 'Launch week is the open Glamsterdam MCP. x402 and paid EIPs start after usage and hardening.' },
    { version: 'v0.3', date: '2026-09-24', summary: 'Six launch tools; strategy links include Two Audiences.' },
    { version: 'v0.2', date: '2026-09-02', summary: 'Earlier plan: charge with x402 at launch. Moved to a later paid tier.' },
    { version: 'v0.1', date: '2026-09-02', summary: 'Initial public launch week page — 5–9 Oct 2026 target.' },
  ]"
/>
