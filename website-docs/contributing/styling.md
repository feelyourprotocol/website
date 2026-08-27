# Styling & Design

Explorations inherit **topic colors** automatically. You do not need CSS class names to brief or review an agent — the shared design system handles colors.

## What you need to know

- Each exploration belongs to a **topic** (Scaling, UX, Security, …) with a distinct hue.
- The exploration wrapper applies topic colors to all child UI — inputs, results, and shared components stay coherent.
- **Never hardcode color hues** in exploration UI (e.g. “make it blue”) — colors come from the topic. Wrong hues break when the topic changes.
- Use the **shared design system** and existing UI components rather than one-off styling.
- Layout spacing (margins, grids) is fine; color is the constraint.

## Where agents look (not you)

Topic → color mapping: `src/explorations/TOPICS.ts`. Design-system implementation: `src/main.css`. Agent skill and rules enforce “no hardcoded Tailwind colors.”

## Cover art vs widget styling

Widget colors follow topics automatically. **Cover images** have separate art rules (topic hue + greyscale only) — see [Images](/contributing/images).
