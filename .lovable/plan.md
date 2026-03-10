

## Unify All Tabbed Menus to Match News & Training Card Design

The News & Training card tab style is a pill-shaped design with:
- **TabsList**: `bg-muted/60 backdrop-blur-sm border border-border/50 rounded-full p-1`
- **TabsTrigger**: `rounded-full data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary data-[state=active]:font-bold`

### Strategy
Update the **base component** (`src/components/ui/tabs.tsx`) defaults to match this style, then clean up per-file overrides.

### Changes

**1. `src/components/ui/tabs.tsx`** — Update default classes
- `TabsList`: Change base from `rounded-md bg-muted` to `bg-muted/60 backdrop-blur-sm border border-border/50 rounded-full`
- `TabsTrigger`: Change base from `rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground` to `rounded-full data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary data-[state=active]:font-bold`

**2. Files that already match** (minimal cleanup):
- `src/components/dashboard/NewsAndTrainingCard.tsx` — Remove redundant classes from TabsList/TabsTrigger (now inherited from base)
- `src/components/dashboard/ConnectUplineCard.tsx` — Same cleanup

**3. Files that need style updates** (remove conflicting overrides so base applies):
- `src/components/dashboard/UplinePartnersCard.tsx` — Remove bare `h-8`, add pill classes
- `src/components/agent/YearOverYearChart.tsx` — Remove `bg-muted h-8` override
- `src/pages/revshare/Dashboard.tsx` — Remove old sizing overrides
- `src/pages/Pulse.tsx` — Two instances: remove `grid w-full grid-cols-2` and bare TabsList
- `src/pages/notifications/Notifications.tsx` — Bare TabsList, no changes needed (base applies)
- `src/pages/profile/PersonalDetails.tsx` — Remove `mb-6` only addition, keep `mb-6`

**4. Underline-style tabs converted to pill style**:
- `src/pages/team/Dashboard.tsx` — Remove `bg-transparent border-b rounded-none` and underline trigger overrides
- `src/pages/revshare/Financials.tsx` — Same: remove underline style overrides

### Files Modified (11 total)
1. `src/components/ui/tabs.tsx`
2. `src/components/dashboard/NewsAndTrainingCard.tsx`
3. `src/components/dashboard/ConnectUplineCard.tsx`
4. `src/components/dashboard/UplinePartnersCard.tsx`
5. `src/components/agent/YearOverYearChart.tsx`
6. `src/pages/revshare/Dashboard.tsx`
7. `src/pages/revshare/Financials.tsx`
8. `src/pages/Pulse.tsx`
9. `src/pages/notifications/Notifications.tsx`
10. `src/pages/profile/PersonalDetails.tsx`
11. `src/pages/team/Dashboard.tsx`

