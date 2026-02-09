

## Combine Capping Progress Ring with History Table

Instead of having the progress ring in its own card and the history table in a separate section below, merge them into a single card. The progress ring becomes a compact left-column element beside the table, creating a balanced, unified layout.

### Layout

On desktop (sm+), the card uses a two-column layout:
- **Left column** (~180px): Progress ring + current cap stats stacked vertically, centered
- **Right column** (flex-1): The capping history table fills the remaining space

On mobile, the layout stacks vertically: ring/stats on top, table below.

### Changes

**File: `src/components/agent/CappingSection.tsx`**

1. Remove the separate `<Card>` wrapper around the progress ring -- instead, wrap everything (ring + table) inside a single `<Card>`
2. Use a `flex` layout inside the card: ring on the left, table on the right
3. Remove the `<CappingHistorySection />` as a standalone component call and inline its table content directly (or render it inside the shared card)

**File: `src/components/agent/CappingHistorySection.tsx`**

4. Export the table portion without its own sticky header and outer section wrapper, so it can be embedded cleanly inside the shared card
5. Move the "Capping History" label and download button into the card header area

### Result

- The progress ring no longer floats alone in a wide card with excess whitespace
- The ring visually anchors the left side while the table fills the right
- Single card = cleaner, more balanced appearance
- Mobile gracefully stacks ring above table

