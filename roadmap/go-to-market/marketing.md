# Marketing

Marketing is how we understand the market, shape how Feel Your Protocol is seen, and communicate why it is useful. The goal is to make a person want to try the product.

This page covers those three jobs. The [product proposition](/concepts/api-mcp), [price](/monetization/pricing), and channels people or agents arrive through ([Distribution](/go-to-market/distribution)) have their own pages.

<Motto>Listen for the problem. Show the thing that exists.</Motto>

## Understand the market

We do not have a research program. We have three small feedback surfaces, two of them already running.

<IconGrid :columns="3" :items="[
  { icon: 'inbox', title: 'Listen', detail: 'The weekday X scan shows what protocol people are discussing. It is a weather report, not market research.' },
  { icon: 'people', title: 'Talk', detail: 'One-to-one launch conversations can surface the questions people would actually bring to the lab.' },
  { icon: 'trace', title: 'Observe', detail: 'The private usage view can show which tools get called and where requests fail once the server has traffic.' },
]" />

The possible users are already named: protocol engineers, EIP authors, auditors, wallet and app engineers, and agent builders. That list comes from what the lab can honestly do; it is not evidence that each group wants it.

What matters next is not a broad survey. It is a small record of what we hear and what people do:

| Question | Evidence we could keep |
| --- | --- |
| Which problems recur? | A short note from direct conversations and relevant X threads |
| Who returns after trying it? | Repeat calls in the usage view, without building a profile of the caller |
| Where does interest stop? | Could not connect, could not form the input, missing capability, or no repeat need |
| Which audience gets durable value? | A handful of concrete uses, not a persona invented in advance |

<IconNote icon="boundary" title="Keep this light">

No research theatre and no dashboard because marketing says there should be one. Write down repeated evidence; change the product or the message only when a pattern appears.

</IconNote>

## Shape the brand

The visual system already has a point of view. It is technical without looking like infrastructure documentation, and playful without making the protocol look trivial.

<IconGrid :columns="2" :items="[
  { icon: 'book', title: 'One recognisable system', detail: 'Monospace type, topic colours, generated link cards, and the same visual language across the textbook, docs, roadmap, and social surfaces.' },
  { icon: 'beaker', title: 'Competence you can click', detail: 'An exploration is not a claim of expertise. It is an interactive example built on the same EthereumJS stack as the lab.' },
  { icon: 'spark', title: 'A human front', detail: 'Technical cover art, Bro & Bruh comics, and short videos make a dense protocol change approachable.' },
  { icon: 'shield', title: 'Precision underneath', detail: 'Pinned specs, provenance, boundaries, and honest gaps keep the playful surface from turning into hype.' },
]" />

The cover system is deliberately constrained: greyscale plus one topic colour, abstract technical illustration, one focal point. The broader interface carries the same topic colours and a code-first, cypherpunk tone. Comics and videos extend the identity without replacing the technical artefact.

The useful perception to protect is simple: **playful on the surface, exact underneath**.

That means:

- the token and [x402](/concepts/x402) are never the headline;
- a new visual or post points to something that runs;
- the website and MCP describe the same capability and the same limit;
- no “oracle” language that promises archive state, historical backtesting, or anything else outside the lab.

Possible next checks:

- Does the first visit to the website, mcp-docs, and a future registry listing feel like the same product?
- Once the MCP is public, can one compact visual show prompt → tool → trace without becoming another explainer format?
- Are the comics widening the door while the video and MCP post carry the more technical reader, or are those roles only assumed?

## Communicate what shipped

The existing loop is deliberately small. Each exploration produces the artefact and the communication around it; nothing is pre-produced just to fill a calendar.

| Piece | Job | State |
| --- | --- | --- |
| **Comic** | Stop the feed with a protocol-native joke and make the change memorable | Running |
| **Short video** | Explain what the EIP does and invite the viewer to test it against their own domain | Running |
| **MCP post** | Show one concrete prompt against the hosted server | After launch; exact shape open |
| **X engagement** | Keep listening and join a useful conversation between releases | Weekday scan; human decides and posts |

The detailed voice and production rules stay in the comic, video, and engagement skills. [Distribution](/go-to-market/distribution) owns where these pieces travel.

<IconNote icon="check" title="The operating rule">

No artefact, no announcement. Silence is better than a generic post.

</IconNote>

## Changelog

<Changelog
  title="Marketing Changelog"
  :entries="[
    { version: 'v0.9', date: '2026-10-05', summary: 'Rebuilt around market understanding, brand perception, and communication that follows shipped work. Existing listening, visual identity, announcement arc, and honest gaps made explicit.' },
    { version: 'v0.8', date: '2026-09-14', summary: 'Announcement tweets are shown at round-trip close after merge; comic and video skills still author the YAML.' },
    { version: 'v0.7', date: '2026-09-10', summary: 'Engagement weather: high-stakes MCP complement (Base when it clears the bar); exploration add/sunset keeps the watchlist lexicon in sync.' },
    { version: 'v0.6', date: '2026-09-10', summary: 'Engagement weather: always-on “what moved” search plus broader family queries; fewer overlapping searches.' },
    { version: 'v0.5', date: '2026-09-10', summary: 'Engagement weather: cluster quotes/replies of the same story into one bullet.' },
    { version: 'v0.4', date: '2026-09-10', summary: 'Engagement: memory-led follow-ups (events/controversies) instead of weekday-by-EIP rotation.' },
    { version: 'v0.3', date: '2026-09-10', summary: 'Engagement cadence: one weekday-morning scan; clock lives in the Automation.' },
    { version: 'v0.2', date: '2026-09-09', summary: 'Engagement loop — weather briefing plus reply/quote/retweet suggestions; rules in the x-engagement skill.' },
    { version: 'v0.1', date: '2026-09-03', summary: 'Initial page — per-exploration announcement arc (comic + video today, MCP tweet after launch).' },
  ]"
/>
