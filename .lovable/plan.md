

# Unified Agent Performance Command Center

## Overview

This plan consolidates the currently separate Agent Dashboard, ICON Program, Capping History, and Transactions pages into a single, vertically-scrolling command center at `/agent/dashboard`. The goal: eliminate navigation drill-downs so agents can see capping status, ICON progress, and transaction history all on one page.

## What Changes

### Current State
- **4 separate pages**: Agent Dashboard, ICON Program, Capping History, Transactions
- Each requires navigation clicks and back buttons to move between them
- Data is scattered across pages with no unified view

### New State
- **1 unified page** with everything visible by scrolling
- A fixed filter bar at the top with a global date range picker
- Sticky section headers so you always know where you are while scrolling on mobile

---

## Page Layout (Top to Bottom)

### 1. Fixed Top Bar
- Page title "Agent Performance" with a global date range picker (reusing the existing calendar popover pattern)
- An "Impersonation Mode" indicator badge (for staff use) -- shown only when active

### 2. Vital Signs Row (4 cards in a horizontal row, stacks on mobile)

| Radial Cap Chart | ICON Summary | Units | Volume | GCI |
|---|---|---|---|---|
| Circular progress ring showing $482 / $16K cap | Combined Option 1 + Option 2 progress bar | 5 | $1.78M | $2.67K |

- The **Radial Cap Chart** is a standalone card with the existing SVG ring from `HeroBannerCard.tsx`, styled to show "Company Commission vs. $16K Cap"
- The **ICON Summary Card** shows a combined progress bar pulling from the existing ICON production data (Individual Cap + Team Cap)
- **Production Cards** (Units, Volume, GCI) reuse the existing `StatCard` pattern from `StatsRow.tsx`

### 3. ICON Requirements Section (sticky header)
A 2-column grid (stacks to 1 column on mobile):

**Left Column -- Production Goals:**
- Individual Cap progress bar with $481.90 / $16K
- Team Cap progress bar with $12,469 / $40K
- Both with "In Progress" badges (reusing existing ICON production UI)

**Right Column -- Cultural Commitment Points:**
- Cultural status (achieved/in progress) with progress indicator
- Events attended counter (2/2 attended)
- Compact event list with attendance badges

### 4. Stock Grants Tracker (sticky header)
A single horizontal row of 4 items:

```text
[Production: Awarded] --- [Cultural: Awarded] --- [Event 1: Awarded] --- [Event 2: Awarded]
```

- Simple horizontal progress line connecting 4 status dots/badges
- Green checkmarks for awarded, gray circles for pending
- Link to Morgan Stanley at Work below

### 5. Master Transaction Table (sticky header)
A searchable, high-density table at the bottom with streamlined columns:

| Address | Closing Date | Sale Price | GCI | Amount Toward Cap |
|---|---|---|---|---|
| 783 Rice street, watertown, CA | 01/15/2026 | $9,750 | $398.62 | $481.90 |

- **Search bar** above the table for filtering by address
- **Status badges** (Paid, Pending, Withdrawn) color-coded
- **Row click** opens existing `TransactionDetailsSheet` side panel
- Horizontal scroll on mobile with `ScrollArea`
- Download button for export

---

## Mobile Behavior
- All card rows stack vertically (1 column)
- Section headers become `sticky top-16` (below the fixed app header) so the user always knows which section they're in
- The vital signs cards scroll horizontally as a row OR stack 1-per-row
- The transaction table uses horizontal scroll with `ScrollBar`
- All touch targets maintain the 44px minimum height requirement

---

## Technical Details

### Files Created
1. **`src/pages/agent/Dashboard.tsx`** -- Complete rewrite of the unified page (replaces current file)
2. **`src/components/agent/VitalSignsRow.tsx`** -- Radial cap chart + ICON summary + stat cards
3. **`src/components/agent/RadialCapChart.tsx`** -- Standalone radial SVG progress ring card
4. **`src/components/agent/IconSummaryCard.tsx`** -- Combined ICON progress bar card
5. **`src/components/agent/IconRequirementsSection.tsx`** -- 2-column Production Goals + Cultural Points
6. **`src/components/agent/StockGrantsTracker.tsx`** -- Horizontal grant status line
7. **`src/components/agent/MasterTransactionTable.tsx`** -- Searchable transaction table with streamlined columns

### Files Modified
- **`src/App.tsx`** -- Remove routes for `/agent/capping-history` and `/agent/transactions` (they are now inline sections)
- **`src/data/mockData.ts`** -- Keep sidebar nav pointing to `/agent/dashboard` only; remove capping-history nav references

### Files Kept (No Changes)
- `src/components/agent/TransactionDetailsSheet.tsx` -- Reused as-is for row-click detail view
- `src/components/layout/DashboardLayout.tsx` -- Page still wraps in the standard layout
- `src/pages/agent/IconProgram.tsx` -- Kept as a separate deep-dive page (sidebar still links to it)

### Existing Patterns Reused
- `Card`, `CardContent`, `CardHeader` from shadcn/ui
- `Progress` bar component for ICON bars
- `Badge` for status indicators
- `Table` components for the transaction table
- `ScrollArea` + `ScrollBar` for mobile horizontal scrolling
- `Popover` + `Calendar` for the date range picker
- `TransactionDetailsSheet` for transaction row click detail
- Mock data from `mockData.ts` and inline mock arrays from existing pages

### Sticky Section Headers Implementation
```text
<div className="sticky top-16 z-10 bg-background border-b px-4 py-3">
  <h2 className="text-lg font-semibold">ICON Requirements</h2>
</div>
```
Each section (Vital Signs, ICON Requirements, Stock Grants, Transactions) gets a sticky header that pins below the app header (64px = top-16).

