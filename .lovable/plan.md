

## Re-qualification Card Layout Options

The current layout uses a two-column grid (Requirements | Progress) which creates a wide, spread-out table that can feel disconnected. Here are three alternative approaches:

### Option A: Stacked Row Cards
Each requirement becomes its own compact row-card with the label, value, and progress bar stacked vertically. This is cleaner and more scannable.

```text
┌─────────────────────────────────────────────────┐
│ Re-qualification  🏆 Mega Team    [Contact CTA] │
│ Cap Reset Date: 01/01/2027                      │
│                                                 │
│ ┌─────────────────────────────────────────────┐ │
│ │ Total Agents Count ⓘ        70 out of 11   │ │
│ │ ████████████████████████████████████████████ │ │
│ ├─────────────────────────────────────────────┤ │
│ │ Total Closed Units           13 out of 140  │ │
│ │ ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│ ├─────────────────────────────────────────────┤ │
│ │ Total Sales Volume           5.15M / 40M    │ │
│ │ █████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│ ├─────────────────────────────────────────────┤ │
│ │ ...                                         │ │
│ └─────────────────────────────────────────────┘ │
│ [View Details]                                  │
└─────────────────────────────────────────────────┘
```

Each row has: label + info icon on the left, value on the right, full-width progress bar below. Rows separated by subtle dividers.

### Option B: Metric Cards Grid
Each requirement is its own mini-card in a responsive grid (2-3 columns on desktop, 1 on mobile). Similar to how KPI stats are displayed elsewhere in the app.

```text
┌──────────────────────────────────────────────────┐
│ Re-qualification  🏆 Mega Team     [Contact CTA] │
│ Cap Reset Date: 01/01/2027                       │
│                                                  │
│ ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │
│ │ Agents Count │ │ Closed Units │ │ Sales Vol  │ │
│ │ 70 / 11      │ │ 13 / 140     │ │ 5.15M/40M  │ │
│ │ ██████████   │ │ ██░░░░░░░░░  │ │ ███░░░░░░  │ │
│ └──────────────┘ └──────────────┘ └────────────┘ │
│ ┌──────────────┐ ┌──────────────┐                │
│ │ Co. $ Paid   │ │ Avg Split    │                │
│ │ 12.95K/56K   │ │ 3.08% (25%)  │                │
│ │ █████░░░░░░  │ │ ████░░░░░░░  │                │
│ └──────────────┘ └──────────────┘                │
│ [View Details]                                   │
└──────────────────────────────────────────────────┘
```

### Option C: Keep Current but Tighten (minimal change)
Keep the two-column layout but align each row as a single horizontal band with label, value, and progress bar inline — reducing vertical space.

---

**Recommendation**: **Option A (Stacked Row Cards)** — it's the most readable, works great on both desktop and mobile, and aligns with the clean card-based patterns already used throughout the app.

### Implementation
- Refactor the grid into a `divide-y` list of rows
- Each row: flex with label+info left, value right, full-width progress bar below
- Keep the header and View Details CTA as-is
- Minimal code change, all within `src/pages/team/Dashboard.tsx`

