

## Consistent Tab Padding Across the Project

### Problem
The base `TabsList` component defines `h-12 p-1.5` and `TabsTrigger` defines `py-2`, but several instances override these with smaller heights (`h-8`, `h-7`), creating inconsistent vertical padding across tabbed menus.

### Inconsistencies Found

| File | TabsList Override | TabsTrigger Override |
|------|------------------|---------------------|
| `UplinePartnersCard.tsx` | `h-8` | none |
| `YearOverYearChart.tsx` | `h-8` | `h-7` |
| All other instances | none (uses default `h-12`) | none (uses default `py-2`) |

### Plan
Remove the height overrides from the two files so all tabs use the base component's standard `h-12` / `py-2` padding:

1. **`src/components/dashboard/UplinePartnersCard.tsx`** — Remove `h-8` from `TabsList`
2. **`src/components/agent/YearOverYearChart.tsx`** — Remove `h-8` from `TabsList` and `h-7` from each `TabsTrigger`

No changes needed to the base `tabs.tsx` component or any other files — all other instances already use the default sizing.

