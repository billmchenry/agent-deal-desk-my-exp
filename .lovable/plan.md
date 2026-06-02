## Goal

Restyle the filter/toolbar area on the Transactions pages to match the chosen **"Professional utility grid"** mockup. Same controls and behavior — just reorganized into two rows:

1. **Row 1**: pill search (flex-1) + segmented tab chip group (Listings / Transactions) + "More filters" button.
2. **Row 2**: a soft-tinted container (`bg-muted/40 rounded-[32px] p-6`) with a 4-column grid of labeled dropdowns (label above each pill `Select`).

## Changes

### 1. New primitive — `src/components/filters/LabeledFilter.tsx`
Tiny wrapper that renders an uppercase label above any control:
```tsx
<div className="space-y-2 min-w-0">
  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.1em] ms-1">{label}</label>
  {children}
</div>
```
Export it from `src/components/filters/index.ts` and attach to `UniversalFilterBar.Labeled` for the compound pattern.

### 2. `src/pages/business/Transactions.tsx` (toolbar block, ~lines 437–474)
Replace the current single-row toolbar with the two-row layout:

- **Row 1** (`flex items-center gap-3`):
  - `SearchFilter` (flex-1, existing pill style) — bound to `search`.
  - Existing source `Tabs` (Listings / Transactions) styled as a segmented chip container (`bg-muted p-1.5 rounded-[51px]`), counts preserved.
  - "More filters" `Button` (variant outline, `rounded-[51px]`, `SlidersHorizontal` icon) wrapped in a `Popover` with placeholder "No additional filters yet" content.
- **Row 2** (soft container):
  ```tsx
  <div className="rounded-[32px] border border-border/60 bg-muted/40 p-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <LabeledFilter label={t("transactions.filter.status")}>
        <Select … pill-styled trigger />
      </LabeledFilter>
      {/* Date Range, Agent, Office — wired to existing state where present, otherwise placeholder "All" */}
    </div>
  </div>
  ```
- Remove the row of 4 pill status buttons and the raw `<input>` search; the underlying `statusFilter` state stays.
- All controls use `rounded-[51px]` and min-height 44px per project memory.

### 3. `src/pages/agent/Transactions.tsx` (UniversalFilterBar children, ~lines 200–251)
Apply the same two-row pattern so both pages feel consistent:

- Keep `UniversalFilterBar` for the title only.
- Below the title, render Row 1 = `SearchFilter` + status popover trigger (chip) + "More filters" button.
- Render Row 2 = the soft-tinted labeled grid with `LabeledFilter` wrapping **Status**, **Date Range** (uses existing `UniversalFilterBar.DateRange`), and **Include Pipeline** toggle (where applicable). No new logic.

## Non-goals

- No changes to `DataTable`, columns, stat cards, page header, or business logic.
- "More filters" popover is a placeholder shell.
- Other list pages (Mentees, RevShare, etc.) untouched in this pass.

## Files touched

- `src/components/filters/LabeledFilter.tsx` *(new)*
- `src/components/filters/index.ts` *(export + compound attach)*
- `src/pages/business/Transactions.tsx` *(toolbar block only)*
- `src/pages/agent/Transactions.tsx` *(filter bar children only)*
