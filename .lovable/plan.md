

# Simplify Year Selectors to Short Labels

## What Changes

Replace the verbose date range labels (e.g., "06/01/2025 - 05/31/2026") with short year labels (e.g., "2025-26") across all tabs on the ICON Program page. On mobile, render segmented toggle buttons instead of dropdowns. On desktop, keep a compact dropdown with the same short labels.

## Why

Agents already know the standard date boundaries for Capping Year and Benefit Year -- showing full date ranges adds visual noise without helping comprehension.

## Labels

| Tab | Current Label | New Label |
|-----|--------------|-----------|
| Production (Capping Year) | 01/01/2026 - 12/31/2026 | 2026 |
| Production (Capping Year) | 01/01/2025 - 12/31/2025 | 2025 |
| Production (Capping Year) | 01/01/2024 - 12/31/2024 | 2024 |
| Cultural / Events / Stock Grants (Benefit Year) | 06/01/2025 - 05/31/2026 | 2025-26 |
| Cultural / Events / Stock Grants (Benefit Year) | 06/01/2024 - 05/31/2025 | 2024-25 |
| Cultural / Events / Stock Grants (Benefit Year) | 06/01/2023 - 05/31/2024 | 2023-24 |

## Implementation

### File: `src/pages/agent/IconProgram.tsx`

1. Import `useIsMobile` from `@/hooks/use-mobile`
2. Add controlled state for each year selector (production year, benefit year) replacing `defaultValue`
3. Create an inline `YearToggle` component:
   - **Mobile**: renders a horizontal row of pill buttons (min-h-[44px] touch targets, `bg-primary text-primary-foreground` for active, `bg-muted` for inactive)
   - **Desktop**: renders the existing `Select` dropdown but with short labels
4. Replace all 4 tab header selectors with `YearToggle`
5. Remove the "Capping Year" / "Benefit Year" text label on mobile (the tab context already tells the user what it is), keep it on desktop

### Mobile Result (390px)
```text
ICON Production Overview
[2026] [2025] [2024]
```

### Desktop Result
```text
ICON Production Overview          Capping Year [2026 v]
```

