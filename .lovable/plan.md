

# Top Agents Slide-out Detail Sheet

## Overview
Create a new `TopAgentsSheet` component that opens from the "View All" button in the Top Agents card. It will be a right-side Sheet occupying ~55% screen width, containing tabbed navigation, a sortable data table with avatars and progress bars, CSV export, and pagination.

## Mock Data
Expand `topAgents` in `mockData.ts` from 5 to ~30 agents to make pagination meaningful.

## New File: `src/components/team/TopAgentsSheet.tsx`

**Props**: `open`, `onOpenChange`, `defaultTab` (units/volume/commission)

**Header**:
- Title: "Top Agents - Full List"
- "Download CSV" button (using existing `exportToCsv` utility)
- Close X button (built into SheetContent)

**Tabs** (pill-style, matching app pattern):
- "Units Closed", "Highest Volume", "GCI / Commission"
- Active tab: primary blue bg, white text
- Default sort changes based on active tab

**Table** (custom inline table, not DataTable — simpler for this sheet context):
- Columns: Agent Name (avatar + name), Units Closed (number + subtle progress bar), Sales Volume (currency), GCI Sum (currency), Currency (static "USD")
- Sortable headers with chevron icons
- Right-aligned numeric/currency columns with `tabular-nums`
- Progress bar uses the existing `Progress` component, scaled relative to max value in dataset

**Footer/Pagination**:
- "Rows per page" Select dropdown (10, 25, 50) defaulting to 25
- "Page X of Y" with left/right ChevronLeft/ChevronRight navigation arrows

## Modified Files

### `src/data/mockData.ts`
- Add ~25 more entries to the `topAgents` array with varied data

### `src/pages/team/Dashboard.tsx`
- Import `TopAgentsSheet`
- Add state: `topAgentsSheetOpen` (boolean), `topAgentsDefaultTab` (string)
- "View All" button sets `topAgentsSheetOpen = true` and passes current tab as `defaultTab`
- Render `<TopAgentsSheet>` at the bottom of the component

### `src/i18n/en.ts` (and other locale files)
- Add keys: `team.topAgentsFullList`, `team.unitsClosed`, `team.highestVolume`, `team.gciCommission`, `team.gciSum`, `team.downloadCsv`, `team.rowsPerPage`, `team.pageOf`

## Implementation Order
1. Expand mock data
2. Create `TopAgentsSheet` component
3. Wire into Dashboard with state management
4. Add i18n keys

