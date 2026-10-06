# Connect

::: tip The server is live
**6 October 2026.** The URL below is open — free, no wallet, no API key. Add it, then ask the first question on this page. Follow [X @FeelEthereum](https://x.com/FeelEthereum) for what ships next.
:::

One URL, no wallet, no API key. Add it to your agent, then ask a question in plain language.

<EndpointCard />

<LaunchFacts
  :facts="[
    { title: 'Cost now', detail: 'Free — full Glamsterdam hardfork' },
    { title: 'Auth', detail: 'None — no wallet, no API key' },
    { title: 'Scope', detail: 'Hosted product only, not a self-host guide' },
  ]"
/>

For browser learning, use **[feelyourprotocol.org](https://feelyourprotocol.org)**. Using the hosted server means you accept the short [Terms](/use/terms).

## Add the server to your agent

<span id="cursor"></span><span id="claude-desktop"></span><span id="openai-codex-cli-agents"></span><span id="other-mcp-hosts"></span>

Pick your client. Each tab has the shortest path for that client.

<ClientTabs />

## After you connect — try this first {#after-you-connect-try-this-first}

Ask your agent:

<PromptCard
  text="Send 1 wei to an empty account under Amsterdam and tell me the gas the wallet would need."
  fork="Amsterdam"
  lookFor="gasUsed near 204,600, with txStateGas near 183,600"
  tool="run_transaction"
  toolHref="/use/tools/run-transaction"
  href="/use/eips/eip-8037"
  hrefLabel="EIP-8037"
/>

That exercises first-touch state gas ([EIP-8037](/use/eips/eip-8037)) without you naming tools or JSON fields. Then browse [Amsterdam now](/use/forks/glamsterdam) for more prompts.

After connect, prefer natural-language questions. The agent should call the server’s generic tools (`run_bytecode`, `run_transaction`, `run_block`, …) — you do not need to memorize them. Optional compare: ask for the **same question on Fusaka then Amsterdam** and diff gas or receipts.

## If it does not work

| Symptom | Try this |
| --- | --- |
| No tools show up | Restart the client or reload MCP servers, then check that the URL ends in `/mcp`. |
| Connection error | Update your client — remote HTTP MCP needs a recent build — and check that the URL ends in `/mcp`. |
| Claude does not list the server | Add it as a custom connector under Customize → Connectors, not in the local config file. |
| The agent answers without calling a tool | Ask it to run the simulation on the MCP server, and name the fork (Amsterdam or Fusaka). |

## What the server exposes

You get probe + run + artifact tools covering Amsterdam and the earlier fork lineage. Machine-readable schemas live under [Reference → Tool schemas](/use/tools/describe-capabilities). Human “what can I ask?” lives on [What you can ask](/use/capabilities).

<CollapsibleChangelog
  title="Connect Changelog"
  :entries="[
    { version: 'v0.16', date: '2026-10-06', summary: 'Hosted endpoint is live. The page is connect-and-ask, not a countdown.' },
    { version: 'v0.15', date: '2026-10-06', summary: 'Launch polish — endpoint card, client tabs with install link and one-line commands, troubleshooting table.' },
    { version: 'v0.14', date: '2026-10-01', summary: 'Cursor, Claude, Codex, and generic HTTP MCP setup; first-test prompt; launch still pending.' },
    { version: 'v0.13', date: '2026-10-01', summary: 'Launch connect is free. Client config still lands with the endpoint.' },
    { version: 'v0.12', date: '2026-09-16', summary: 'Example prompt for a generic Glamsterdam run with no EIP named.' },
    { version: 'v0.10', date: '2026-09-08', summary: 'Added run_transaction; renamed run_evm_bytecode → run_bytecode.' },
    { version: 'v0.9', date: '2026-09-02', summary: 'Launch week countdown — 5–9 Oct 2026 target; link to roadmap launch page.' },
    { version: 'v0.7', date: '2026-08-31', summary: 'Not publicly launched — reframe page as developer early access; point most users to website explorations.' },
    { version: 'v0.6', date: '2026-08-27', summary: 'Two live tools — compare_evm_variants removed.' },
    { version: 'v0.5', date: '2026-08-27', summary: 'Third live tool: compare_evm_variants; catalog is EIP-8024 only.' },
    { version: 'v0.4', date: '2026-07-22', summary: 'Local stdio gateway live — Cursor config, tool list, restart notes, agent guidance.' },
    { version: 'v0.3', date: '2026-07-20', summary: 'Split from overview — connection placeholder under use/.' },
  ]"
/>
