# Problem & Vision

Ethereum changes faster than people can learn it, and faster than an AI can safely guess it.

Protocol updates — EIPs, hard forks, research — are hard to follow, hard to explain, and hard to build against. Feel Your Protocol started as a hands-on way through that: read the change, run it, see what it does.

Agents now take on the same work. Auditing a contract, searching for MEV, testing an upgrade before it lands. They hit a wall:

> **LLMs are probabilistic. The Ethereum protocol is strictly deterministic.**

<IconGrid
  :items="[
    { icon: 'spark', title: 'A model guesses', detail: 'Gas, a cascade of state, a deep stack trace. The answer sounds sure and can still be wrong.' },
    { icon: 'cube', title: 'The protocol does not', detail: 'The same inputs have one result. An oracle is the call that returns it.' },
  ]"
/>

## The oracle

Feel Your Protocol is that oracle for the **future** protocol — the rules that are not on mainnet yet.

A hosted MCP server wraps the modular [EthereumJS](https://github.com/ethereumjs/ethereumjs-monorepo) stack. An agent sends bytecode, a transaction, or a small block, and gets an exact simulation under an upcoming fork.

<Motto>Deterministic truth for probabilistic machines.</Motto>

### Textbook and server

<IconGrid
  :items="[
    { icon: 'book', title: 'Textbook', detail: 'A person learns the change, by hand, on the explorations site.', href: 'https://feelyourprotocol.org' },
    { icon: 'terminal', title: 'Server', detail: 'An agent runs the same change and reads the trace.', href: 'https://mcp-docs.feelyourprotocol.org' },
  ]"
/>

One engine underneath both. [Two legs, one engine](/vision/two-legs).

### People and agents

<IconGrid
  :items="[
    { icon: 'people', title: 'People', detail: 'Researchers, educators, integrators, and the token community.' },
    { icon: 'chip', title: 'Agents', detail: 'They can arrive alone, with nobody who has already allowlisted the tool.' },
  ]"
/>

[Two audiences](/vision/two-audiences).

### What opens

The lab is built. During [launch week](/roadmap/launch) the public server goes live.

<LaunchFacts
  :facts="[
    { title: 'Open', detail: 'Free. No API key, no payment.' },
    { title: 'Glamsterdam', detail: 'The full upcoming hardfork, 5–9 October 2026.' },
    { title: 'Later', detail: 'A paid tier for EIPs still ahead of that fork.' },
  ]"
/>

Schemas and limits live on [mcp-docs](https://mcp-docs.feelyourprotocol.org). The paid cycle is on [Pricing](/monetization/pricing#access-cycle).

## Why us

<IconGrid
  :items="[
    { icon: 'beaker', title: 'The work is already here', detail: 'Years of EIP prototypes, and of maintaining infrastructure inside Ethereum. A model cannot invent that context.' },
    { icon: 'stack', title: 'A stack you can take apart', detail: 'EthereumJS is TypeScript libraries, not one node. Forks switch, state arrives per call, and every step can be traced. Cryptography sits on Noble. A monolithic Rust node is a poor fit.' },
    { icon: 'shield', title: 'A name people trust', detail: 'An education-first brand and an open-source record make it easier to allowlist the server.' },
    { icon: 'scale', title: 'Checked, not claimed', detail: 'The same question, on the same model, once without the server and once with it. The difference is published.' },
  ]"
/>

## The shape of it

<IconGrid
  :columns="3"
  :items="[
    { icon: 'inbox', title: 'You bring', detail: 'Accounts, code, and transactions. A fresh lab world each call.' },
    { icon: 'trace', title: 'You receive', detail: 'Gas, logs, and a step-by-step trace.' },
    { icon: 'boundary', title: 'Outside', detail: 'Chain RPC, an archive of mainnet history, an indexer, long replays of past blocks.' },
  ]"
/>

## Where to go next

<IconGrid
  :items="[
    { icon: 'calendar', title: 'Launch week', detail: 'What opens, and when.', href: '/roadmap/launch' },
    { icon: 'split', title: 'Two legs', detail: 'The textbook and the server.', href: '/vision/two-legs' },
    { icon: 'people', title: 'Two audiences', detail: 'People and agents.', href: '/vision/two-audiences' },
    { icon: 'map', title: 'Roadmap', detail: 'Tracks, then the timeline.', href: '/roadmap/roadmap' },
  ]"
/>

## Changelog

<Changelog
  title="Problem & Vision Changelog"
  :entries="[
    { version: 'v0.8', date: '2026-10-05', summary: 'Icon groups for the wall, the two legs, the two audiences, the moat, and the lab boundary.' },
    { version: 'v0.7', date: '2026-10-05', summary: 'Shorter public page. Dropped the Phase 3 frame from this essay.' },
    { version: 'v0.6', date: '2026-10-01', summary: 'Next ship is the open Glamsterdam MCP. Paid x402 tier follows for EIPs ahead of that hardfork.' },
    { version: 'v0.5', date: '2026-09-24', summary: 'Humans and agents as equal customers; payment, onboarding, and discovery follow from that.' },
    { version: 'v0.4', date: '2026-09-02', summary: 'Lab equipment built — public hosted launch is the next milestone; mcp-docs and generic MCP tools acknowledged.' },
    { version: 'v0.3', date: '2026-07-15', summary: 'MCP docs site live — strategic sketch stays here; concrete docs on mcp-docs.' },
    { version: 'v0.2', date: '2026-06-30', summary: 'Reframed as conceptualization workspace — conditional language for unshipped API.' },
    { version: 'v0.1', date: '2026-06-30', summary: 'Initial problem & vision outline.' },
  ]"
/>
