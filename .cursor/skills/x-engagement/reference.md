# X engagement — reference

Recipes for [SKILL.md](SKILL.md). Query strings live in [`social/watchlist.yml`](../../social/watchlist.yml). Tune those files; do not grow a handle allowlist here.

## Rotation

The **Cursor Automation** owns the schedule (weekday morning, Europe/Berlin). Do not duplicate cron times here.

Search *what* still rotates so one run per day does not hammer the same family: use **today’s weekday (Mon–Fri)** against [`watchlist.yml`](../../social/watchlist.yml) `rotation.by_weekday`.

`builder_pain` is a **spice** family: at most one extra Round A query when the chosen family came back thin — not a second default search.

If the run is unscheduled (manual Test), use **today’s weekday** the same way. Weekend manual runs: pick `fri`.

## Round A — protocol weather

Goal: what is moving in **Ethereum protocol** (EL, forks, EVM, gas, clients, ACD). Not price.

Keep each `x_search` prompt tight: “Return at most 8 recent posts with permalink, handle, and one-line gist. Protocol / client / EL / gas / fork only.”

Do **not** set `allowed_x_handles`. You **may** set `excluded_x_handles` (max 20) to `FeelEthereum` plus cooldown handles from Memories (no `@`).

Do **not** set `enable_image_understanding` or `enable_video_understanding` (cost).

### Drop (weather and actions)

Price, ETF, airdrop, points, memecoin, “gm” with no payload, personal drama, engagement bait, the same viral joke twice, city-Amsterdam tourism, sports.

## Round B — problem match

Search the **pain**, not the EIP id. Phrases: `watchlist.yml` → `problem_slices`. Lead the `x_search` prompt with those phrases + “Ethereum” / “EVM” / “wallet” as needed. Mention the EIP number in the **prompt to Grok** only as disambiguation if the phrase is ambiguous (e.g. BAL), not as the query itself.

**EIP-number query** (optional, last resort): one search like `EIP-8037 OR EIP-7708` covering **live** ids only. Diversity penalty: if the same handles as a previous run’s EIP search show up, skip them unless the tweet is unusually good.

Skip `docsStatus: sunset`. `planned-module` (today: `eip-7928`) may be mentioned honestly (“the exploration is live; the MCP verb is still planned”) — do not imply a runnable MCP tool.

## x_search

```bash
curl -sS https://api.x.ai/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -d '{
    "model": "grok-4.6",
    "input": [{"role": "user", "content": "PROMPT"}],
    "tools": [{
      "type": "x_search",
      "from_date": "YYYY-MM-DD",
      "excluded_x_handles": ["FeelEthereum"]
    }]
  }'
```

- Use `grok-4.6` unless xAI docs list a cheaper model that still supports `x_search`. Do not invent model ids.
- `from_date`: yesterday UTC (`YYYY-MM-DD`). Omit `to_date` unless debugging.
- Parse **citations / permalinks** from the response. If a hit has no URL, skip it.
- After **2026-09-21**, xAI bills X Search per **post fetched**. Keep prompts “at most 8 posts.”

## Intent URLs (action cards only)

Encode `text` with `application/x-www-form-urlencoded` (spaces as `%20` or `+`). Keep drafts well under 280; the URL itself counts as 23 on X.

| Action | URL |
| --- | --- |
| Reply | `https://x.com/intent/post?in_reply_to=<TWEET_ID>&text=<DRAFT>` |
| Quote | `https://x.com/intent/post?text=<DRAFT>&url=https://x.com/<HANDLE>/status/<TWEET_ID>` |
| Retweet | `https://x.com/intent/retweet?tweet_id=<TWEET_ID>` |

If `x.com/intent/post` fails in testing, the same query string on `https://twitter.com/intent/tweet` is the older alias.

**Tweet id:** the numeric status id, not the whole URL.

Intent links **do not** select @FeelEthereum. Android + Telegram often open an in-app browser.

## Telegram

`POST https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage`

JSON body: `chat_id` = `$TELEGRAM_CHAT_ID`, `text` = body, `disable_web_page_preview` = `false` for weather (preview the first link), `true` for action cards (intent URL should not steal the preview from the source permalink). **Plain text** (no `parse_mode`) — fewer breakage hazards with underscores in handles.

Send **only** to `TELEGRAM_CHAT_ID`. If a send fails, retry once; then put the body in the run transcript.

### Weather message

One message per run.

```text
FYP weather — <YYYY-MM-DD>

<4–8 lines: what’s moving. Fork/ACD, clients, mechanics. No pitch.>

Links:
• @handle — <one line why>
  https://x.com/<handle>/status/<id>

(If quiet:)
FYP weather — <YYYY-MM-DD>
Quiet on protocol X this scan. No links worth a click.
```

Cap **10** bullets. Prefer **5–8**. Diverse corners (not five client-team accounts). No intent URLs. No “you should reply.”

### Action message

One message per card (skip is per item).

```text
<Reply | Quote | Retweet> · @handle
<source permalink>

Why:
<2–4 sentences: weather vs problem-match; which exploration if any, with URL; why this is not a repeat corner.>

Draft:
<text, or (none) for Retweet>

Open in X:
<intent URL>
```

If zero cards, one extra message:

```text
FYP actions — nothing cleared the bar this run.
```

## Memories

Store outside git (Automation Memories). Suggested shape:

```text
cooldown_days: 5
seen:
  - { at: 2026-09-09, handle: example, tweet_id: "123", kind: weather }
  - { at: 2026-09-09, handle: other, tweet_id: "456", kind: reply }
```

Prune entries older than 14 days. Weather permalinks **do** cooldown that handle for **action** cards. They may still appear in a later weather briefing if the post is new and the corner would otherwise be empty — prefer a different handle when you can.
