

## Problem
On mobile, the chart legend ("Current Year" / "Previous Year") is inside the scrollable chart container, so it scrolls away with the chart data.

## Solution
Move the legend outside the scrollable container on mobile so it stays fixed/visible.

### Changes in `src/components/agent/YearOverYearChart.tsx`

1. **Remove `<Legend />` from the mobile BarChart** (line 139) — hide Recharts' built-in legend on mobile.

2. **Add a custom static legend above the scrollable chart container** (before the `overflow-x-auto` div, inside mobile branch):
   ```tsx
   <div className="flex items-center gap-4 mb-2 px-1">
     <div className="flex items-center gap-1.5">
       <span className="inline-block h-3 w-3 rounded-sm bg-[hsl(var(--exp-blue))]" />
       <span className="text-xs text-muted-foreground">Current Year</span>
     </div>
     <div className="flex items-center gap-1.5">
       <span className="inline-block h-3 w-3 rounded-sm bg-[hsl(var(--exp-navy-light))]" />
       <span className="text-xs text-muted-foreground">Previous Year</span>
     </div>
   </div>
   ```

3. Desktop chart keeps its existing `<Legend />` unchanged.

