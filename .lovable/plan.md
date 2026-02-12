

## Show Pillar Completion as a Percentage

### What Changes
Replace the "1 of 3 pillars complete" text in the ICON Program hero banner with a percentage — e.g., "33% complete" — for a cleaner, more intuitive read.

### How It Works
Since 1 out of 3 pillars is complete, the display will show **33%**. The calculation is straightforward: `Math.round((completedPillars / 3) * 100)`.

### File: `src/pages/agent/IconProgram.tsx`
- Update the hero banner summary line from:
  `1 of 3 pillars complete`
  to:
  `33% of pillars complete`
- The motivational subtitle ("Keep going — you're almost there!") stays as-is

### No other files change

