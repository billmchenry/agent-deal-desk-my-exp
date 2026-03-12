

## Plan: Update Periodic Overview Summary Tiles

### Current State
The Periodic Overview tab has 3 summary tiles in a `md:grid-cols-3` grid:
1. **Total Revenue** (computed from `finalPayout` sum) — labeled `fin.totalRevenue6Mo`
2. **Total Transactions** (deal count sum)
3. **Total PayNow Transactions** (PayNow deduction sum)

### Changes

**1. Rename & reorder tiles (5 tiles total)**

Update the grid from `md:grid-cols-3` to `md:grid-cols-5` and render tiles in this order:

| # | Label | Value | Color |
|---|-------|-------|-------|
| 1 | Total Revenue Earned | Sum of `initialRevenue` across filtered batches | `text-primary` |
| 2 | Total Transactions | Existing `totalTransactions` (deal count) | `text-foreground` |
| 3 | Total Batch Payout | Existing `totalRevenue` (sum of `finalPayout`) — renamed from "Total Revenue" | `text-primary` |
| 4 | Total Adjustments | Sum of `adjustmentAmount` across filtered batches | `text-exp-green` |
| 5 | Total PayNow Transactions | Existing `totalPayNow` | `text-exp-green` |

**2. File changes**

- **`src/pages/revshare/Financials.tsx`** (~lines 515-519): Add two new computed values:
  - `totalRevenueEarned = filteredBatches.reduce((sum, b) => sum + b.initialRevenue, 0)`
  - `totalAdjustments = filteredBatches.reduce((sum, b) => sum + b.adjustmentAmount, 0)`

- **`src/pages/revshare/Financials.tsx`** (~lines 802-819): Replace the 3-tile grid with 5 tiles in the specified order, update grid class to `md:grid-cols-5`.

- **`src/i18n/en.ts`** (and other locale files): Add translation keys `fin.totalRevenueEarned`, `fin.totalBatchPayout`, `fin.totalAdjustments`. Rename/repurpose `fin.totalRevenue6Mo` → `fin.totalBatchPayout`.

