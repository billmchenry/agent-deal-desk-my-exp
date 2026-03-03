

# Reusable Filter Bar Component

A composable `UniversalFilterBar` component that provides a consistent filtering experience across all pages, with a slot-based architecture so each page can mix and match the filter items it needs.

---

## Design

```text
+-----------------------------------------------------------------------+
| [Page Title]                        [Date: YTD v] [Dropdown] [Search] |
|                                     (any combo of filter slots)       |
+-----------------------------------------------------------------------+
```

The component renders a consistent horizontal bar with the page title on the left and a flexible set of filter controls on the right. Each filter type is a sub-component that can be included or omitted per page.

---

## Architecture: Compound Component Pattern

Instead of one monolithic props interface, the filter bar uses a **compound component** pattern (like Radix/Shadcn). Pages compose only the filters they need:

```tsx
<UniversalFilterBar title="Agent Performance">
  <UniversalFilterBar.DateRange
    value={dateRange}
    onChange={setDateRange}
  />
  <UniversalFilterBar.Dropdown
    label="Status"
    options={statusOptions}
    value={status}
    onChange={setStatus}
  />
  <UniversalFilterBar.Search
    value={query}
    onChange={setQuery}
    placeholder="Search transactions..."
  />
  <UniversalFilterBar.Toggle
    label="Include Pipeline"
    checked={pipeline}
    onChange={setPipeline}
  />
</UniversalFilterBar>
```

---

## New Files

### 1. `src/components/filters/UniversalFilterBar.tsx`

The wrapper component that provides layout:
- Left side: optional `title` prop (string) rendered as `h1`
- Right side: renders `children` in a flex row with `gap-2`, wrapping on mobile
- Responsive: stacks vertically on small screens (`flex-col sm:flex-row`)
- Accepts optional `className` for customization

### 2. `src/components/filters/DateRangeFilter.tsx`

Sub-component for date range selection:
- **Props**: `value: { from?: Date; to?: Date }`, `onChange`, `presets?` (optional override)
- **Default presets**: YTD, MTD, Last Week, Last Year (from existing `AgentFilterBar`)
- **"Custom"** preset: when clicked, opens the dual-month calendar picker (existing pattern)
- Uses `useFormatters().formatDate` for display
- Uses `useTranslation().t()` for preset labels
- Popover with preset chips at top, calendar below
- Active preset is visually highlighted

### 3. `src/components/filters/DropdownFilter.tsx`

Generic dropdown filter:
- **Props**: `label: string`, `options: { value: string; label: string }[]`, `value: string`, `onChange`
- Uses existing `DropdownMenu` from Shadcn
- Shows current selection on the trigger button
- Supports optional `icon` prop (Lucide icon)

### 4. `src/components/filters/SearchFilter.tsx`

Search input:
- **Props**: `value: string`, `onChange`, `placeholder?`
- Uses existing `Input` component with search icon
- Debounced input (300ms) to avoid excessive re-renders
- Flexible width (`flex-1` in the bar)

### 5. `src/components/filters/ToggleFilter.tsx`

Checkbox toggle:
- **Props**: `label: string`, `checked: boolean`, `onChange`
- Uses existing `Checkbox` component
- Compact inline layout

### 6. `src/components/filters/PillFilter.tsx`

Horizontal pill/chip selector (like the category pills in Marketplace):
- **Props**: `options: { value: string; label: string }[]`, `value: string`, `onChange`
- Row of small buttons, active one uses `variant="default"`, others `variant="outline"`
- Scrollable on overflow

### 7. `src/components/filters/index.ts`

Barrel export that attaches sub-components to `UniversalFilterBar`:

```tsx
import { UniversalFilterBar as Bar } from "./UniversalFilterBar";
import { DateRangeFilter } from "./DateRangeFilter";
import { DropdownFilter } from "./DropdownFilter";
import { SearchFilter } from "./SearchFilter";
import { ToggleFilter } from "./ToggleFilter";
import { PillFilter } from "./PillFilter";

Bar.DateRange = DateRangeFilter;
Bar.Dropdown = DropdownFilter;
Bar.Search = SearchFilter;
Bar.Toggle = ToggleFilter;
Bar.Pills = PillFilter;

export { Bar as UniversalFilterBar };
```

---

## Migration: Replace Existing Filter Implementations

### Agent Dashboard (`src/pages/agent/Dashboard.tsx`)

Replace `AgentFilterBar` usage with:
```tsx
<UniversalFilterBar title={t("agent.performance")}>
  <UniversalFilterBar.DateRange value={dateRange} onChange={setDateRange} />
  <UniversalFilterBar.Toggle
    label={t("agent.includePipeline")}
    checked={includePipeline}
    onChange={setIncludePipeline}
  />
</UniversalFilterBar>
```

### Marketplace (`src/pages/marketplace/ReportMarketplace.tsx`)

Replace `MarketplaceFilters` with:
```tsx
<UniversalFilterBar title={t("marketplace.title")}>
  <UniversalFilterBar.Search value={query} onChange={setQuery} />
  <UniversalFilterBar.Dropdown label="Category" options={categories} ... />
  <UniversalFilterBar.Dropdown label="Sort" options={sortOptions} ... />
</UniversalFilterBar>
<UniversalFilterBar.Pills options={categories} value={cat} onChange={setCat} />
```

### Chat History (`src/pages/mira/History.tsx`)

Replace inline filter markup with:
```tsx
<UniversalFilterBar title={t("chat.history")}>
  <UniversalFilterBar.Search value={query} onChange={setQuery} />
  <UniversalFilterBar.Dropdown label="Date" options={dateFilterOptions} ... />
</UniversalFilterBar>
```

### Pulse (`src/pages/Pulse.tsx`)

Replace inline filter buttons with:
```tsx
<UniversalFilterBar title={t("pulse.title")}>
  <UniversalFilterBar.Dropdown label="Type" options={typeOptions} ... />
  <UniversalFilterBar.Dropdown label="Priority" options={priorityOptions} ... />
</UniversalFilterBar>
```

---

## Translation Keys

Add to all `src/i18n/*.ts` files:
- `filter.ytd`, `filter.mtd`, `filter.lastWeek`, `filter.lastYear`, `filter.custom`
- `filter.selectDateRange`, `filter.search`
- `filter.allTypes`, `filter.priority`

---

## Implementation Order

1. Create the 7 new files in `src/components/filters/`
2. Add translation keys to all language files
3. Migrate Agent Dashboard (replace `AgentFilterBar`)
4. Migrate Marketplace (replace `MarketplaceFilters`)
5. Migrate Chat History (replace inline filters)
6. Migrate Pulse (replace inline filter buttons)
7. Delete the old `AgentFilterBar.tsx` and `MarketplaceFilters.tsx`

