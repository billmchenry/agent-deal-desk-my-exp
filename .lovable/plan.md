

## Redesign the Agent Performance Date Filter

The current date filter button on the hero banner looks like a standalone, old-school filter button floating awkwardly below the title. It needs to feel more integrated and modern.

### What Changes

**Move the date range into the header row** -- Instead of a separate row with a chunky button, the date range will be displayed inline next to the title as a subtle, clickable text element with a calendar icon. This mirrors how modern dashboards show contextual filters -- clean, minimal, and part of the header flow.

**New filter design:**
- The date range text sits right next to "Agent Performance" on the same line (or wraps naturally on mobile)
- Styled as a light, understated pill with a small `CalendarDays` icon -- white text with a subtle underline/border on hover
- No heavy `bg-white/15` block; instead a transparent trigger with a light bottom border or subtle opacity shift on hover
- Preset chips (YTD, MTD, etc.) remain inside the popover calendar dropdown

### Technical Details

**File: `src/components/agent/AgentHeroBanner.tsx`**

1. Remove the standalone "Date filter row" `div` (lines 107-139)
2. Integrate the date picker trigger into the header section alongside the title:
   - Title "Agent Performance" on the left
   - Date range as a compact, clickable element on the right of the same row
   - Use `CalendarDays` icon instead of `Filter` icon for a more modern look
   - Style: transparent background, `text-white/80 hover:text-white` with a subtle bottom border or rounded pill with very light border (`border border-white/20`)
3. On mobile, the date range wraps below the title naturally using `flex-wrap`
4. The popover content (presets + calendar) stays the same -- only the trigger visual changes

### Visual Result

**Before:**
```text
[PERFORMANCE badge]
Agent Performance
[ Filter icon  01/01/2026 - 02/06/2026 ]    <-- bulky, separate row

[Units] [Volume] [Commission] [Transactions]
```

**After:**
```text
[PERFORMANCE badge]
Agent Performance          [calendar] Jan 1 - Feb 6, 2026
                                       ^-- subtle, inline

[Units] [Volume] [Commission] [Transactions]
```

The date text uses a friendlier format (`MMM d, yyyy`) instead of the utilitarian `MM/dd/yyyy`, and the trigger is styled to feel like part of the banner rather than a separate control.

