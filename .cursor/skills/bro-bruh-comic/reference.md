# Bro & Bruh — bible (load when drafting or reviewing)

Skill workflow and metadata: [SKILL.md](SKILL.md). This file is the franchise lock. Examples below are **negative space** — do not sample them as a menu.

## Characters

| | **Bro** | **Bruh** |
| --- | --- | --- |
| Role | Protocol zen. FYP stand-in. | Stressed / greedy degen. Foil, not the audience. |
| Look | Blonde ponytail. Backwards teal cap, **FYP** on front. Light shirt. | Short dark hair. Muted green/grey. Jacket OK. **No FYP merch.** |
| Face | Serene, half-lidded. Panel 2: blush + pink hearts. | Furrow, phone-glare, mutter. Never bliss. |
| Voice | EIP number, true mechanism, italic `*feel*`. | Coin-time slang. Unique line every episode. |
| Always | Correct about the protocol. Deaf to the crisis. | Wrong-register on the bridge. Never learns in-panel. |

If names, hair, or the cap swap, the draft is invalid.

Audience is protocol-curious. Retail-trader energy is the joke, not the CTA.

## Panel grammar

Exactly two equal horizontal panels, stacked, 3:4. Clean digital comic, thick outlines, no photorealism.

| | Panel 1 | Panel 2 |
| --- | --- | --- |
| Camera | Wide two-shot, full setting, egg visible | Bro close-up; Bruh optional blur |
| Bubble | Bruh (thought unless he clearly addresses Bro) | Bro thought |
| Meta | Yellow title, top-left: `*BRO & BRUH EPISODE N` | Yellow CTA, bottom-right; diamond + `feelyourprotocol.org`, bottom-left |

CTA (invariant): `A NEW FEEL YOUR PROTOCOL EXPLORATION HAS ARRIVED, CHECK IT OUT!`

No token, x402, MCP, or URL in bubbles. The announcement tweet (see [SKILL.md](SKILL.md) § Announcement tweet) carries the exploration link. Caption is Bro/FYP, not Bruh. Do not recap the pun. Image **alt** is required in YAML (`tweet.alt`) even though X’s composer treats it as optional.

## Typography

- ALL CAPS in bubbles, ~12–22 words.
- Bridge word: bold dark red in **both** panels.
- Italics: Bro’s `*FEEL*` only. One ❤️ max, Bro panel 2.
- EIP identity in Bro’s line (`EIP-NNNN` + short expansion). No parentheticals on trader slang.

## Engines

- **mishearing** — Bruh uses a common word as alarm or mutter; Bro hears the spec term (origin: IMMEDIATE).
- **false-friend** — near-homophone, two objects (origin: BALL / BAL).
- **parallel-worlds** — they share a path, not a conversation; Bruh may only think aloud.

The joke is the collision, not Bro dunking.

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
- Bro panics, dunks, or “actually, as a developer…”
- Bruh understands the EIP in panel 2
- Bridge only in one panel; fake EIP number
- Pun diorama (setting *is* the joke word)
- Price targets, tickers, “buy the dip”, community-token shill
- Recycled Bruh crisis pack (`GAS IS SPIKING` / `REKT` / `CLOSE IT` / `HEY BRO` as default)
- Hottest-news chip that does not yield a collision
- `markets` vibe three times in a row without trying (a)+(b) on another register
- Photoreal faces; unreadable lettering
- Tweet recaps the pun, uses Bruh’s vibe chip, hashtag salad, or clones “closer to your heart” / “New FYP exploration of the #… headliner”

## Image prompt reminders

Describe wardrobe, faces, cameras, yellow boxes, hearts, egg, logo. Paste **locked** copy; do not let the model invent words. Ban the consumed list by name. Prefer compositing text if the pipeline allows — in-image lettering is the usual failure.
