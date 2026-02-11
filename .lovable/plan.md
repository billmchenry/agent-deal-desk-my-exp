

# ICON Program Hero: Compact Context Banner

## Change

Replace the current ICON Program gradient hero banner content with a minimal version: just the "ICON PROGRAM" badge and the one-line summary ("3 of 4 pillars complete -- Keep going!"). Remove the page title from inside the hero since it will live in a plain h1 above.

## File: `src/pages/agent/IconProgram.tsx`

1. Add a plain h1 title row above the hero (matching the AgentFilterBar style on the Dashboard)
2. Simplify the gradient hero Card to contain only:
   - The "ICON PROGRAM" badge (with Target icon)
   - The subtitle: "3 of 4 pillars complete -- Keep going!"
3. Remove the `h1` that currently lives inside the hero

The hero becomes a slim, branded visual anchor -- no stat cards, no title duplication. All data stays in the pillar cards and tab content below.

