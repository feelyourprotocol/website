# Styling & Design

The project uses [Tailwind CSS v4](https://tailwindcss.com/) for styling with a design system built on **CSS custom properties** that automatically adapt to the topic color of each exploration. This means contributors can focus on building their widget logic — colors, fonts, and spacing are handled by the shared design system.

## How Topic Colors Work

Every exploration belongs to a **topic** (e.g. "Fusaka"), and each topic has a color (blue, yellow, green, red). The `ExplorationC` wrapper component sets CSS custom properties on its root element based on the topic color. All child components — UI components, E-Components, and your widget — automatically inherit these colors.

```
Topic (e.g. Fusaka = blue)
  → ExplorationC sets --e-* CSS variables
    → All children inherit colors automatically
```

You never need to think about colors in your exploration widget. Every UI component and CSS class picks up the right color from the topic.

### Available CSS Variables

These variables are set by `ExplorationC` and available to all child elements:

| Variable | Purpose | Blue topic example |
|----------|---------|-------------------|
| `--e-text` | Primary text color | `blue-900` |
| `--e-bg` | Exploration wrapper background | `blue-200` |
| `--e-bg-light` | Input backgrounds | `blue-50` |
| `--e-bg-medium` | Button backgrounds | `blue-100` |
| `--e-bg-dark` | Result box backgrounds | `blue-900` |
| `--e-border` | Light borders | `blue-200` |
| `--e-border-dark` | Dark borders | `blue-900` |

If you need the topic color for custom elements, use the `.e-text` utility class or reference the variables directly:

```html
<!-- Utility class -->
<p class="e-text">This text uses the topic color.</p>

<!-- Direct variable reference (for custom styling) -->
<div style="border-left: 3px solid var(--e-text)">Custom accent</div>
```

## CSS Classes

The design system provides semantic CSS classes defined in `src/main.css`. Use these instead of assembling Tailwind utilities manually — they're topic-color-aware and consistent across all explorations.

### Result Boxes

Result boxes are the dark panels used to display computation output (e.g. gas costs, hex results):

| Class | Purpose |
|-------|---------|
| `e-result-box` | Dark result panel container |
| `e-result-title` | Title label inside a result box |
| `e-result-text-lg` | Large text (e.g. gas numbers) |
| `e-result-text-md` | Medium text (e.g. status messages) |
| `e-result-text-sm` | Small monospace text (e.g. hex output) |

Usage with the `ResultBoxUIC` component:

```vue
<div class="e-grid-double">
  <ResultBoxUIC title="Before" :left="true">
    <p class="e-result-text-lg">21000 Gas</p>
    <p class="e-result-text-sm">Result: 0xdeadbeef...</p>
  </ResultBoxUIC>
  <ResultBoxUIC title="After" :left="false">
    <p class="e-result-text-lg">42000 Gas</p>
    <p class="e-result-text-sm">Result: 0xcafebabe...</p>
  </ResultBoxUIC>
</div>
```

### Grid Layouts

| Class | Purpose |
|-------|---------|
| `e-grid-single` | Single-column grid for result panels |
| `e-grid-double` | Two-column grid for side-by-side comparison |

### Form Inputs

These classes are already applied inside the shared UI components (`HexDataInputUIC`, `ExamplesUIC`). You typically don't need them directly, but they're available:

| Class | Purpose |
|-------|---------|
| `e-textarea` | Hex data input textarea |
| `e-select` | Dropdown select (examples selector) |
| `e-input` | Single-line input field |

### Buttons

| Class | Purpose |
|-------|---------|
| `e-action-button` | Primary action button (requires `group` class alongside for tooltip support) |
| `e-button-icon` | Small icon button |

### Text

| Class | Purpose |
|-------|---------|
| `e-text` | Applies the topic text color |

## UI Components

Most styling is encapsulated in reusable UI components so you don't need to apply classes manually. Use these in your `MyC.vue`:

| Component | What it does |
|-----------|-------------|
| `ExamplesUIC` | Example selector dropdown — already styled with `e-select` |
| `HexDataInputUIC` | Hex data input textarea — already styled with `e-textarea` |
| `ResultBoxUIC` | Result display box with title, info text, and error text — uses `e-result-box` and `e-result-title` |
| `ActionButtonUIC` | Action button with loading state and tooltip |
| `ButtonUIC` | Small icon button with tooltip |

Import them from `@/eComponents/ui/`:

```typescript
import ResultBoxUIC from '@/eComponents/ui/resultBox/ResultBoxUIC.vue'
import HexDataInputUIC from '@/eComponents/ui/HexDataInputUIC.vue'
import ActionButtonUIC from '@/eComponents/ui/ActionButtonUIC.vue'
```

## Custom Styling

While the design system handles the common cases, you can always add custom Tailwind classes for exploration-specific elements. A few guidelines:

### Do

- Use the `e-*` CSS classes for result boxes, grids, inputs, and buttons
- Use `e-text` when you need the topic color on custom text
- Use standard Tailwind utilities for spacing, layout, and sizing (`mt-4`, `grid`, `text-sm`, etc.)
- Reference `--e-*` CSS variables for custom color needs

### Don't

- Hardcode color values like `text-blue-900` or `bg-blue-50` — use the CSS variables or `e-text` instead, so your exploration works with any topic color
- Duplicate styling that's already in a UI component — use the component instead
- Override `e-*` classes unless you have a specific reason

### Example: Mixing Design System with Custom Layout

```vue
<template>
  <ExplorationC explorationId="my-exploration" :exploration="exploration" :topic="topic">
    <template #content>
      <div>
        <ExamplesUIC v-model="example" :examples="examples" :change="selectExample" />
        <HexDataInputUIC v-model="data" rows="6" :formChange="onDataInputFormChange" />

        <!-- Custom layout with design system colors -->
        <div class="mt-4 grid grid-cols-3 gap-2">
          <div class="e-text font-bold text-sm">Custom Label</div>
          <div class="col-span-2 font-mono text-xs">{{ someValue }}</div>
        </div>

        <!-- Standard result display -->
        <div class="e-grid-double">
          <ResultBoxUIC title="Result A" :left="true">
            <p class="e-result-text-lg">{{ resultA }}</p>
          </ResultBoxUIC>
          <ResultBoxUIC title="Result B" :left="false">
            <p class="e-result-text-lg">{{ resultB }}</p>
          </ResultBoxUIC>
        </div>

        <PoweredByC :poweredBy="exploration.poweredBy" />
      </div>
    </template>
  </ExplorationC>
</template>
```

## Where Styles Live

| What | Where |
|------|-------|
| Global design system (`e-*` classes, CSS variables) | `src/main.css` |
| Topic color definitions | `src/explorations/TOPICS.ts` |
| CSS variable propagation | `src/explorations/ExplorationC.vue` |
| E-Component-specific classes | `src/main.css` (namespaced section) |
| Component-level Tailwind classes | Inline in each `.vue` template |
