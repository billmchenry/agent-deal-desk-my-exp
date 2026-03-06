

## Plan: Show Last 6 Months on Mobile for YoY Chart

### File: `src/components/agent/YearOverYearChart.tsx`

**Change**: On mobile, automatically display only the last 6 months of data (Jul–Dec) instead of all 12. No toggle needed — just slice the data to the final 6 entries when `isMobile` is true.

```
const displayData = isMobile ? chartData.slice(6) : chartData;
```

- Remove the `selectedMonth` mobile tap logic's dependency on full 12-month indexing (already works since it matches by month name)
- No new state, no toggle UI — simpler than the H1/H2 approach
- Desktop remains unchanged (all 12 months)
- The existing mobile tap-to-select detail strip continues working as-is

