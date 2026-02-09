

## Move Date Picker to Page-Level Filter Bar

The date picker currently sits inside the Hero Banner, which implies it only controls that card. Since it actually filters data for the entire page (hero stats, YoY chart, capping), it belongs at the top of the page as a standalone filter bar.

### Placement

The date picker moves into a slim toolbar row that sits above all content sections:

```text
+------------------------------------------+
| Agent Performance        [Date Filter v]  |  <-- standalone filter bar
+------------------------------------------+
| Hero Banner (stats only, no date picker) |
+------------------------------------------+
| Year-over-Year Chart                     |
+------------------------------------------+
| Capping Section                          |
+------------------------------------------+
```

This makes it immediately clear that the date range applies globally to everything below it.

### What Changes

**1. Use `AgentFilterBar` as the page-level toolbar**
- The project already has an `AgentFilterBar` component built for exactly this purpose -- it shows the "Agent Performance" title on the left and the date filter on the right
- Render it at the top of the Dashboard page, above the hero banner

**2. Remove the date picker from `AgentHeroBanner`**
- Strip out the `dateRange`, `onDateRangeChange` props and the entire Popover/Calendar block from the hero banner
- The banner becomes a pure display card showing stats only
- Keep the "PERFORMANCE" badge and title, but the title can simplify to just a contextual label or be removed entirely since the filter bar already says "Agent Performance"

**3. Wire the date range through the page**
- The `dateRange` state stays in `Dashboard.tsx` (where it already lives)
- Pass it down to `AgentFilterBar` and to the hero banner (for display if needed)
- Future: pass it to `YearOverYearChart` and `CappingSection` when those components support date filtering

### Technical Details

**`src/pages/agent/Dashboard.tsx`**
- Import `AgentFilterBar`
- Render `<AgentFilterBar>` as the first child, before the hero banner
- Remove `dateRange` and `onDateRangeChange` props from `AgentHeroBanner`

**`src/components/agent/AgentHeroBanner.tsx`**
- Remove the `dateRange` and `onDateRangeChange` props
- Remove the Popover, Calendar, and preset imports
- Remove the date picker UI from the header row
- Simplify the header -- either keep a shorter title or remove the duplicate "Agent Performance" text since the filter bar handles it

**`src/components/agent/AgentFilterBar.tsx`**
- Already exists with the right layout -- no major changes needed, just ensure it's being used
