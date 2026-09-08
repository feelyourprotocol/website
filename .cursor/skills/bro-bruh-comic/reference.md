# Bro & Bruh — bible (load when drafting or reviewing)

Skill workflow and metadata: [SKILL.md](SKILL.md). This file is the franchise lock. Examples below are **negative space** — do not sample them as a menu.

## Characters

Bro has a **long relationship with the Ethereum protocol**. A protocol fact accidentally enters his mind — **what the EIP solves** — and he drifts into it. Panel 2 is **dreamy**: half-lidded, blush, **pink hearts**. That elsewhere-look is what sells the misunderstanding. An active, wide-eyed, excited Bro looks like he heard Bruh; the reader stops buying two movies. Doubt, sleepiness, and worried faces are also out.

| | **Bro** | **Bruh** |
| --- | --- | --- |
| Role | Protocol love. FYP stand-in. | Stressed / greedy degen. Foil, not the audience. |
| Look | Blonde ponytail. Backwards teal cap, **FYP** on front. Light shirt. | Short dark hair. Muted green/grey. Jacket OK. **No FYP merch.** |
| Face | Warm in panel 1. Panel 2: **dreaming** + hearts (below). Never doubtful, grim, or hyped-active. | Furrow, mutter, elsewhere. Phone optional. Never protocol-bliss. |
| Voice | His own protocol thought — what the change *unlocks*. Not an answer to Bruh. | Plain coin-time. Not metaphors. Bridge is one word inside an ordinary mutter. **No** fork / EIP / gas / testnet. |
| Always | Correct about the protocol. Deaf to Bruh’s movie. | Wrong-register on the bridge. Never learns in-panel. |

### Bro — panel 2 (lock)

`copy.panel2_affect` is **dreaming**. Hearts on the face are required. `*FEEL*` in the bubble is optional.

| Affect | What it looks like | Why |
| --- | --- | --- |
| **dreaming** | Soft focus, half-lidded, blush, **pink hearts** | He is *elsewhere*; the shared word looks accidental |

He does not dunk, lecture, soothe PnL, narrate the widget, or answer Bruh (`WORD?` as a reply). Wide-eyed excited grins belong to a different gag.

If names, hair, or the cap swap, the draft is invalid.

Audience is protocol-curious. Retail-trader energy is the joke, not the CTA.

## Panel grammar

Exactly two equal horizontal panels, stacked, 3:4. Clean digital comic, thick outlines, no photorealism.

| | Panel 1 | Panel 2 |
| --- | --- | --- |
| Camera | Wide two-shot, full setting, egg visible | Bro close-up, dreaming + pink hearts; Bruh optional blur |
| Bubble | Bruh (thought unless he clearly addresses Bro) | Bro thought |
| Meta | Yellow title, top-left: `*BRO & BRUH EPISODE N` | Yellow CTA, bottom-right; **original FYP mark** + `feelyourprotocol.org`, bottom-left |

CTA (invariant): `A NEW FEEL YOUR PROTOCOL EXPLORATION HAS ARRIVED, CHECK IT OUT!`

**Logo (lock):** copy `design/source/logos/with-circle/` — Ethereum octahedron, purple-to-cyan branching network, black ring, white fill. Set readable `feelyourprotocol.org` beside or under it. Do not invent a gear, a lone diamond, or drop the domain.

No token, x402, MCP, URL, or **exploration chrome** in bubbles (widget parts, bars, sliders, scenario names, page layout). The announcement tweet (see [SKILL.md](SKILL.md) § Announcement tweet) carries the exploration link. Caption is Bro/FYP, not Bruh. Do not recap the pun. Image **alt** is required in YAML (`tweet.alt`) even though X’s composer treats it as optional.

## Typography

- ALL CAPS in bubbles, ~12–22 words.
- Bridge word: bold dark red in **both** panels.
- `*FEEL*` in Bro’s bubble is optional. **Pink hearts around Bro in panel 2 are required.**
- EIP identity may appear in Bro’s line (`EIP-NNNN` + short expansion) when it helps the thought. No parentheticals on trader slang.
- Bro’s sentence must parse without the red stamp doing all the work. Not `WORD? EIP-N — canned gloss`. Not an answer to Bruh.
- Bro’s thought names **what the EIP solves** (the good outcome), not a doubtful mechanism lecture.

## Engines

- **mishearing** — Bruh uses a common word as alarm or mutter; Bro hears the spec term (origin: IMMEDIATE).
- **false-friend** — near-homophone, two objects (origin: BALL / BAL).
- **parallel-worlds** — they share a path, not a conversation; Bruh may only think aloud.

The joke is the collision **for the reader**. The two bubbles are fully unrelated movies. They think past each other.

## Bridge word

The red stamp is an **EIP-core** word, not a neighbor. Read motivation/rationale; keep nouns that *are* the change; keep only those that also live in Bro’s protocol-love / future-excitement talk; then see if Bruh can utter the same syllable in coin-time. Shape (not a menu): a spec noun with an excitement idiom beats a nearby constant that barely names the EIP.

## Consumed (as of eip-7708.yml)

Read YAML — this table goes stale. Starting inventory:

| Kind | Used |
| --- | --- |
| Settings | developer den; alpine trail; indoor bouldering gym |
| Bridges | IMMEDIATE; BAL / BALL; LOG |
| Easter eggs | den clutter; marmot + cardboard ETH sign; ETH hold + gecko on carabiner |
| Vibe slugs | `first-bull-2026` (count 1 / cap 4) |

Skill examples that must never be copied as setting/egg: castle + ghost sparking ETH, robot juggling ETH balls, drone ETH house of cards, 2 a.m. laundromat + dryer cat, newspaper press, night train.

## Anti-patterns

- Bro/Bruh looks swapped; FYP cap on Bruh
- Three panels; a third speaker
- Bro panics, dunks, lectures, or looks doubtful / sleepy / worried
- **Active Bro** — wide-eyed excited grin in panel 2. He then looks like he heard Bruh; the misunderstanding dies
- **Shared movie** — both lines about the same event (a fork, a chart, a gas number). They must talk past each other
- **Formula Bro** — `WORD? EIP-N — canned mechanism` (hearts stay; the canned reply goes)
- **Protocol Bruh** — fork, EIP, gas, testnet, client, or other spec nouns in his bubble. Coin-time only
- **Bridge metaphor** — Bruh’s whole line is a figure of speech built so the red word can appear. He talks like a trader; the stamp is one word inside that
- **Phone lock** — Bruh need not stare at a device. Shared activity + elsewhere thoughts is enough
- **Invented logo** — lone diamond, gear ring, or missing `feelyourprotocol.org`. Use the original with-circle mark + domain
- Bruh understands the EIP in panel 2
- Bro answers Bruh (`WORD?` as a reply) — episode 1’s catch is not the default
- Bridge only in one panel; fake EIP number
- **Weak bridge** — a neighbor of the change (wallet constant, UI label, operational slang) that does not name the EIP’s idea. Pick from motivation/rationale, then keep only words that also live in protocol-love / future-excitement talk
- **Product in the bubble** — exploration widgets, gas bars, sliders, scenario names, MCP tools, page chrome
- Pun diorama (setting *is* the joke word)
- Price targets, tickers, “buy the dip”, community-token shill
- Recycled Bruh crisis pack (`GAS IS SPIKING` / `REKT` / `CLOSE IT` / `HEY BRO` as default)
- Hottest-news chip that does not yield a collision
- `markets` vibe three times in a row without trying (a)+(b) on another register
- Photoreal faces; unreadable lettering
- Tweet recaps the pun, uses Bruh’s vibe chip, hashtag salad, or clones “closer to your heart” / “New FYP exploration of the #… headliner”

## Image prompt reminders

Describe wardrobe, faces, **dreamy Bro + pink hearts** in panel 2 (not a wide-eyed excited grin), cameras, yellow boxes, egg, **original with-circle logo + `feelyourprotocol.org`**. Paste **locked** copy; do not let the model invent words. Ban the consumed list by name. No widget chrome in the scene. Prefer compositing text if the pipeline allows — in-image lettering is the usual failure.
