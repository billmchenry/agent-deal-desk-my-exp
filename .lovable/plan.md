

# Fix Awkward Hero Banner Tile Layout

## Problem
The current layout uses a 4-column grid where Revenue Share spans 2 columns, making it twice as wide as FLA/FLQA. Combined with `items-start`, the FLA tile looks tiny and disconnected. The screenshot shows all three tiles should feel balanced and roughly equal in height.

## Solution
Switch from a 4-column grid to a **3-column grid** where:
- Revenue Share gets `col-span-1` (same width as the others, not double)
- All three tiles stretch to equal height (remove `items-start`, use default `items-stretch`)
- This naturally balances the layout since all tiles are the same width and height

### File: `src/pages/revshare/Dashboard.tsx` (lines 107-158)

1. Change the grid from `grid-cols-2 lg:grid-cols-4` to `grid-cols-1 sm:grid-cols-3`
2. Remove `items-start` (let tiles stretch to equal height -- this works now because same-width tiles have similar content density)
3. Remove `col-span-2` from the Revenue Share tile

This matches the screenshot where all three tiles sit side-by-side at equal widths and heights.

