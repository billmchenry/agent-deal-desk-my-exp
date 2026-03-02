

# Add Missing Information to Hero Banner Tiles

## File: `src/pages/revshare/Dashboard.tsx`

Only the hero banner tiles (Section 1, lines 107-151) need updating. No design changes -- just adding the missing text content.

### Change 1: Revenue Share tile (lines 108-120)
Add two additional lines below the main amount showing the breakdown:
- "Before Adj." with "$242,857.04" (white/70 muted text)
- "Adjustment" with "+$21,281.48" (white/70 muted text)

### Change 2: FLA tile (lines 122-131)
Add subtitle text "Front Line Agents" below the "FLA" label (white/50 muted text, text-[10px])

### Change 3: FLQA tile (lines 133-151)
Add:
- "Front Line Qualifying Agents" subtitle below "FLQA" label
- Level progress text: "You are in level 3. Add 2 more agents to reach level 4" (exp-gold-light colored text, text-[10px])

### No other sections change
Sections 2 (Payout Status), 3 (Distribution), and 4 (Comparison) remain untouched.

