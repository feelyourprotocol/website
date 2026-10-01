# Why this server

::: info Prefer the browser?
**[feelyourprotocol.org](https://feelyourprotocol.org)** is the interactive textbook — no MCP setup. This site is for people who want their **agent** to run exact protocol experiments.
:::

## Public launch

**5–9 October 2026** — we open **`https://mcp.feelyourprotocol.org/mcp`**. The endpoint is **not live yet**; [Connect](/use/connect) has the client steps so you can wire your agent before go-live.

| | |
| --- | --- |
| **Cost at launch** | Free — full Amsterdam (Glamsterdam) hardfork, no wallet, no API key |
| **What you bring** | Bytecode, transactions, optional demo accounts per call (no mainnet RPC) |
| **Later** | New EIPs ahead of Amsterdam move to a paid tier — [Pricing](/use/pricing) · [roadmap launch](https://roadmap.feelyourprotocol.org/roadmap/launch.html) |

## The gap

Large language models sound confident about gas, opcodes, and fork diffs. They are not executing the EVM. When Amsterdam lands, a wrong intrinsic gas number or a missed first-touch state cost is not a typo — it is a product bug waiting in your wallet logic, your deploy script, or your audit report.

Feel Your Protocol closes that gap with a **hosted lab**: the same EthereumJS execution stack that powers our public explorations, exposed to your agent through MCP. You ask in plain language; the server runs under the fork you need and returns **deterministic** results — gas, receipts, traces, provenance — not a guess.

**How a run works:** your question → your agent → one isolated lab run → fork, gas, and traces you can cite.

## Why this implementation

| You get | Why it matters |
| --- | --- |
| **Amsterdam by default** | The upcoming hardfork is the product at launch — full Glamsterdam rules, not a cherry-picked demo. |
| **Bring your own state** | Bytecode, transactions, and demo accounts travel in the same call. No archive node, no “trust our mainnet fork.” |
| **Generic verbs** | One server answers opcode, wallet-gas, and small-block questions — your agent picks the shape, not twenty EIP endpoints. |
| **Honest scope** | No Solidity compile, no chain RPC, no multi-block historical replay. What we refuse is as important as what we run. |

## Try these first on Amsterdam

After [Connect](/use/connect), paste a prompt — you do not need EIP numbers in conversation.

| Ask your agent | Twin |
| --- | --- |
| *“What intrinsic gas does a simple ETH transfer use under Amsterdam?”* | [EIP-2780](/use/eips/eip-2780) |
| *“Send 1 wei to an empty account on Amsterdam — what gas does the wallet need?”* | [EIP-8037](/use/eips/eip-8037) |
| *“How does SSTORE on an existing slot price on Amsterdam vs Fusaka?”* | [EIP-8038](/use/eips/eip-8038) |
| *“Does a value transfer emit a receipt log on Amsterdam?”* | [EIP-7708](/use/eips/eip-7708) |

More on the Amsterdam bundle: [deploy limits](/use/eips/eip-7954), [block access lists](/use/eips/eip-7928), [stack opcodes](/use/eips/eip-8024), [SLOTNUM](/use/eips/eip-7843). Already on mainnet here: [ModExp](/use/eips/eip-7883), [P-256](/use/eips/eip-7951) on Fusaka.

## Where to go next

1. **[Connect](/use/connect)** — Cursor, Claude, Codex, and a generic MCP config (steps ready before the URL goes live).
2. **[Amsterdam now](/use/forks/glamsterdam)** — the fork bundle and the questions we highlight first.
3. **[What you can ask](/use/capabilities)** — five jobs this server is built for.

Want to click through a change first? The [website explorations](https://feelyourprotocol.org) are the visual twin of many Amsterdam EIPs — same questions, human UI.

## Changelog

<Changelog
  title="Introduction Changelog"
  :entries="[
    { version: 'v0.16', date: '2026-10-01', summary: 'Launch table and Amsterdam prompt table moved from home — home is hero + features only.' },
    { version: 'v0.15', date: '2026-10-01', summary: 'User-facing rewrite — why deterministic Amsterdam lab; removed internals-first framing.' },
    { version: 'v0.14', date: '2026-10-01', summary: 'Launch is a free Glamsterdam MCP. Paid tier for newer EIPs comes later.' },
    { version: 'v0.13', date: '2026-09-22', summary: 'Six launch tools — generate_artifact and inspect_artifact with the four run/probe verbs.' },
    { version: 'v0.11', date: '2026-09-08', summary: 'Three launch tools — describe_capabilities, run_bytecode, run_transaction.' },
    { version: 'v0.10', date: '2026-09-02', summary: 'User docs describe the hosted product only — no local stdio / self-host early access.' },
    { version: 'v0.9', date: '2026-08-31', summary: 'Lead with not publicly launched — website explorations for most visitors; local stdio as early access only.' },
    { version: 'v0.8', date: '2026-08-27', summary: 'Fusaka mainnet baseline fork for run-twice comparisons against Glamsterdam preview.' },
    { version: 'v0.7', date: '2026-08-27', summary: 'Two live MCP tools — compare removed; use simulate twice.' },
    { version: 'v0.6', date: '2026-08-27', summary: 'Catalog describes capabilities (opcodes/encoding), not website demo programs.' },
    { version: 'v0.4', date: '2026-07-22', summary: 'Local stdio gateway v0.1 live — two MCP tools.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Split from overview — end-user introduction under use/.' },
    { version: 'v0.1', date: '2026-07-15', summary: 'Initial overview content (pre-split).' },
  ]"
/>
