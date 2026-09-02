# Special Actions

Short-lived or playful features on the main site — summer gags, one-off events, experiments. **Not** part of the contributor path; code may stay in the repo after the UI comes down.

::: info Internal reference
These pages document how we built and operate specific actions. Add a new page under `website-docs/special-actions/` and link it here when another action ships.
:::

## Lifecycle

| Phase | Home page | Tests |
| ----- | --------- | ----- |
| **Active** | Import the action’s `*HomeSection` in `HomeView.vue` | Module tests in `src/<action>/__tests__/` (always) |
| **Archived** | Remove import + component from `HomeView.vue` | Same module tests — **do not** delete; **do not** add special-action blocks to `HomeView.spec.ts` |

**Test convention:** `HomeView.spec.ts` covers permanent home content only. Each special action keeps its own tests under `src/<action>/__tests__/`, including a `*HomeSection.spec.ts` for the home section wrapper. When you deactivate, remove home wiring only — the module test suite stays green and documents how to re-enable.

## Active & archived

| Action | Status | Doc |
| ------ | ------ | --- |
| MCP launch week | Active (home section above Latest) | [Launch week on roadmap](https://roadmap.feelyourprotocol.org/roadmap/launch.html) |
| Ice Cream Week | Archived (home removed July 2026; contract + metadata live) | [Ice Cream Week](./ice-cream-week) |
