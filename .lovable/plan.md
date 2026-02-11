
# Tone Down the ICON Program Page

## What's Making It Visually Loud

1. **Large gradient hero banner** with decorative circles takes up significant space and draws heavy attention
2. **Company Commission and Capped Transaction Fees cards** duplicate data that already appears in the "Qualify - Option 2" section below
3. **Colored icon circles** on every metric (blue, gold, green, purple, red) create visual competition
4. **Dark tooltip-style value labels** (the black pill with white text like "$4,186.17") are heavy and attention-grabbing
5. **"In Progress" badges** on every card add clutter
6. **Too many sections** stacked vertically -- the top two cards + Qualify Option 2 show overlapping information

## The Changes

### 1. Shrink the hero banner
- Remove the decorative background circles
- Reduce padding from `p-4 sm:p-6` to `p-3 sm:p-4`
- Keep it as a simple branded header: badge, title, subtitle -- but more compact

### 2. Remove the duplicate top-row cards (Company Commission + Capped Transaction Fees)
- These two cards (lines 65-117) repeat data already shown in "Qualify - Option 2" below
- Delete them entirely so the Production tab goes straight from the header row to "Qualify - Option 2"

### 3. Simplify "Qualify - Option 2" metrics
- Remove the colored icon circles next to each metric title (the rounded-lg div with DollarSign, TrendingUp, Home, Award icons)
- Replace the dark pill value labels (`bg-foreground text-background`) with plain text styling (`text-sm font-semibold text-foreground`)
- Keep progress bars and percentages -- they're functional, not decorative

### 4. Simplify the pillar status banner cards
- Remove the colored background circles behind icons in the `IconStatusBanner` component
- Show just the icon directly, using the color (green for complete, primary for in-progress)
- This reduces the "badge-in-circle" pattern that repeats 4 times

### 5. Simplify the Stock Grants tab
- Remove the large green circle with Award icon from each grant card
- Show a simpler layout: title, amount, and status badge without the oversized icon

## Files Modified

| File | Change |
|------|--------|
| `src/pages/agent/IconProgram.tsx` | Remove duplicate top-row cards, strip colored icon circles from Qualify metrics, simplify value labels, compact hero banner |
| `src/components/agent/IconStatusBanner.tsx` | Remove colored background circles, show icons directly |

## What Stays the Same
- The 4-pillar navigation cards (Production, Cultural, Events, Stock Grants) -- they're functional navigation
- Progress bars -- they convey real data
- Year selectors -- functional controls
- Note banners -- important legal/informational text
- Success banners on Cultural/Events tabs -- they're compact already
