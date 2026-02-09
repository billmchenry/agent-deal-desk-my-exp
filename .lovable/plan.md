

## Add Month/Year Dropdowns to the Agent Filter Calendar

The calendar in the AgentFilterBar currently shows "February 2026" / "March 2026" as static text with only left/right arrow navigation. To quickly jump to a different month or year, the calendar needs dropdown selectors.

### What Changes

Add three props to the `Calendar` component in `AgentFilterBar.tsx`:

- `captionLayout="dropdown-buttons"` -- switches the month/year headers from plain text to dropdown selects
- `fromYear={2015}` -- sets the earliest selectable year
- `toYear={new Date().getFullYear() + 1}` -- sets the latest selectable year (2027)

The Calendar component already has built-in styling for dropdowns (the chevron indicator and hover states we fixed earlier), so no additional CSS work is needed.

### Technical Details

**File: `src/components/agent/AgentFilterBar.tsx`** (line ~80)

Update the `<Calendar>` element to include:

```tsx
<Calendar
  mode="range"
  captionLayout="dropdown-buttons"
  fromYear={2015}
  toYear={new Date().getFullYear() + 1}
  selected={dateRange}
  onSelect={(range) =>
    onDateRangeChange({ from: range?.from, to: range?.to })
  }
  numberOfMonths={2}
  className={cn("p-3 pointer-events-auto")}
/>
```

This is a single-line addition -- no other files need changes.
