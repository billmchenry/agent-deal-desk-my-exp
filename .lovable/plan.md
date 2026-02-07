

## Fix Calendar Dropdown UX

The month and year selectors in the calendar look like static text boxes because the native dropdown arrow is hidden (`appearance-none`) with no replacement visual indicator. Users can't tell these are interactive. Having both arrow navigation and dropdowns side-by-side also creates confusion.

### What Changes

**Make dropdowns obviously interactive** -- Add a visible dropdown chevron indicator and improve the visual styling so users immediately recognize these as selectable controls.

**Simplify navigation** -- When dropdowns are active, the left/right arrow buttons become redundant. Hide them so the caption area is clean and focused on the dropdown controls.

### Technical Details

**File: `src/components/ui/calendar.tsx`**

1. Update the `dropdown` class to restore a styled dropdown arrow using CSS `background-image` (an inline SVG chevron) positioned on the right side, with appropriate padding-right to make room for it
2. Add a subtle filled background (`bg-muted/50`) and stronger hover state (`hover:bg-accent`) so the dropdowns feel like real controls rather than flat text
3. When `hasDropdowns` is true, hide the nav buttons by conditionally applying `hidden` to `nav_button_previous` and `nav_button_next` -- since the dropdowns already handle month/year jumping, the arrows are redundant
4. Slightly increase padding on the dropdowns for better touch targets

These changes apply globally to the Calendar component, so both the Agent Dashboard date picker and any future calendar usage benefit automatically.
