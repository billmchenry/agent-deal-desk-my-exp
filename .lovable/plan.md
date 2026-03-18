

## Problem

On mobile, the Year-over-Year chart truncates data to only the last 6 months (lines 91-96). Users cannot scroll to view other months.

## Solution

Make the chart horizontally scrollable on mobile, showing all 12 months with a wider inner container that overflows.

### Changes in `src/components/agent/YearOverYearChart.tsx`

1. **Remove the 6-month truncation** -- delete the mobile filtering logic (lines 90-96) so `chartData` always equals `fullData` (all 12 months).

2. **Wrap the chart in a horizontally scrollable container on mobile** -- on mobile, render the `BarChart` inside a `div` with `overflow-x-auto` and an inner `div` with a fixed minimum width (e.g., `min-w-[700px]`) so all 12 bars render and the user can swipe left/right. On desktop, keep the current `ResponsiveContainer` behavior unchanged.

3. **Add a scroll hint** -- below the chart on mobile, add a subtle text hint like "Swipe to see more months" or a small horizontal fade indicator so users know the content is scrollable.

