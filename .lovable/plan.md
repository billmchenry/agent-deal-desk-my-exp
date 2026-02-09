

## Make the Capping History Table More Intuitive

The current table has some UX issues: the "Contains" placeholder is unclear, the filter row adds visual noise for a small dataset, and there's no visual distinction between active/current rows vs. completed ones.

### Improvements

**1. Replace "Contains" placeholders with "Filter..."**
- Change all filter input placeholders from "Contains" to "Filter..." -- shorter, more universally understood.

**2. Add visual cues to the Cap % column**
- Show a small inline progress bar or colored text for the Cap % value (green for 100%, muted for 0%, brand blue for in-progress percentages). This makes it scannable at a glance.

**3. Highlight the current/active capping year**
- The top row (2026, currently in progress) should have a subtle left-border accent or light background tint to indicate it's the active period.

**4. Replace "-" with more descriptive text**
- Change "Cap Reached: -" to "In Progress" or "Not Yet" so users don't have to guess what the dash means.

**5. Collapse filter row by default (optional toggle)**
- Since this is a small table (5 rows), having a permanent filter row is heavy. Instead, add a small filter icon toggle in the header that shows/hides the filter inputs. This keeps the table clean by default.

### Files to Modify

**`src/components/agent/CappingHistorySection.tsx`**
- Update placeholder text from "Contains" to "Filter..."
- Add a `showFilters` toggle state with a filter icon button in the header
- Conditionally render the filter row based on toggle
- Add colored styling to Cap % values (green for 100%, muted for 0%, blue for in-progress)
- Highlight the first row (active year) with a subtle `bg-primary/5` or left border accent
- Replace "-" in Cap Reached with "In Progress" label using a subtle badge

### Technical Details

- Cap % color logic: parse the percentage string, apply `text-exp-green` for 100%, `text-muted-foreground` for 0%, `text-exp-blue` for anything in between
- Active row detection: check if the current date falls within the start/end date range
- Filter toggle: small `Filter` or `SlidersHorizontal` icon button next to the "History" header

