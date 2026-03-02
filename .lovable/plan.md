

# Fix Stretched/Unbalanced Hero Banner Tiles

## Problem
The 4-column grid forces all tiles to the same height. The Revenue Share tile (col-span-2) and FLQA tile have lots of content, but the FLA tile has very little -- so it stretches vertically with empty space, looking unbalanced.

## Solution
Change the grid layout so tiles are not forced to stretch equally. Two adjustments:

### File: `src/pages/revshare/Dashboard.tsx` (lines 107-158)

1. **Split into two rows instead of one 4-column grid**:
   - **Row 1**: Revenue Share tile at full width (remove col-span-2, make it a standalone row)
   - **Row 2**: FLA and FLQA side by side in a 2-column grid (`grid-cols-2`)
   
   This way FLA and FLQA each size to their own content height independently of the Revenue Share tile.

2. **Alternative (simpler)**: Keep the current 4-column grid but add `items-start` to the grid container (line 107) so tiles align to the top and don't stretch to match the tallest sibling:
   - Change `grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3` to `grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 items-start`

The simpler approach (option 2) is recommended -- it's a single class addition that stops tiles from stretching to fill the row height.

