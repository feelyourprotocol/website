# Marketing Strategy

> **Marketing rides on shipped explorations.** Each new exploration is accompanied by a small announcement arc on [@FeelEthereum](https://x.com/FeelEthereum). No arc without an artefact — nothing else is scheduled or pre-produced.

The [round-trip pipeline](https://website-docs.feelyourprotocol.org) turns out **2–3 new explorations per week**. This page is a high-level map of how each one is announced; detailed copywriting rules per slot live in the corresponding authoring skill.

## Announcement cadence per exploration

Each exploration gets a **2-tweet arc today**, upgraded to a **3-tweet arc** once the [hosted MCP](/roadmap/launch) is live. The tweets space out across the same day or across 1–2 days.

| Slot | Job | Authored via |
| --- | --- | --- |
| **Comic** (spark) | Stops the feed with a protocol-native pun; anchors the exploration in the reader's mind with a fun, lightweight moment | [`bro-bruh-comic`](https://github.com/feelyourprotocol/website/tree/main/.cursor/skills/bro-bruh-comic) skill |
| **Video** (engage) | 45–60 s Shorts-format clip that lands the substance of the EIP, encourages the reader to visit the exploration and check the change against their own domain; points to official sources (spec + Forkcast) | [`video-short`](https://github.com/feelyourprotocol/website/tree/main/.cursor/skills/video-short) skill |
| **MCP tweet** _(post-launch)_ | Shows how an agent uses the EIP via the hosted MCP with a concrete prompt; guides the reader to apply it to their own questions | _skill added during launch week_ |

## Engagement (between announcements)

The announcement arc is the scheduled artefact. Between drops, a **half-automated engagement** loop watches X and stops for a human:

- **Weather briefing** — what is moving in Ethereum protocol (read-only digest + permalinks)
- **Action cards** — reply, quote, or retweet suggestions with a short why, draft copy, and an X intent URL

Quality before quantity (silence is allowed). Cadence is **weekday mornings** (clock in the Cursor Automation). What to check next lives in that automation’s **Memories** (events, controversies, follows) — not a weekday-by-EIP rota. Playbook: [`x-engagement`](https://github.com/feelyourprotocol/website/tree/main/.cursor/skills/x-engagement) skill; lexicon in [`social/watchlist.yml`](https://github.com/feelyourprotocol/website/blob/main/social/watchlist.yml). Evolve the rules with PRs to those files.

The human posts as [@FeelEthereum](https://x.com/FeelEthereum) from the X app. The agent never publishes.

## Further sections

Voice details live in the authoring skills (comic, video, engagement). Channels beyond X, PR & outreach, and measurement will be captured here as they mature.

## Changelog

<Changelog
  title="Marketing Strategy Changelog"
  :entries="[
    { version: 'v0.4', date: '2026-09-10', summary: 'Engagement: memory-led follow-ups (events/controversies) instead of weekday-by-EIP rotation.' },
    { version: 'v0.3', date: '2026-09-10', summary: 'Engagement cadence: one weekday-morning scan; clock lives in the Automation.' },
    { version: 'v0.2', date: '2026-09-09', summary: 'Engagement loop — weather briefing plus reply/quote/retweet suggestions; rules in the x-engagement skill.' },
    { version: 'v0.1', date: '2026-09-03', summary: 'Initial page — per-exploration announcement arc (comic + video today, MCP tweet after launch).' },
  ]"
/>

_Add a one-line entry here whenever the marketing shape changes._
