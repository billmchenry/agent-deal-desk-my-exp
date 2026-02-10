

# Fix Year Selector: "Capping Year" vs "Benefit Year" Per Tab

## The Problem

The current ICON Program page has a single year selector in the hero banner that shows the same label and date ranges regardless of which tab is active. In the production app:

- **Production tab** uses the label **"Capping Year"** with calendar-year ranges (e.g., 01/01/2026 - 12/31/2026)
- **Cultural, Events, and Stock Grants tabs** use the label **"Benefit Year"** with mid-year ranges (e.g., 06/01/2025 - 05/31/2026)

## The Fix

Move the year selector out of the hero banner and into each tab's content area, so each tab can display the correct label and date range options.

### File: `src/pages/agent/IconProgram.tsx`

1. **Remove the year selector from the hero banner** -- Delete the Select dropdown from the gradient banner (lines 35-46). The banner will keep the title, badge, and progress summary only.

2. **Add a tab-specific header row to each TabsContent** -- Each tab will get a header row with the section title on the left and the appropriate year selector on the right:

   - **Production tab**: Label reads "Capping Year", options use calendar-year ranges:
     - 01/01/2026 - 12/31/2026
     - 01/01/2025 - 12/31/2025
     - 01/01/2024 - 12/31/2024

   - **Cultural tab**: Label reads "Benefit Year", options use mid-year ranges:
     - 06/01/2025 - 05/31/2026
     - 06/01/2024 - 05/31/2025
     - 06/01/2023 - 05/31/2024

   - **Events tab**: Same "Benefit Year" label and mid-year ranges as Cultural

   - **Stock Grants tab**: Same "Benefit Year" label and mid-year ranges as Cultural

3. **Header row layout** -- Each tab header will use a flex row with `justify-between items-center`:

```text
[Section Title]                    [Label]  [Dropdown]
ICON Production Overview     Capping Year   01/01/2026 -...
```

This matches the production screenshots exactly.

## Summary of Changes

| Tab | Label | Date Range Format |
|-----|-------|------------------|
| Production | Capping Year | 01/01/YYYY - 12/31/YYYY |
| Cultural | Benefit Year | 06/01/YYYY - 05/31/YYYY |
| Events | Benefit Year | 06/01/YYYY - 05/31/YYYY |
| Stock Grants | Benefit Year | 06/01/YYYY - 05/31/YYYY |

Only one file is modified: `src/pages/agent/IconProgram.tsx`.

