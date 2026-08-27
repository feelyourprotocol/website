# UI Components

Generic building blocks (inputs, result panels, buttons) live in `src/eComponents/ui/`. They inherit topic colors automatically — see [Styling](/contributing/styling).

When briefing an agent: *“use shared UI components; keep exploration-specific UI in the exploration folder.”*

## Placement rules

| Scope | Location |
| --- | --- |
| Shared across explorations / E-Components | `src/eComponents/ui/` |
| One E-Component only | `src/eComponents/<name>EC/ui/` (none yet) |
| One exploration only | `src/explorations/<id>/` (companion `.vue` files) |

Prefer existing shared components over new ones. API details: read the `.vue` files under `src/eComponents/ui/` — not duplicated here.
