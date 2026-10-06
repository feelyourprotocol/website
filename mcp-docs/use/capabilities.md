# What you can ask

You do not talk to the EVM in JSON. You talk to **your agent**, and the agent calls one hosted lab. These are the jobs the server runs now — on **Amsterdam (Glamsterdam)** by default, **free**.

## 1. Wallet and transaction gas

<IconNote icon="inbox" title="When it fits">

Intrinsic gas, self-send vs transfer, contract creation limits, receipt logs on value moves, “what gasLimit should my wallet show?”

</IconNote>

<PromptList
  :groups="[
    {
      label: 'Example prompts',
      prompts: [
        { text: `On Glamsterdam, what intrinsic gas does a plain 1 wei transfer to an existing account use?`, fork: 'Amsterdam', href: '/use/eips/eip-2780', hrefLabel: 'EIP-2780' },
        { text: `Call an existing account on Amsterdam with calldata of 100 zero bytes — what is intrinsic gas on Fusaka versus Amsterdam?`, fork: 'Fusaka vs Amsterdam', href: '/use/eips/eip-7976', hrefLabel: 'EIP-7976' },
        { text: `Deploy contract-creation initcode whose runtime code is exactly 24,577 bytes — does it succeed on Fusaka and on Glamsterdam?`, fork: 'Fusaka vs Amsterdam', href: '/use/eips/eip-7954', hrefLabel: 'EIP-7954' },
        { text: `Run a plain 1 wei transfer on Glamsterdam — decode the EIP-7708 Transfer log in the result.`, fork: 'Amsterdam', href: '/use/eips/eip-7708', hrefLabel: 'EIP-7708' },
        { text: `Run a 1 wei transfer to an empty account on Glamsterdam — what gas would a wallet need?`, fork: 'Amsterdam', href: '/use/eips/eip-8037', hrefLabel: 'EIP-8037' },
      ],
    },
  ]"
/>

**Compare (only when you ask):** run the same transfer on **Fusaka** then **Amsterdam** and compare paid gas.

## 2. Bytecode, opcodes, and precompiles

<IconNote icon="chip" title="When it fits">

Stack opcodes, ModExp cost curves, P-256 verify, arbitrary bytecode under a fork.

</IconNote>

<PromptList
  :groups="[
    {
      label: 'Example prompts',
      prompts: [
        { text: `Run PUSH1 1 PUSH1 2 ADD on Amsterdam and show me the gas and the final stack.`, fork: 'Amsterdam' },
        { text: `On Pectra then Fusaka, run the same 32-byte ModExp CALL (base, exponent, and modulus each 32 bytes of 0x02) — how much did gas increase?`, fork: 'Pectra vs Fusaka', href: '/use/eips/eip-7883', hrefLabel: 'EIP-7883' },
        { text: `On Fusaka, CALL precompile 0x100 with a standard valid P-256 test vector (message hash, r, s, pubX, pubY) — does it return 0x01?`, fork: 'Fusaka', href: '/use/eips/eip-7951', hrefLabel: 'EIP-7951' },
        { text: `Give me a minimal DUPN example for depth 17, encode it as bytecode, and run it on Glamsterdam with trace.`, fork: 'Amsterdam', href: '/use/eips/eip-8024', hrefLabel: 'EIP-8024' },
      ],
    },
  ]"
/>

You supply bytecode (and optional [demo accounts](/use/tools/run-bytecode#byos-prestate-accounts)) — the server does not ship demo contracts.

## 3. Storage gas and program gas

<IconNote icon="stack" title="When it fits">

SSTORE/SLOAD pricing, existing-slot vs new-slot behavior, Glamsterdam **state gas** split.

</IconNote>

<PromptList
  :groups="[
    {
      label: 'Example prompts',
      prompts: [
        { text: `Cold SSTORE 9 into storage slot 1 when slot 1 already holds 7 — prefund slot 1 with 7 on the contract, run on Fusaka and on Glamsterdam, and compare call gas.`, fork: 'Fusaka vs Amsterdam', href: '/use/eips/eip-8038', hrefLabel: 'EIP-8038' },
        { text: `On Glamsterdam, run bytecode that cold SSTOREs 9 into storage slot 1 when slot 1 already holds 7 — prefund slot 1 with 7 on the contract first. How much gas does the call use?`, fork: 'Amsterdam', href: '/use/eips/eip-8038', hrefLabel: 'EIP-8038' },
      ],
    },
  ]"
/>

Bytecode path vs transaction path: program gas often belongs in a bytecode run; paid tx totals belong in a transaction run. Your agent can choose; both are supported for 8038.

## 4. Small lab blocks

<IconNote icon="cube" title="When it fits">

Several transactions in one block, header slot/number, per-tx receipts together.

</IconNote>

<PromptList
  :groups="[
    {
      label: 'Example prompts',
      prompts: [
        { text: `Run a lab block on Amsterdam with two plain 1 wei transfers — show each receipt.`, fork: 'Amsterdam' },
        { text: `Run a lab block on Amsterdam with header slot 42 — one transaction calls a contract whose runtime runs SLOTNUM and returns the slot number. What value is returned?`, fork: 'Amsterdam', href: '/use/eips/eip-7843', hrefLabel: 'EIP-7843' },
        { text: `Clear a nonzero storage slot on Glamsterdam — what do I pay, and what does the block count?`, fork: 'Amsterdam', href: '/use/eips/eip-7778', hrefLabel: 'EIP-7778' },
      ],
    },
  ]"
/>

Up to **8** transactions per block. Not historical chain replay.

## 5. Artifacts without executing chain history

<IconNote icon="shield" title="When it fits">

Block access list JSON, structure checks, hashes — caller-supplied blobs.

</IconNote>

<PromptList
  :groups="[
    {
      label: 'Example prompts',
      prompts: [
        { text: `Generate a BAL for a lab block on Amsterdam with one plain 1 wei ETH transfer — what does the access list contain?`, fork: 'Amsterdam', href: '/use/eips/eip-7928', hrefLabel: 'EIP-7928' },
        { text: `Generate a BAL on Amsterdam for one plain transfer, then inspect that BAL JSON — is it well formed and does the hash match?`, fork: 'Amsterdam', href: '/use/eips/eip-7928', hrefLabel: 'EIP-7928' },
      ],
    },
  ]"
/>

## What we do not do

- Compile Solidity or fetch mainnet state
- Run long historical multi-block replays
- Replace your archive node or RPC provider

Details: [Limits](/use/guarantees). Fork catalogue: [Amsterdam](/use/forks/glamsterdam), [EIP index](/use/coverage).

## For integrators — tool names

The agent maps your question to a small set of MCP tools. You rarely need these names; they are listed under **Reference → Tool schemas** when you debug integrations.

| Job (above) | Typical MCP tool |
| --- | --- |
| Discover what is runnable | `describe_capabilities` |
| Bytecode / opcodes / traces | `run_bytecode` |
| Paid tx / receipts / wallet gas | `run_transaction` |
| Multi-tx lab block | `run_block` |
| BAL generate / inspect | `generate_artifact`, `inspect_artifact` |

<CollapsibleChangelog
  title="Capabilities Changelog"
  :entries="[
    { version: 'v0.21', date: '2026-10-06', summary: 'These jobs are live on the hosted MCP, not waiting for a launch window.' },
    { version: 'v0.20', date: '2026-10-06', summary: 'Launch polish — prompt cards per job; wording unchanged.' },
    { version: 'v0.19', date: '2026-10-01', summary: 'Reframed as five user jobs; tool table moved to integrator footnote.' },
    { version: 'v0.18', date: '2026-09-22', summary: 'Probe queryShapes dictionary; EIP/fork rows list tools (MCP names), not shapes.' },
    { version: 'v0.17', date: '2026-09-22', summary: 'Renamed generate → generate_artifact and inspect → inspect_artifact.' },
    { version: 'v0.16', date: '2026-09-17', summary: 'Fusaka runs are first-class for current-mainnet features, not only preview compares.' },
    { version: 'v0.15', date: '2026-09-16', summary: 'generate + inspect — BAL from lab block; inspect without chain state.' },
    { version: 'v0.14', date: '2026-09-16', summary: 'Generic hardfork runs (Glamsterdam default) are first-class — EIP modules remain the per-change catalogue.' },
    { version: 'v0.12', date: '2026-09-14', summary: 'BYOS clarified: isolated from chain, demand-built prestate in-call; not an empty-world rule.' },
    { version: 'v0.11', date: '2026-09-10', summary: 'Fourth tool run_block — lab header snapshot and per-tx receipts.' },
    { version: 'v0.10', date: '2026-09-08', summary: 'Third tool run_transaction; renamed run_evm_bytecode → run_bytecode.' },
    { version: 'v0.9', date: '2026-09-02', summary: 'Status is implemented vs public launch — no stdio / self-host product path.' },
    { version: 'v0.8', date: '2026-08-27', summary: 'Renamed simulate_evm_bytecode → run_evm_bytecode.' },
    { version: 'v0.6', date: '2026-08-27', summary: 'Probe lists opcode/encoding facts; no demo scenarios on the catalog.' },
    { version: 'v0.4', date: '2026-07-22', summary: 'Probe + simulate MCP tools live on stdio gateway v0.1.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Split from overview — end-user capability summary under use/.' },
  ]"
/>
