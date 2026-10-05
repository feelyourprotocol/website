# Distribution

How someone arrives at the lab. Four channels matter here. Two of them we already use. Two we have not turned on.

<Motto>People hear about it. Agents still have to be pointed at it.</Motto>

| Channel | Who arrives | Where we are |
| --- | --- | --- |
| [X, one to many](#one-to-many-x) | A person in a feed | Running |
| [One to one](#one-to-one) | A specific person we chose | Started, shape still open |
| [Human catalogues](#human-catalogues) | A person browsing a registry or marketplace | Not listed |
| [Agent discovery](#agent-discovery) | An agent, or the host acting for one | Later |

The website is what these channels point at. An exploration is the proof; the hosted MCP is the thing a person can then connect. Open source stays open. We do not market a local stdio setup as the product.

## One to many: X

[@FeelEthereum](https://x.com/FeelEthereum) is the concrete public channel. The shape of a drop lives on [Marketing](/go-to-market/marketing): a comic, then a short video, and a third tweet about the hosted MCP once that server is the thing we can point at. Between drops, a weekday scan drafts a weather note and a few reply, quote, or retweet cards. A person posts them. The agent does not.

What that channel is good at is showing one protocol change to many people who already care about forks. What it is not good at is explaining the server, the price, or how to connect. Those stay one link deep, on the exploration or on mcp-docs.

A few rules already hold, and they should survive a rewrite of the copy:

- The post is about the change, not about the token and not about [x402](/concepts/x402).
- Nothing goes out without an artefact. No countdown thread standing in for a server that is not up.
- Silence is allowed. A weak reply is worse than none.

Open:

- After launch, is the third tweet a concrete prompt against the hosted server, or is a link to mcp-docs enough?
- Does a personal technical account still earn a separate rhythm, or does everything public go through @FeelEthereum?
- What would we even measure — follows, exploration visits, connects — and which of those we are willing to look at?

## One to one

Launch marketing includes direct conversations. That is underway. There is no list, no script, and no cadence written down.

The only rule worth keeping from the earlier sketch: a note should carry something specific — an exploration, or a run the other person can repeat — rather than a generic introduction to the project.

Open:

- Who is worth a deep conversation first? The people the lab is built for are [protocol engineers, auditors, wallet and app engineers, and agent builders](/concepts/api-mcp#who-we-build-for). That is a map of fit, not a target list.
- What is the first thing we send: a link, a short result, or an offer to run something of theirs?
- Does this stay a founder conversation, or do we ever want help drafting the note? Sending it should stay a person either way.

## Human catalogues

The [official MCP Registry](https://modelcontextprotocol.io/registry/about) is a metadata store. Publishers put a `server.json` there (name, URL, how to run it, a description). The registry’s own docs say host apps should not read it directly. People meet servers on downstream marketplaces that pull that metadata and add their own curation.

We are not published. [Registry listings](/roadmap/roadmap) sit in Later, after the open server has been used.

A listing would let a person searching a catalogue find the lab without having seen a tweet. It would not rank us, and it would not explain an EIP. The description and the docs link do that work, or they don’t.

Open:

- Which catalogues do the people we care about actually open — a host’s built-in directory, or a third-party marketplace?
- Is one `server.json` on the official registry enough, because the others scrape it, or do some directories still want their own submission?
- What has to be true on mcp-docs before a stranger who found us in a list can connect without a walkthrough?

## Agent discovery

An agent does not browse X. Today it uses a server a person already connected. Finding the server on its own is a later problem, and the official registry is not that front door: hosts are expected to ask a marketplace, not `registry.modelcontextprotocol.io`.

Once connected, `describe_capabilities` tells the agent what this server can run. That is discovery of scope, not discovery of existence.

Paths that exist, none of them chosen:

| Path | What it would mean | Lean so far |
| --- | --- | --- |
| A person connects us | The agent never has to find us. X, a conversation, or a catalogue did that. | This is how it works now |
| A host marketplace | The official registry feeds it; the host decides what to show and what to allow | Not listed |
| [x402 Bazaar](/concepts/x402) | A buyer can see a paid tool, its schema, and its price | Named as the first paid-discovery step, when the paid tier exists |
| Another agent | Someone else’s agent recommends the server | Named on [Two audiences](/vision/two-audiences). No mechanism picked |

Open:

- For the next few months, is “a person connects us, then their agent stays” the whole goal?
- If we publish once, which metadata has to be good enough for a marketplace search: fork names, the verbs, the fact that the open hardfork is free?
- Bazaar describes a paid call. The open server is free. Do those want different listings, or one listing that says both?

## Changelog

<Changelog
  title="Distribution Changelog"
  :entries="[
    { version: 'v0.5', date: '2026-10-05', summary: 'Rebuilt around four channels: X, one-to-one, human catalogues, and agent discovery. Cadence tables, DevRel framing, and guessed first users left the page.' },
    { version: 'v0.4', date: '2026-10-01', summary: 'Countdown is the open Glamsterdam MCP. Payment-rail posts wait for the paid tier.' },
    { version: 'v0.3', date: '2026-09-03', summary: 'Countdown rhythm row now points to Marketing Strategy for the per-exploration announcement arc (comic + video + MCP).' },
    { version: 'v0.2', date: '2026-09-02', summary: 'Rewritten for launch countdown — DevRel running, hosted-only GTM, oracle-first hook, without/with MCP proofs.' },
    { version: 'v0.1', date: '2026-06-30', summary: 'Initial future GTM outline — registries, outreach hypotheses.' },
  ]"
/>
