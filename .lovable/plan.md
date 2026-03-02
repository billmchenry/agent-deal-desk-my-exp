

# Unify CTA Styles Across Hero Banner and Payout Status

## Problem
The hero banner uses styled pill buttons (`bg-white/15`, rounded, padded) for "View FLA/FLQA List", while the Payout Status cards use plain text links (`text-exp-blue hover:underline`) for "View details". These should share a consistent action style.

## Approach
Since the Payout Status cards have light backgrounds, we can't use the same semi-transparent white style. Instead, we'll upgrade the three "View details" links to match the pill button pattern, adapted for light backgrounds:
- Style: `inline-flex items-center gap-1 rounded-md bg-muted hover:bg-muted/80 px-2.5 py-1 text-xs font-medium text-foreground transition-colors`
- This gives them the same shape, padding, and feel as the hero CTAs but with colors suited to the light card context.

## Changes -- `src/pages/revshare/Dashboard.tsx`

1. **Unpaid card "View details"** (line 194): Replace plain text link with pill button style
2. **Expected Next card "View details"** (line 208): Same treatment
3. **Last Paid card "View details"** (line ~223): Same treatment

All three get the same class: `inline-flex items-center gap-1 rounded-md bg-muted hover:bg-muted/80 px-2.5 py-1 text-xs font-medium text-foreground transition-colors`

This creates a unified CTA language: pill-shaped buttons with contextual coloring (white/15 on dark, muted on light).

