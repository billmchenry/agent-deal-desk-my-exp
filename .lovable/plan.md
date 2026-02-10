

# ICON Production Tab -- Add Missing Sections

## What's Missing

The Production tab currently only shows a single "Company Commission" card with "Individual Cap" and "Team Cap" sub-sections. The reference design shows a much richer layout:

### Section 1: Top Row (already partially exists, needs restructuring)
- **Company Commission** -- progress bar, 26.16%, $4,186.17 earned, goal $16K
- **Capped Transaction Fees** -- progress bar, 0%, $0.00 earned, goal $5K

### Section 2: Qualify - Option 2 (entirely missing)
A separate card with 4 metrics in a grid:
- **Company Commission** -- same progress as above (26.16%)
- **GCI** -- 4.19%, $20,930.87 / $500K goal
- **Closed Transactions** -- 50%, 5 out of 10 transactions
- **ICON Qualifying Fee** -- "Not Paid" status badge with explanatory text

## Changes

### File: `src/pages/agent/IconProgram.tsx`

1. **Restructure the top card** -- Replace "Individual Cap" and "Team Cap" with "Company Commission" and "Capped Transaction Fees" to match the reference. Each shows a progress bar, percentage, dollar amount badge, and a note about the goal.

2. **Add "Qualify - Option 2" card** -- A new Card below the first one containing a 4-column responsive grid:
   - Company Commission (progress bar + dollar badge)
   - GCI (progress bar + dollar badge)
   - Closed Transactions (progress bar + count badge)
   - ICON Qualifying Fee (status badge + description text, no progress bar)

3. **Dollar amount badges** -- The reference shows current dollar amounts in dark tooltip-style badges below the progress bars. These will be styled as small inline badges (dark background, white text) positioned below each progress bar.

4. **Layout** -- Top section uses a 2-column grid; Qualify - Option 2 uses a 4-column grid on desktop, stacking to 2 columns on tablet and 1 column on mobile.

## Technical Details

All changes are in `src/pages/agent/IconProgram.tsx` within the `production` TabsContent:

- Replace the existing "Company Commission" card content (lines 44-91) with two new sections
- Top card: 2-column grid with Company Commission and Capped Transaction Fees
- Second card: titled "Qualify - Option 2", 4-column grid with Company Commission, GCI, Closed Transactions, ICON Qualifying Fee
- Each metric card shows: label + status badge, progress bar, dollar/count badge, note text
- Use mock data values matching the reference screenshot for now
- Mobile responsive: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` for the Option 2 grid

