

## Consistent Filter Bar Template

### Problem

Page headers and filters are built inconsistently across the app:

- **Agent Dashboard, Transactions, Reconciliation, Mira History, Pulse, RevShare Group, Custom Service Fees** — use `UniversalFilterBar` (good)
- **Team Dashboard, RevShare Dashboard, Trends, Organization, OrganizationTree** — use hand-rolled `<div className="flex items-center justify-between mb-...">` with inline filters
- **Home (Index)** — bare `<h1>` with no filter bar wrapper

The `UniversalFilterBar` component already exists and works well, but it's not adopted everywhere. Pages that roll their own end up with inconsistent spacing (`mb-2` vs `mb-4` vs `mb-6`), inconsistent responsive behavior, and no standard slot pattern for right-side controls.

### Solution

1. **Adopt `UniversalFilterBar` on every remaining page** that currently uses a hand-rolled header+filter layout. The component already supports `title`, `subtitle`, `titleExtra`, and a `children` slot for right-side controls — this covers all current use cases.

2. **Migrate these pages:**

| Page | Current Pattern | Right-side Controls |
|------|----------------|-------------------|
| `team/Dashboard.tsx` (overview) | Inline div | `<Button>Team Report</Button>` |
| `team/Dashboard.tsx` (agent details) | Inline h1 | None (just back button + title) |
| `team/Dashboard.tsx` (top agents) | Inline h1 | None |
| `revshare/Dashboard.tsx` | Inline div | `<Select>` for period |
| `revshare/Trends.tsx` | Inline div | None |
| `revshare/Organization.tsx` | Inline div | None |
| `revshare/OrganizationTree.tsx` | Inline div | Search + toggle |
| `Index.tsx` | Bare h1 | None (uses `DashboardToolbar` below) |

3. **No changes to `UniversalFilterBar` itself** — it already handles all these patterns. The `titleExtra` prop covers cases like back buttons. The `children` slot covers Select dropdowns, Buttons, and filter sub-components.

### What This Gives You

- Every page header uses the same spacing, responsive wrapping, and layout
- Adding filters to any page in the future is just dropping sub-components into the `children` slot
- Consistent `mb-2` bottom margin across all page headers (from UniversalFilterBar's default)

### Files to Change (~8 files)

- `src/pages/team/Dashboard.tsx` — 3 views (overview, agentDetails, topAgents) → wrap headers in `UniversalFilterBar`
- `src/pages/revshare/Dashboard.tsx` — replace inline header div with `UniversalFilterBar` + Select in children
- `src/pages/revshare/Trends.tsx` — replace inline header div
- `src/pages/revshare/Organization.tsx` — replace inline header div
- `src/pages/revshare/OrganizationTree.tsx` — replace inline header div, move search/toggle to children
- `src/pages/Index.tsx` — wrap heading in `UniversalFilterBar`

