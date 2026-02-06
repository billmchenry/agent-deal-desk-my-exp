

# Move ICON Program Under Agent Performance

## What Changes

ICON Program is a personal performance metric (your caps, your stock grants), so it belongs under Agent Performance -- not in "Business & Growth" alongside Team and RevShare.

Instead of adding another sidebar item, we surface a compact **ICON Status Summary** section directly inside the Agent Performance command center. That summary links to the full ICON Program deep-dive page. No new sidebar entries needed.

## What the User Sees

1. The "ICON Program" item **disappears** from the "BUSINESS & GROWTH" sidebar section
2. An **ICON Status Summary** section appears inside Agent Performance (between Capping History and Transactions), showing:
   - Individual Cap and Team Cap progress bars
   - Stock grant status badges (Awarded / In Progress)
   - A "View Full Details" link that navigates to the full `/agent/icon-program` page
3. The full ICON Program page at `/agent/icon-program` continues to work exactly as before

## Technical Details

### File 1: `src/data/mockData.ts`
- Remove the `{ title: "ICON Program", icon: "Award", url: "/agent/icon-program" }` entry from `sidebarNavigation.businessGrowth.items`

### File 2: `src/pages/agent/Dashboard.tsx`
- Re-add the import for `IconStatusSummary`
- Place `<IconStatusSummary />` between `<CappingHistorySection />` and `<MasterTransactionTable />`

No other files need to change. The `IconStatusSummary` component and the ICON Program page already exist and work correctly.

