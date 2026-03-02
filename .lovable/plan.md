

# Ease Tile Spacing in Hero Banner

## Problem
The three hero tiles (Revenue Share, FLA, FLQA) feel cramped. Padding is tight (`px-3 py-2.5`) and internal margins between elements are minimal (`mb-1`, `gap-2`).

## Changes — `src/pages/revshare/Dashboard.tsx`

### 1. Increase tile padding
- Change `px-3 py-2.5` to `px-4 py-3.5` on all three tiles for more breathing room

### 2. Increase spacing between title row and metric
- Change `mb-1` on title rows to `mb-2` so the label isn't sitting right on top of the number

### 3. Increase gap between tiles
- Change `gap-2 sm:gap-3` on the grid to `gap-3 sm:gap-4`

### 4. Add spacing in Revenue Share breakdown
- Change `space-y-0.5` to `space-y-1` on the Before/After breakdown lines
- Add `mt-1` before the breakdown section for separation from the headline number

### 5. FLQA tile internal spacing
- Change `mt-0.5` on the level progress text to `mt-2` for separation from the numbers

These are small padding/margin tweaks across 6-8 lines — no layout restructuring needed.

