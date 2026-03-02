

# Make FLA / FLQA Full Names Visible in Title Row

## Problem
The full names "Front Line Agents" and "Front Line Qualifying Agents" are placed at the bottom of each tile in small, low-opacity text (`text-xs text-white/50`). They get lost beneath the numbers.

## Solution
Merge the full name into the title row next to the abbreviation and remove the redundant bottom label.

## File: `src/pages/revshare/Dashboard.tsx`

### FLA Tile (around line 128)
- Change the title span from `FLA` to `FLA · Front Line Agents`
- Remove the standalone `<p>Front Line Agents</p>` line at the bottom of the tile

### FLQA Tile (around line 138)
- Change the title span from `FLQA` to `FLQA · Front Line Qualifying Agents`
- Remove the standalone `<p>Front Line Qualifying Agents</p>` line at the bottom
- Keep the level progress line ("You are in level 3...") as-is since it serves a different purpose

### Result
Each tile header reads clearly:
- **FLA · Front Line Agents** — 24
- **FLQA · Front Line Qualifying Agents** — 18 / 30

No layout restructuring needed, just text changes.

