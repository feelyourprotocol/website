# UI Components

Generic building blocks (inputs, result panels, buttons) live in `src/eComponents/ui/`. Most inherit topic colors automatically — see [Styling](/contributing/styling). Segmented on/off chrome is an exception: high-contrast slate so the active option is obvious, not topic-tinted.

When briefing an agent: *“use shared UI components; keep exploration-specific UI in the exploration folder.”*

## Placement rules

| Scope | Location |
| --- | --- |
| Shared across explorations / E-Components | `src/eComponents/ui/` |
| One E-Component only | `src/eComponents/<name>EC/ui/` (none yet) |
| One exploration only | `src/explorations/<id>/` (companion `.vue` files) |

Prefer existing shared components over new ones. API details: read the `.vue` files under `src/eComponents/ui/` — not duplicated here.

## Same control, one look

If two explorations need the same chrome (segmented two-button, primary run action, example picker), they share one UIC. Discovering a duplicate while adding an exploration is a stop-and-extract: add the UIC plus tests, then switch **every** call site. Do not restyle a copy. This is not a new E-Component.

Example: `SegmentedToggleUIC` (Osaka | Amsterdam, and any other two-or-more option group).

## Result panels before run

Mount comparison/outcome UI with the scenario — idle placeholders, fixed min-height for the tallest example — so clearing run state does not collapse layout. Details: [exploration-design.mdc](https://github.com/feelyourprotocol/website/blob/main/.cursor/rules/exploration-design.mdc) § Result panels.
