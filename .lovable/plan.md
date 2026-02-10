

# ICON Program UX Improvements

## Problems Identified

1. **At-a-glance status is missing** -- When you land on the page, there's no quick summary. You have to click through 4 tabs to understand your overall ICON status. The agent just wants to know: "Where do I stand?"

2. **Progress tooltip overlaps the label** -- The floating dollar amount badge (e.g., "$481.90") sits above the progress bar and clips over the "Individual Cap" label text, especially at low percentages.

3. **Redundant "Congratulations" illustrations take up too much space** -- The Cultural and Events tabs are dominated by large success illustrations that push the actual content below the fold. When the goal is already achieved, a compact confirmation is sufficient.

4. **Stock Grants tab uses placeholder-style illustrations** -- The dashed-border chart icons look like empty states rather than awarded grants, which is confusing.

5. **Year selector is inconsistent** -- Production uses "Capping Year" while Cultural/Events/Stock Grants use "Benefit Year" with different date ranges. This is data-driven so we'll keep labels accurate, but we can unify the visual placement.

6. **No overall progress indicator** -- There's nothing tying the 4 categories together to show how close the agent is to full ICON status.

## Proposed Changes

### 1. Add an ICON Status Summary Banner at the Top
Before the tabs, add a compact hero row showing all 4 pillars at a glance:

- **Production**: progress ring or bar showing percentage (e.g., "3%")
- **Cultural**: checkmark/complete badge  
- **Events**: "2/2" with checkmark
- **Stock Grants**: "4/4 Awarded"

This gives instant context so agents know exactly where they stand without clicking through tabs. Each pillar is clickable to jump to its tab.

### 2. Fix Progress Bar Tooltip Positioning
Move the dollar value label below the progress bar (or inline with the label row) instead of using absolute positioning above it. This eliminates the overlap issue at low percentages.

### 3. Compact the "Congratulations" Sections
Replace the large illustration + heading + paragraph with a single inline success banner (similar to the note banners already used). Example: a green-tinted card with a checkmark icon and "Cultural goal achieved for 2025-2026" on one line.

### 4. Replace Stock Grant Placeholder Illustrations
Replace the dashed-border chart icons with meaningful content: show the award amount (e.g., "$8,000" or "Pending") and a clean checkmark or clock icon. Remove the decorative dots/x marks.

### 5. Unify Year Selector into Page Header
Move the year selector out of individual tab content and into the page header area (next to "ICON Program" title), so it persists across tabs and reduces repeated UI.

## Technical Details

### File: `src/pages/agent/IconProgram.tsx`

**Summary Banner (new section before Tabs)**
- Add a 4-column grid of compact status cards above the tabs
- Each card shows: icon, pillar name, status (progress % or "Complete"), and is clickable to set the active tab via controlled `Tabs` state
- Convert from `defaultValue` to controlled `value` + `onValueChange` on the Tabs component

**Progress bar fix**
- Remove the `absolute -top-8` positioned tooltip div
- Place the current value inline: to the right of the label or below the bar as a `text-sm` span

**Compact success states**
- Replace `SuccessIllustration` component usage with an inline success banner:
  ```
  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 mb-6">
    <CheckCircle className="text-green-500" />
    <span>You have achieved your ICON Cultural goal for 2025-2026</span>
  </div>
  ```

**Stock Grant cards**
- Remove `StockGrantIllustration` component
- Replace with award amount text (e.g., "$8,000") or a large checkmark icon with clean styling (no dashed borders)

**Year selector consolidation**
- Move the Select component into the page header row
- Tab content no longer renders its own year selector

### File: `src/components/agent/IconStatusSummary.tsx`
- No changes needed (this is the dashboard summary widget, already compact)

