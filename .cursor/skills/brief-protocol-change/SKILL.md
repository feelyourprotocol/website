---
name: brief-protocol-change
description: >-
  Brief a new Feel Your Protocol protocol change (EIP, ERC, research) before
  scaffolding an exploration or MCP module. Use when choosing what to build next,
  starting an exploration, or adding an MCP twin.
---

# Brief a protocol change

Run **before** [add-exploration](../add-exploration/SKILL.md) or engine [add-mcp-module](https://github.com/feelyourprotocol/mcp-execution-engine/blob/main/.cursor/skills/add-mcp-module/SKILL.md).

Answers land in `src/explorations/eip-NNNN/canonical.ts` — not only in chat.

## Who (name at least one; curiosity is enough)

1. **Who cares — and why?** Blocked builder, excited protocol-watcher, researcher shaping a draft, or a mix. Do not force a “who is blocked” story.
2. **What would they ask an agent to understand?** And (if relevant) what would they run with *their* data? Include play/understand prompts, not only production cases. These become MCP docs page prompts.

## Nature

Read `ChangeNature` in [`canonicalTypes.ts`](../../src/explorations/canonicalTypes.ts).

3. **Primary change nature?** Drives widget center and MCP summary.
4. **What is *not* the point?** (Avoid copying the wrong sibling UI — e.g. gas compare for a new-capability precompile.)

## Question worth centering

5. **Core question** — one sentence. Becomes bold `introText` lead and MCP page “what became possible.”
6. Worth centering if **any** of: changes what someone can do or must pay; surprising invariant prevents a mistake; distinctive new/research piece people want to *feel*; further-out work can feed spec or tests.

## Shape / twin (no orphan explorations)

7. **Query shape:** `simulate` · `generate` · (future) other verb.
8. **MCP docs page:** Can we honestly explain how MCP addresses this problem set *today* or with a **named planned verb**? If neither — do not add the exploration (or sunset it).

## Ship gates

| Artifact | Required when |
| --- | --- |
| `canonical.ts` | Every exploration |
| Website exploration | First-round feeling |
| `mcp-docs/use/eips/eip-NNNN.md` | Every **live** exploration (Runnable or Planned) |
| Engine module | When a shipped verb can actually run the change |

## Human review

Stop after briefing + `canonical.ts` draft for human sign-off on core question and audience before widget or MCP work.
