# Agent API & MCP

The server is the lab. The website is the textbook. Both run on EthereumJS.

How to call it lives on [mcp-docs](https://mcp-docs.feelyourprotocol.org). This page is who the lab is for, and where a sentence stops and a run begins. The public door is [open](/roadmap/launch).

<Motto>The model speaks. The server runs.</Motto>

## Who we build for

A call starts empty. The caller brings bytecode, a transaction, or a small world of accounts, and names a fork from Berlin through Glamsterdam. What comes back is gas, logs, a trace, a receipt, or a generated structure, plus provenance. There is no mainnet, no compiler, and no mempool.

That is a narrow door, and it picks the users.

| Who | What they bring | What they leave with |
| --- | --- | --- |
| Protocol engineers, EIP authors, client developers | A fork, and a program or a transaction they wrote to ask one question | The same answer twice. Gas, logs, a trace they can diff. |
| Auditors of upcoming behavior | A scenario they constructed. The contract, the call, the slots. | Stack and gas at the opcode they care about, under the new rules. |
| Wallet and app engineers | The call or the transaction their software will actually send | Whether the upcoming rules change the result they are about to ship. |
| Agent builders | A user question in language, and a schema | A result they can quote. The fork and the spec sit on the provenance. |

Learners and educators stay on the textbook. When one of them reaches the server, it is usually through an agent, with the program already in hand. An agent is not a separate audience. It is how the four groups arrive when nobody is clicking.

<IconNote icon="boundary" title="Outside the lab">

Mainnet and L2 replay, a Solidity compiler, the mempool, and the consensus and networking layers are other products. A searcher who needs live state is outside this door. So is a chat that answers Ethereum questions without a run.

</IconNote>

## Design

The tool list, the schemas, and the limits live on [mcp-docs](https://mcp-docs.feelyourprotocol.org/use/tools/describe-capabilities.html). The shape underneath is small.

<IconNote icon="beaker" title="An isolated world">

The caller brings the world on the same call. Accounts, code, storage. We run it and discard it. A conversation is not EVM memory.

</IconNote>

<IconNote icon="chip" title="Generic verbs">

The fork and the catalogue choose the rules. A comparison is the same verb, called twice. The probe says which forks and which EIPs can actually run.

</IconNote>

<IconNote icon="trace" title="The trace is the product">

Gas, logs, stack, receipts, and the spec snapshot they came from. A bare success flag is not the result we are building.

</IconNote>

<IconNote icon="shield" title="A bounded open service">

Schemas and hard ceilings keep the public server finite. A fixed price per tool belongs to the paid tier, later — see [Pricing](/monetization/pricing).

</IconNote>

## Code and the server

An exploration and a server call are the same execution, met at two distances. The widget fixes the example, so a person can see the question. The server takes a program the caller wrote. There is no second engine.

| | Textbook | Server |
| --- | --- | --- |
| Who writes the program | We do, as a curated example | The caller |
| What changes | The question on the page | Fork, bytecode, transaction, accounts |
| What comes back | A lesson | Gas, logs, a trace, provenance |

The [two legs](/vision/two-legs) are that split. The catalogue on mcp-docs is the list of questions both sides can honestly run.

## Language and execution

Someone asks, in language, what a self-transfer costs on Glamsterdam, or how an opcode differs from Fusaka. The server never sees that sentence. There is no question field.

The agent, or the widget, translates. Intent becomes fields: a fork id, hex, a transaction, accounts. Those fields are the delimiter. Past them, EthereumJS runs, and the result is a number, a log, a trace. The agent may say it back in language. The sentence is the explanation. The run is the answer.

| Step | Who holds it | What crosses |
| --- | --- | --- |
| Intent | A person, or an agent, in language | A question |
| Translation | The agent, or a widget | Fork, bytecode, transaction, accounts. A schema. |
| Execution | The server | A deterministic result |
| Answer | The agent, quoting the run | Language again, with provenance attached |

A bad translation shows up. The schema rejects it, or the run is about a different program than the one in the question. Provenance names the fork and the spec, so the quoted answer can be checked. The translation stays outside the server. Moving it inside would make the result depend on a model.

## Boundaries

One simulation at a time, in a worker, so calls stay parallel. TypeScript is enough. The slow part is the model round-trip, not the EVM. The wall is sequential historical backtesting and archive state. Scaling means more isolated runs, which is the [host](/infrastructure/aws) question. [Principles](/vision/principles) keeps the same line.

## Changelog

<Changelog
  title="Agent API Changelog"
  :entries="[
    { version: 'v0.10', date: '2026-10-06', summary: 'The public door is open.' },
    { version: 'v0.9', date: '2026-10-05', summary: 'Rewrite around who the lab is for, the textbook/server split, and the language-to-run delimiter. Tool catalogue and stale generate plans leave for mcp-docs.' },
    { version: 'v0.8', date: '2026-10-01', summary: 'x402 is a post-launch question. Launch week is the open Glamsterdam endpoint.' },
    { version: 'v0.7', date: '2026-09-24', summary: 'Six generic verbs (run_block, generate_artifact, inspect_artifact); registry discovery for agents.' },
    { version: 'v0.6', date: '2026-09-14', summary: 'BYOS: isolated lab and demand-built prestate; MCP transport session is not EVM memory.' },
    { version: 'v0.5', date: '2026-09-08', summary: 'run_bytecode + run_transaction; renamed from run_evm_bytecode.' },
    { version: 'v0.4', date: '2026-09-02', summary: 'Generic MCP tools shipped (describe_capabilities, run_evm_bytecode); per-EIP tool sketch retired; public launch pending.' },
    { version: 'v0.3', date: '2026-07-15', summary: 'MCP docs site live at mcp-docs.feelyourprotocol.org — this page remains the strategic sketch.' },
    { version: 'v0.2', date: '2026-06-30', summary: 'Reframed as in-progress concept — no shipped API.' },
    { version: 'v0.1', date: '2026-06-30', summary: 'Initial outline — MCP-first delivery, stateless/BYOS design, three use-case scopes.' },
  ]"
/>
