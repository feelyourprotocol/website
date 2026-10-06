# What you can ask

You do not talk to the EVM in JSON. You talk to **your agent**, and the agent calls one hosted lab. These are the jobs the server is built for — at launch, on **Amsterdam (Glamsterdam)** by default, **free**.

## 1. Wallet and transaction gas

<IconNote icon="inbox" title="When it fits">

Intrinsic gas, self-send vs transfer, contract creation limits, receipt logs on value moves, “what gasLimit should my wallet show?”

</IconNote>

<PromptList
  :groups="[
    {
      label: 'Example prompts',
      prompts: [
        { text: `What intrinsic gas does a plain ETH transfer use on Amsterdam?`, fork: 'Amsterdam', href: '/use/eips/eip-2780', hrefLabel: 'EIP-2780' },
        { text: `This calldata is mostly zeros. What does it cost on Amsterdam versus Fusaka?`, fork: 'Fusaka vs Amsterdam', href: '/use/eips/eip-7976', hrefLabel: 'EIP-7976' },
        { text: `Deploy a contract this size on Amsterdam — do I hit the limit?`, fork: 'Amsterdam', href: '/use/eips/eip-7954', hrefLabel: 'EIP-7954' },
        { text: `Does this transfer emit a log in the receipt on Amsterdam?`, fork: 'Amsterdam', href: '/use/eips/eip-7708', hrefLabel: 'EIP-7708' },
        { text: `First 1 wei to an empty account — break down regular vs state gas.`, fork: 'Amsterdam', href: '/use/eips/eip-8037', hrefLabel: 'EIP-8037' },
      ],
    },
  ]"
/>

**Compare (only when you ask):** run the same transfer on **Fusaka** then **Amsterdam** and diff `gasUsed`.

## 2. Bytecode, opcodes, and precompiles

<IconNote icon="chip" title="When it fits">

Stack opcodes, ModExp cost curves, P-256 verify, arbitrary bytecode under a fork.

</IconNote>

<PromptList
  :groups="[
    {
      label: 'Example prompts',
      prompts: [
        { text: `Run this bytecode on Amsterdam and show gas and the final stack.`, fork: 'Amsterdam' },
        { text: `Call ModExp with these inputs — gas on Pectra vs Fusaka.`, fork: 'Pectra vs Fusaka', href: '/use/eips/eip-7883', hrefLabel: 'EIP-7883' },
        { text: `Does secp256r1 precompile accept this signature on mainnet rules?`, fork: 'Fusaka', href: '/use/eips/eip-7951', hrefLabel: 'EIP-7951' },
        { text: `Exercise DUPN/SWAPN on Amsterdam.`, fork: 'Amsterdam', href: '/use/eips/eip-8024', hrefLabel: 'EIP-8024' },
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
        { text: `SSTORE slot 3 from cold — Amsterdam vs Fusaka.`, fork: 'Fusaka vs Amsterdam', href: '/use/eips/eip-8038', hrefLabel: 'EIP-8038' },
        { text: `Seed storage in accounts[] and run this bytecode — what gas?`, fork: 'Amsterdam' },
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
        { text: `Run these two transfers as one Amsterdam block and show each receipt.`, fork: 'Amsterdam' },
        { text: `Set header slot and run one tx — what changes?`, fork: 'Amsterdam', href: '/use/eips/eip-7843', hrefLabel: 'EIP-7843 context' },
        { text: `Clear a storage slot on Amsterdam. What do I pay, and what does the block count?`, fork: 'Amsterdam', href: '/use/eips/eip-7778', hrefLabel: 'EIP-7778' },
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
        { text: `Generate a BAL for this lab block under Amsterdam.`, fork: 'Amsterdam', href: '/use/eips/eip-7928', hrefLabel: 'EIP-7928' },
        { text: `Inspect this BAL JSON — valid structure and hash?`, fork: 'Amsterdam', href: '/use/eips/eip-7928', hrefLabel: 'EIP-7928' },
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
