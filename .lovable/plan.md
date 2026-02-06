

# Agent Performance Command Center -- Step 1

## What We're Building

A single, unified command center page at `/agent/dashboard` that consolidates the currently separate Agent Dashboard, Capping History, Transactions, and a summary of ICON status into one scrollable view. No more clicking through 4 different pages to see your full performance picture.

The ICON Program page (`/agent/icon-program`) remains as a separate deep-dive page -- this command center just surfaces summaries.

## What the Page Looks Like (Top to Bottom)

### 1. Page Header with Global Date Filter
- Title: "Agent Performance"
- Right-aligned filter button matching the production app's style: a bordered pill showing the selected range (e.g., "01/01/2026 - 02/06/2026") with a filter icon
- Clicking opens a popover with preset options: YTD, MTD, Last Week, Last Year, and Custom with Start/End date pickers plus an "Include All Pipeline" checkbox

### 2. Vital Signs Row (4 stat cards + 1 summary card)
A responsive grid that shows 4-5 cards across on desktop, stacking on mobile:

| Units | Volume | Commission | Transactions | Cap Status |
|-------|--------|------------|--------------|------------|
| 1 | $595,000.00 | $8,925.00 | Closed: 1, Pending: 1, Withdrawn: 2 | Radial ring showing $4,186 / 26% |

- The first 3 cards match the production app's flat style (label on top, bold value below)
- The Transactions card shows a mini breakdown of Closed / Pending / Withdrawn counts
- The Cap Status card shows the circular SVG progress ring (reusing the existing `CircularProgress` component) with dollar amount and percentage in the center, plus a "Note: Complete 16K to achieve the cap status" caption

### 3. Year-over-Year Comparison Chart
- Full-width card with a tabbed bar chart (Units / Volume / Commission tabs)
- Uses recharts `BarChart` with Current Year vs Previous Year bars, same as the existing implementation
- Monthly x-axis (Jan - Dec)

### 4. Capping History Section (with sticky header)
- Sticky header: "Capping History" with a Download button and result count
- Filterable data table with columns: Start Date, End Date, Cap Reached, Cap Percentage
- Each column header has a "Contains" filter input row below it
- Reuses the existing capping history mock data
- Horizontal scroll on mobile via `ScrollArea`

### 5. ICON Status Summary Section (with sticky header)
- Sticky header: "ICON Status" with a link to "View Full Details" pointing to `/agent/icon-program`
- A compact 2-column grid (stacks on mobile):
  - **Production Goals**: Individual Cap progress bar ($481.90 / $16K, 3.01%) and Team Cap progress bar ($12,469 / $40K, 31.17%) with "In Progress" badges
  - **Stock Grants**: A horizontal row of 4 status badges (Production: Awarded, Cultural: In Progress, Event 1: In Progress, Event 2: In Progress)
- This is a summary view only -- clicking "View Full Details" goes to the full ICON Program page

### 6. Master Transaction Table (with sticky header)
- Sticky header: "Transactions" with a date range filter and Download button
- Streamlined columns: Status, Transaction ID, Close Date, Sale Price, GCI, Address, Amount Toward Cap
- Color-coded status badges (green for Paid, yellow for Pending, gray for Withdrawn)
- Clicking a row opens the existing `TransactionDetailsSheet` side panel
- "Contains" filter inputs below each column header
- Horizontal scroll on mobile

## Mobile Behavior
- All cards stack vertically (1 column)
- Section headers are `sticky top-16` so you always know which section you're in while scrolling
- Tables use `ScrollArea` with horizontal `ScrollBar` for overflow
- All touch targets maintain the 44px minimum height
- Content stays within the 390px viewport constraint

---

## Technical Details

### Files to Create

1. **`src/components/agent/AgentFilterBar.tsx`**
   - The date range filter popover with preset options (YTD, MTD, Last Week, Last Year, Custom)
   - Custom date picker with Start/End calendar inputs
   - "Include All Pipeline" checkbox
   - Reuses `Popover`, `Calendar`, `Checkbox` from shadcn/ui

2. **`src/components/agent/VitalSignsRow.tsx`**
   - Grid of stat cards (Units, Volume, Commission, Transactions summary, Cap Status ring)
   - Reuses the `CircularProgress` SVG component from the existing Dashboard page
   - Responsive: 5 columns on large screens, stacks on mobile

3. **`src/components/agent/YearOverYearChart.tsx`**
   - Tabbed bar chart (Units/Volume/Commission) using recharts
   - Extracted from the existing Dashboard page chart code

4. **`src/components/agent/CappingHistorySection.tsx`**
   - Sticky header + filterable table
   - Reuses data and filter logic from existing `CappingHistory.tsx`
   - Download button and result count

5. **`src/components/agent/IconStatusSummary.tsx`**
   - Compact production goals with progress bars
   - Stock grants status badges in a row
   - "View Full Details" link to `/agent/icon-program`

6. **`src/components/agent/MasterTransactionTable.tsx`**
   - Streamlined transaction table (fewer columns than the full table)
   - Search/filter functionality
   - Row click opens `TransactionDetailsSheet`
   - Reuses existing transaction mock data and badge styling

### Files to Modify

7. **`src/pages/agent/Dashboard.tsx`**
   - Complete rewrite: becomes the unified command center that composes all the new section components
   - Each section wrapped with a sticky header div

8. **`src/App.tsx`**
   - Remove routes for `/agent/capping-history` and `/agent/transactions` (content is now inline)

9. **`src/data/mockData.ts`**
   - Remove "Capping History" and "Transactions" from sidebar navigation if they exist as separate entries
   - Keep ICON Program as a separate nav item

### Files Unchanged
- `src/components/agent/TransactionDetailsSheet.tsx` -- reused as-is
- `src/pages/agent/IconProgram.tsx` -- remains as full deep-dive page
- `src/components/layout/DashboardLayout.tsx` -- page wraps in standard layout
- All sidebar and header components stay the same

### Sticky Headers Pattern
```text
<div className="sticky top-16 z-10 bg-background/95 backdrop-blur-sm border-b px-0 py-3">
  <div className="flex items-center justify-between">
    <h2 className="text-lg font-semibold">Section Title</h2>
    <div><!-- actions --></div>
  </div>
</div>
```
Each section (Capping History, ICON Status, Transactions) gets a sticky header that pins 64px from the top (below the app header).

