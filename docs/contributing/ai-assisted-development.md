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

> *Read all files under `docs/` to understand the project structure, contribution guidelines, and component APIs. Then follow the step-by-step guide in "Adding an Exploration" to create a new exploration for EIP-XXXX.*

Key pages the agent should internalize:

| Page | Why |
|------|-----|
| [Architecture](/guide/architecture) | Content model, taxonomies (topics, timeline, tags), design decisions |
| [Adding an Exploration](/contributing/adding-an-exploration) | Step-by-step creation guide with field reference |
| [Available E-Components](/contributing/available-e-components) | Reusable components that can save 80% of the work for precompile explorations |
| [Styling & Design](/contributing/styling) | CSS variables, design system classes — avoid hardcoded colors |
| [Code Conventions](/contributing/code-conventions) | Import order, naming, linting rules |

### 3. Pick the Right Starting Point

Not all explorations require the same effort. Help the agent choose:

- **Precompile exploration?** → Use the Precompile Interface E-Component. The agent only needs to define a config, examples, and a result slot. This can be done in under 50 lines of widget code.
- **Custom widget?** → The agent builds from scratch using shared UI components. More freedom, more code, but the `ExplorationC` wrapper still handles the chrome (title, intro, links).

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

> *Create an exploration for EIP-7883 (ModExp gas cost increase). The widget should let users enter ModExp inputs (base, exponent, modulus) and compare gas costs before and after the change.*

### Reference Existing Explorations

Existing explorations are the best examples. Point the agent at a similar one:

> *Look at `src/explorations/eip-7951/` as a reference — this new exploration follows the same precompile interface pattern.*

### Let the Agent Read Real Source Files

Documentation describes the intended patterns, but the source files show the actual implementation. If the agent is unsure about something, tell it to read the relevant source:

> *Read `src/eComponents/precompileInterfaceEC/types.ts` to understand the PrecompileConfig interface.*

### Ask for Incremental Steps

Large prompts that ask for everything at once tend to produce lower-quality results. Break the work into stages:

1. "Create `info.ts` with the metadata"
2. "Create `examples.ts` with three example presets"
3. "Create the widget in `MyC.vue`"
4. "Register in `REGISTRY.ts` and verify it builds"
5. "Add unit tests"

## Common Pitfalls

### Hardcoded Colors

AI agents love to write `text-blue-600` or `bg-green-100`. The project uses a topic-aware color system via CSS variables — hardcoded colors will look wrong when the exploration's topic changes. Remind the agent:

> *Use `e-text`, `e-result-box`, and the other `e-*` CSS classes instead of hardcoding Tailwind color utilities. Read the Styling & Design docs.*

### Stale Patterns

If your agent's training data is older than the project, it may generate patterns that don't match current conventions (wrong import paths, outdated component APIs). The fix is always the same: tell it to read the actual source files rather than guessing.

### Inventing Components

Agents sometimes fabricate component names or props that don't exist. If the output references a component you haven't seen before, have the agent verify it exists:

> *Search the codebase for `ComponentName` before using it. If it doesn't exist, use the documented alternatives.*

### Skipping the Registry

The agent may create all the exploration files but forget to add the import to `REGISTRY.ts`. The exploration won't appear until it's registered. The [Adding an Exploration](/contributing/adding-an-exploration#step-5-register-in-the-registry) guide covers this step.

### Wrong Taxonomy Values

Agents may guess topic, timeline, or tag values. Remind them that topics and timeline entries are a fixed set — the agent should read `TOPICS.ts` and `TIMELINE.ts` to see the valid IDs. Tags come from the `Tag` enum in `TAGS.ts` and new ones can be proposed, but must follow the [tag rules](/guide/architecture#tags).

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
