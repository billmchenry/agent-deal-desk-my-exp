

# Team Reconciliation Page

A new "Team Reconciliation" report under the Team section, following the same DataTable template used by Agent Production Details. Includes a "View Breakdown" side panel showing per-agent commission details with collapsible fee sections.

---

## Overview

Based on the reference screenshots, this page shows team-level transaction data with columns: Number, Agent Name, UUID, Address, Actual Close Date, Payment Initiated Date, Type of Property, Status, Net Commission, and a "View Breakdown" action. Clicking "View Breakdown" opens a side sheet with multi-agent commission breakdowns (Buyer Commission Base, TeamView with per-agent splits, Fees Covered By Others, Fees I Paid for Others, Remaining Fees).

---

## New Files

### 1. `src/pages/team/Reconciliation.tsx`

The main page, closely mirroring the Agent Production Details pattern:

- Uses `DashboardLayout`, `UniversalFilterBar` (with DateRange + Search), and `DataTable`
- Mock data for ~10 team transactions with fields: `number`, `agentName`, `uuid`, `address`, `actualCloseDate`, `paymentInitiatedDate`, `typeOfProperty`, `status`, `netCommission`
- Column definitions with visible defaults: Number, Agent Name, UUID, Address, Actual Close Date, Payment Initiated Date, Type of Property, Status, Net Commission
- Last column renders a "View Breakdown" link/button (not a standard column type -- uses `render` to output a styled link)
- `onRowClick` and the "View Breakdown" link both open the breakdown sheet
- `mobileCardRender` showing: Status badge, Agent Name, Address (truncated), Net Commission
- CSV export enabled
- Result count display (e.g., "1009 Results") and pagination (default page size 500 matching the reference, with 25/50/100/500 options)
- Back button at top linking to `/team/dashboard`

### 2. `src/components/team/TeamBreakdownSheet.tsx`

Side panel matching the reference screenshot's "Transaction Details" breakdown:

- Reuses the same `DetailRow`, `SectionHeader`, and `CollapsibleSection` sub-components from `TransactionDetailsSheet.tsx` (extract these into a shared file or duplicate -- plan uses shared extraction)
- **Transaction Details** section at top: Property Address, Transaction ID, Actual Close Date, Buyer Agent, Status
- **Buyer Commission Base** section: Sales Price, Commission Sale, Actual Commission
- **TeamView** section (the key differentiator): Shows multiple agent entries, each with:
  - Agent identifier row (ID + Name) with a colored percentage badge
  - Agent Commission, Agent Commission with Bonuses & Concessions, Commission Amount (highlighted rows)
  - Tax, Commission After Co-agents (highlighted)
  - Agent Split Before Expenses
  - Company Commission, Risk Management Fee, 100% Capped Transaction Fee, Transaction Review Fee
- **Fees Covered By Others** -- collapsible, shows Commission Covered By, Currency, Commission Amount, Risk Management Amount, etc.
- **Fees I Paid for Others** -- collapsible
- **Remaining Fees** -- collapsible (default open): Remaining Commission, Remaining Risk, Capped Transaction Fee, Transaction Review Fee, Stock Comp, Total Deductions, Agent Net (highlighted)

### 3. `src/components/shared/BreakdownComponents.tsx`

Extract the reusable `DetailRow`, `SectionHeader`, and `CollapsibleSection` components currently in `TransactionDetailsSheet.tsx` into a shared file so both the agent and team breakdown sheets can use them.

---

## Modified Files

### `src/components/agent/TransactionDetailsSheet.tsx`
- Import `DetailRow`, `SectionHeader`, `CollapsibleSection` from `@/components/shared/BreakdownComponents` instead of defining them inline.

### `src/data/mockData.ts`
- Add `submenu` to the Team nav item with: "Dashboard" (`/team/dashboard`) and "Team Reconciliation" (`/team/reconciliation`)
- Update the `navItems` array similarly

### `src/components/layout/Sidebar.tsx`
- Add `"Team Reconciliation": "nav.teamReconciliation"` to `NAV_KEYS`

### `src/App.tsx`
- Add route: `/team/reconciliation` pointing to the new `Reconciliation` page component

### `src/i18n/*.ts` (all 7 language files)
- Add keys: `nav.teamReconciliation`, `team.reconciliation`, `team.number`, `team.agentName`, `team.uuid`, `team.typeOfProperty`, `team.netCommission`, `team.viewBreakdown`, `team.backToTeam`, `team.paymentInitiatedDate`, `team.buyerCommissionBase`, `team.commissionSale`, `team.teamView`, `team.remainingCommission`, `team.totalDeductions`, `team.agentNet`

---

## Implementation Order

1. Extract shared breakdown components into `BreakdownComponents.tsx`
2. Refactor `TransactionDetailsSheet.tsx` to import from shared file
3. Create mock team reconciliation data and the `Reconciliation.tsx` page
4. Create `TeamBreakdownSheet.tsx` with multi-agent commission breakdown
5. Add route in `App.tsx`
6. Update sidebar navigation (mockData + Sidebar NAV_KEYS)
7. Add translation keys to all 7 language files

