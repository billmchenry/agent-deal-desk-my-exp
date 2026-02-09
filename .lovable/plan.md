

## Polish Capping History Table -- Design & Functional Improvements

Six targeted refinements across two files to tighten alignment, improve visual consistency, and add small affordances.

---

### 1. Unified Headers (CappingSection.tsx)

Move the "Capping Status" title inside the Card so it shares the same container as the progress ring and history table. Remove the separate sticky `div` wrapper outside the card. The title becomes part of `CardContent`, sitting above the flex row.

### 2. Balance Column Widths (CappingHistorySection.tsx)

Reduce `min-w` on Start Date and End Date columns from `100px` to `80px`. Give "Cap Reached" a wider `min-w-[120px]` so badges and dates have breathing room. This eliminates dead white space on date columns and makes data feel intentional.

### 3. Consistent Status Pills (CappingHistorySection.tsx)

Replace the plain green text for "100%" with a green-tinted Badge (`bg-exp-green/10 text-exp-green border-exp-green/20`). Keep "In Progress" as a secondary Badge and "0%" as muted text. This gives users that instant "win" feeling when scanning capped years.

### 4. Tuck Result Count (CappingHistorySection.tsx)

Move the "5 Results" count from the far-right toolbar to sit directly after the Filter button, separated by a subtle dot or pipe. This groups it with the toolset instead of floating it as an orphan.

### 5. Search Icon in Filter Inputs (CappingHistorySection.tsx)

When filters are visible, wrap each `Input` in a `relative` container and add a small `Search` icon (from lucide-react) positioned inside the left side of the input. Update placeholder to just "Search..." and add `pl-7` padding. This gives power users the "search me" affordance.

### 6. No Conflict with Global Date Picker

The capping history table filters only operate on the static `cappingHistoryData` array (local mock data). They do not interact with the global `AgentFilterBar` date range at all, so there is no conflict. No code change needed here -- this is already correctly isolated.

---

### Technical Details

**File: `src/components/agent/CappingSection.tsx`**
- Remove the sticky header `div` with "Capping Status" title
- Add a title row inside `CardContent`, above the flex layout: `<h2 className="text-sm font-semibold text-foreground mb-3">Capping Status</h2>`

**File: `src/components/agent/CappingHistorySection.tsx`**
- Import `Search` from lucide-react
- Adjust column `min-w` values: Start Date and End Date to `min-w-[80px]`, Cap Reached to `min-w-[120px]`
- Replace `getCapColor` rendering for 100% values with a Badge: `<Badge className="text-[10px] px-1.5 py-0 bg-exp-green/10 text-exp-green border-exp-green/20">100%</Badge>`
- Move result count next to Filter button: `<Button>Filter</Button> <span className="text-[10px] text-muted-foreground">{count}</span>`
- Wrap filter inputs in `relative` divs, add `<Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />` and `pl-7` class on inputs, change placeholder to "Search..."
