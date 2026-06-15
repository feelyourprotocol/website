# AI-Assisted Development

Most explorations on Feel Your Protocol are — and are expected to be — built with AI coding assistants. This is a feature, not a caveat: the project's folder-per-exploration structure, typed interfaces, and reusable components are designed to be AI-friendly. This page collects practical guidance on how to get the best results.

## Recommended Workflow

### 1. Clone and Set Up Locally

AI agents work best when they can read, run, and iterate on actual code. Start with a local checkout:

```bash
git clone https://github.com/feelyourprotocol/website.git
cd website
npm install
npm run dev
```

### 2. Point the AI at the Docs

Before writing any code, instruct your agent to read the project documentation. The docs are compact and self-contained — an agent can absorb them in one pass:

> _Read all files under `docs/` to understand the project structure, contribution guidelines, and component APIs. Then follow the step-by-step guide in "Adding an Exploration" to create a new exploration for EIP-XXXX._

Key pages the agent should internalize:

| Page                                                           | Why                                                                  |
| -------------------------------------------------------------- | -------------------------------------------------------------------- |
| [Architecture](/guide/architecture)                            | Content model, taxonomies (topics, timeline, tags), design decisions |
| [E-Components](/contributing/e-components)                     | Integration model, extension points, composition                     |
| [Adding an Exploration](/contributing/adding-an-exploration)   | Step-by-step creation guide with field reference                     |
| [Available E-Components](/contributing/available-e-components) | Ready-to-use building blocks — check here before building custom     |
| [Styling & Design](/contributing/styling)                      | CSS variables, design system classes — avoid hardcoded colors        |
| [Code Conventions](/contributing/code-conventions)             | Import order, naming, linting rules                                  |

### 3. Pick the Right Starting Point

Not all explorations require the same effort. Help the agent choose in this order:

1. **Check [Available E-Components](/contributing/available-e-components) first.** If one matches, wire config, examples, and execution — often under 30 lines in `MyC.vue`.
2. **Need more than the core E-Component provides?** Add exploration-local UI via slots or companion components. See [Extending When the Core E-Component Is Not Enough](/contributing/adding-an-exploration#extending-when-the-core-e-component-is-not-enough).
3. **Nothing fits?** Build a custom widget with shared UI components and `ExplorationC`. More freedom, more code.

For reference explorations by pattern: [EIP-7951](https://github.com/feelyourprotocol/website/blob/main/src/explorations/eip-7951/MyC.vue) (precompile), [EIP-8024](https://github.com/feelyourprotocol/website/blob/main/src/explorations/eip-8024/MyC.vue) (bytecode stepper with companion panel).

### 4. Iterate with the Dev Server Running

Have the agent run `npm run dev` and keep it running. After each change, check the browser. AI agents are good at generating plausible code but may miss visual issues — spacing, overflow, color contrast — that are obvious on screen.

### 5. Run Quality Checks Before Submitting

Instruct the agent to run all checks and fix any issues:

```bash
npm run lf           # format + lint (auto-fix)
npm run type-check   # TypeScript type checking
npx vitest run       # unit tests
```

## Prompting Tips

### Be Specific About the EIP

Give the agent the EIP number, a link to the spec, and a one-sentence summary of what the exploration should let users do. The more concrete the goal, the better the output:

> _Create an exploration for EIP-7883 (ModExp gas cost increase). The widget should let users enter ModExp inputs (base, exponent, modulus) and compare gas costs before and after the change._

### Reference Existing Explorations

Existing explorations are the best examples. Point the agent at one with a similar pattern:

> _Look at `src/explorations/eip-7951/` for a precompile exploration, or `src/explorations/eip-8024/` for a bytecode stepper with a companion panel._

### Let the Agent Read Real Source Files

Documentation describes the intended patterns, but the source files show the actual implementation. If the agent is unsure about something, tell it to read the relevant source — for example the config type in `src/eComponents/<name>EC/types.ts`, or an existing exploration's `MyC.vue` and `config.ts`.

### Ask for Incremental Steps

Large prompts that ask for everything at once tend to produce lower-quality results. Break the work into stages:

1. "Create `info.ts` with the metadata"
2. "Create `examples.ts` with three example presets"
3. "Create `config.ts` and wire `MyC.vue` (E-Component or custom widget)"
4. "Register in `REGISTRY.ts` and verify it builds"
5. "Add unit tests"
6. "Add companion components or helpers if the E-Component core is not enough"

## Common Pitfalls

### Hardcoded Colors

AI agents love to write `text-blue-600` or `bg-green-100`. The project uses a topic-aware color system via CSS variables — hardcoded colors will look wrong when the exploration's topic changes. Remind the agent:

> _Use `e-text`, `e-result-box`, and the other `e-_` CSS classes instead of hardcoding Tailwind color utilities. Read the Styling & Design docs.\*

### Stale Patterns

If your agent's training data is older than the project, it may generate patterns that don't match current conventions (wrong import paths, outdated component APIs). The fix is always the same: tell it to read the actual source files rather than guessing.

### Inventing Components

Agents sometimes fabricate component names or props that don't exist. If the output references a component you haven't seen before, have the agent verify it exists:

> _Search the codebase for `ComponentName` before using it. If it doesn't exist, use the documented alternatives._

### Skipping the Registry

The agent may create all the exploration files but forget to add the import to `REGISTRY.ts`. The exploration won't appear until it's registered. The [Adding an Exploration](/contributing/adding-an-exploration#step-5-register-in-the-registry) guide covers this step.

### Wrong Taxonomy Values

Agents may guess topic, timeline, or tag values. Remind them that topics and timeline entries are a fixed set — the agent should read `TOPICS.ts` and `TIMELINE.ts` to see the valid IDs. Tags come from the `Tag` enum in `TAGS.ts` and new ones can be proposed, but must follow the [tag rules](/guide/architecture#tags).

### Extension UI Outside the Slot Tree

When adding companion panels to an E-Component, agents often mount them as siblings next to the E-Component in `MyC.vue`. Provide/inject only works for **descendants** — extension UI must go inside an E-Component slot (e.g. `#below`, `#result`). See [E-Components — Extension Points](/contributing/e-components#extension-points).

## Cursor / IDE-Specific Tips

If you are using [Cursor](https://cursor.com/) or a similar AI-native IDE:

- **Add the docs as context.** Use `@docs/` to reference the documentation folder so the agent has the full contribution guidelines in scope.
- **Use the existing `.cursorrules` or project rules** if available — they encode project-specific conventions the agent should follow.
- **Run terminal commands through the agent.** Let the agent run `npm run lf`, `npm run type-check`, and `npx vitest run` directly so it can read and fix errors in the same session.

## What to Review as a Human

Even with a capable AI agent, a human review pass matters. Focus on:

- **Does the widget actually help understand the protocol change?** The agent can build a functional UI, but the pedagogical value — what makes an exploration genuinely useful — comes from human judgment about what to highlight and how to frame it.
- **Are the intro and usage texts accurate?** AI-generated descriptions of EIPs can be subtly wrong. Cross-check against the actual specification.
- **Are the examples meaningful?** Good examples demonstrate edge cases and realistic inputs, not just `0x00` and `0xff`.
- **Does it look right?** Open the dev server and visually inspect. Check spacing, overflow on different screen sizes, and color consistency.
