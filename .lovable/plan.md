

## Fix Capping History Table UX + Add Sorting

Two issues to address: the filter row still looks heavy/weird, and there's no way to sort columns.

### Problem 1: Filter Row Still Looks Odd
The screenshot shows the filter inputs are visible and taking up a lot of space. The `showFilters` toggle defaults to `false`, but the filter row itself uses full-width inputs inside `TableHead` cells which looks awkward. We should make the filters more compact and ensure they're truly hidden by default.

### Problem 2: No Sorting
Users should be able to click column headers to sort ascending/descending.

### Changes

**File: `src/components/agent/CappingHistorySection.tsx`**

1. **Add sort state** -- track `sortKey` (which column) and `sortDir` ("asc" | "desc"), defaulting to Start Date descending (newest first).

2. **Make column headers clickable** -- add a click handler and a small arrow indicator (ChevronUp/ChevronDown from lucide) to show current sort direction. Use `cursor-pointer select-none` styling on headers.

3. **Sorting logic** -- sort the filtered data before rendering:
   - Start Date / End Date / Cap Reached: parse as dates (treat "-" / "In Progress" as a far-future date so they sort last)
   - Cap %: parse as float

4. **Tighten filter row styling** -- reduce padding on the filter inputs, make them slightly smaller (`h-6` instead of `h-7`), and add a subtle top border to visually separate filters from headers.

5. **Keep `showFilters` defaulting to `false`** -- the toggle button already works, just ensure the initial render is clean.

### Sort UX
- Click a column header to sort ascending
- Click again to sort descending  
- Click a third time to return to default (no sort)
- Small chevron icon appears next to the active sort column

### Technical Details

- Import `ArrowUpDown`, `ChevronUp`, `ChevronDown` from lucide-react
- Sort state: `sortKey: "startDate" | "endDate" | "capReached" | "capPercentage" | null` and `sortDir: "asc" | "desc"`
- Date parsing helper: split "MM/DD/YYYY" and create Date objects for comparison
- Cap % parsing: `parseFloat(pct)` for numeric comparison
- Apply `useMemo` or inline sort on `filteredData` before mapping to rows

