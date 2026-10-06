---
layout: home

hero:
  name: Feel Your Protocol
  text: MCP server for the next Ethereum
  tagline: Live since 6 October 2026 — free Amsterdam simulations for your agent. Connect, then ask a question.
  actions:
    - theme: brand
      text: Connect
      link: /use/connect
    - theme: alt
      text: Why this server
      link: /use/introduction

features:
  - icon:
      src: /icons/connect.svg
      width: 28
      height: 28
    title: Connect
    details: Cursor, Claude, Codex — one hosted URL. Paste it and ask.
    link: /use/connect
  - icon:
      src: /icons/amsterdam.svg
      width: 28
      height: 28
    title: Amsterdam now
    details: Full Glamsterdam hardfork, live now. Gas, receipts, and bytecode under upcoming rules.
    link: /use/forks/glamsterdam
  - icon:
      src: /icons/ask.svg
      width: 28
      height: 28
    title: What you can ask
    details: Wallet gas, opcodes, storage pricing, lab blocks — five jobs, no tool memorization.
    link: /use/capabilities
  - icon:
      src: /icons/explore.svg
      width: 28
      height: 28
    title: Browser explorations
    details: Prefer clicking through a change first? Same questions on feelyourprotocol.org.
    link: https://feelyourprotocol.org
---

<div class="fyp-home-section">

## Your first question

Once you are connected, paste this into your agent. No EIP number, no JSON.

<PromptCard
  text="Send 1 wei to an empty account under Amsterdam and tell me the gas the wallet would need."
  fork="Amsterdam"
  lookFor="gasUsed near 204,600, with txStateGas near 183,600"
  tool="run_transaction"
  toolHref="/use/tools/run-transaction"
  href="/use/eips/eip-8037"
  hrefLabel="EIP-8037"
/>

## Find your way

<DoorStrip
  :items="[
    { title: 'EIP pages', detail: 'Twelve changes, each with prompts you can copy.', href: '/use/coverage' },
    { title: 'Limits', detail: 'Determinism, bring-your-own-state, hard ceilings.', href: '/use/guarantees' },
    { title: 'Tool schemas', detail: 'Reference for the six MCP tools.', href: '/use/tools/describe-capabilities' },
    { title: 'Pricing', detail: 'Free now. A paid tier for later EIPs.', href: '/use/pricing' },
  ]"
/>

</div>
