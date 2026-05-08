The screenshot shows three rows stacked tightly on the left edge: the search input, the Listings/Transactions tabs (with the DataTable's "Columns" button right under them). It reads as left-heavy because there's a large empty void on the right.

## Proposed layout

Consolidate into a single toolbar row above the table, with content distributed across the full width:

```text
[ Listings (9) | Transactions (3) ]      [ Search… ] [ All ][ Active ][ Pending ][ Closed ] [ Columns ]
       left cluster                                       right cluster
```

- **Left cluster:** Listings / Transactions tabs (primary view switcher — belongs first).
- **Right cluster:** Search input (compact, ~280px), status pills, and the DataTable's Columns control.
- One row on desktop (`lg:flex-row justify-between`), wraps gracefully on smaller widths.
- Drop the standalone "Columns" row that currently sits below the tabs by passing the toolbar content into DataTable's existing toolbar slot (or rendering Columns inline next to the pills).

## Why this fixes "heavy on the left"

- Search no longer takes the full row width; it shrinks to the right side where it pairs with the filter pills.
- Tabs anchor the left, filters/search/columns anchor the right → visual weight is balanced.
- Removes the third stacked row, tightening vertical rhythm.

## Files

- `src/pages/business/Transactions.tsx` — restructure the toolbar block (lines ~355–393) into one flex row; verify how `DataTable` exposes its Columns button so it can be co-located (may need a small prop or to render the toolbar above and hide DataTable's internal one).

No business logic, data, or color changes — purely layout.