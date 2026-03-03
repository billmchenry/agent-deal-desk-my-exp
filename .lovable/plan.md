
# Agent Production Details - Reusable DataTable with Mobile Cards

This plan updates the previous approved plan with three additions: column visibility chooser on desktop, mobile card layout, and full accessibility support.

---

## Architecture Overview

```text
Desktop (>=768px):                    Mobile (<768px):
+-------------------------------+     +---------------------------+
| UniversalFilterBar            |     | UniversalFilterBar        |
| [Date Range] [Status] [Search]|     | [Date] [Status] [Search]  |
+-------------------------------+     +---------------------------+
| [Columns v] [CSV] 42 results |     | [CSV] 42 results          |
+-------------------------------+     +---------------------------+
| Table with sortable headers   |     | Card: Status | TXN ID     |
| + column filters + pagination |     |   Address (truncated)     |
+-------------------------------+     |   Price   GCI   Cap       |
                                      +---------------------------+
                                      | Card: ...                 |
                                      +---------------------------+
                                      | Pagination                |
                                      +---------------------------+
```

---

## 1. Reusable DataTable Component

**File:** `src/components/shared/DataTable.tsx`

A generic, typed component that handles all data operations on the full dataset.

### Props
- `data: T[]` -- full dataset
- `columns: ColumnDef<T>[]` -- column config with `key`, `header` (i18n key), `type` ("string" | "number" | "currency" | "date" | "badge"), `sortable?`, `filterable?`, `defaultVisible?`, `render?` (custom render function)
- `searchableKeys?: (keyof T)[]` -- which columns global search checks
- `onRowClick?: (row: T) => void`
- `defaultPageSize?: number` (default 25)
- `defaultSort?: { key: keyof T; direction: "asc" | "desc" }`
- `csvFilename?: string`
- `mobileCardRender?: (row: T) => ReactNode` -- custom card layout for mobile

### Data Pipeline (operates on ALL data, not just visible page)
1. **Global search** -- filters across all `searchableKeys`
2. **Column filters** -- per-column text/enum filters (popover from header)
3. **Sort** -- single-column sort, toggling asc/desc/none
4. **Paginate** -- slice the final filtered+sorted result

### Desktop Table Features
- Sortable column headers: click to cycle asc -> desc -> none. Shows ChevronUp/ChevronDown icon.
- Column filter popovers: small Filter icon in header, opens popover with Input (for text/number) or Checkbox list (for badge/enum columns that auto-detect unique values).
- **Column visibility chooser**: A "Columns" dropdown button above the table. Checkboxes for each column. Unchecking hides the column. Persisted in component state (not localStorage -- each page can have different defaults via `defaultVisible` in column config).
- Pagination bar: "Rows per page" select (10/25/50/100), "Page X of Y", prev/next buttons.
- Row focus: rows are focusable via `tabIndex={0}` and activated with Enter/Space (calls `onRowClick`).

### Mobile Card Layout
- When `useIsMobile()` is true and `mobileCardRender` is provided, render cards instead of the table.
- Each card is a `<button>` (for accessibility) styled as a card, calling `onRowClick`.
- Cards stack vertically with the same pagination controls at the bottom.
- If no `mobileCardRender` is provided, fall back to a horizontally scrollable table (current behavior).

### Accessibility
- `role="grid"` on table, `role="row"` on rows, `role="columnheader"` on sortable headers.
- `aria-sort="ascending" | "descending" | "none"` on sorted column headers.
- Sort buttons have `aria-label` (e.g., "Sort by Sale Price ascending").
- Column filter popovers are keyboard-accessible (Radix Popover handles this).
- Rows have `tabIndex={0}`, `onKeyDown` for Enter/Space to open details.
- Focus ring uses `focus-visible:ring-2 focus-visible:ring-ring`.
- Table respects `rem`-based sizing so font-size scaling from Settings works.
- Result count announced via `aria-live="polite"` region.
- Min touch target 44px on mobile card buttons and pagination controls.

---

## 2. CSV Export Utility

**File:** `src/lib/csv-export.ts`

A standalone function `exportToCsv(rows, columns, filename)`:
- Iterates columns and rows, extracting **raw values** (not display-formatted):
  - `type: "currency"` / `"number"` -- plain decimal (e.g., `9750.00`), no locale separators
  - `type: "date"` -- ISO `YYYY-MM-DD`
  - `type: "string"` / `"badge"` -- raw string
- Headers use the English translation key value for data portability.
- Escapes fields containing commas, quotes, or newlines per RFC 4180.
- Prepends UTF-8 BOM (`\uFEFF`) for non-Latin script support in Excel.
- Creates `Blob` with `text/csv;charset=utf-8` and triggers download via temporary `<a>`.

---

## 3. Refactor Agent Production Details Page

### `src/pages/agent/Transactions.tsx`
- Rename page title to "Agent Production Details" via `useDocumentTitle`.
- Read `?status=` URL param to set initial status filter.
- Use `UniversalFilterBar` with DateRange + Status dropdown + Search.
- Use `DataTable` with column definitions for: Status, Transaction ID, Close Date, Sale Price, GCI, Address, Amt Toward Cap (and more columns hidden by default: Payment Settled Date, Transaction Type, Currency, Co-Agent %, etc.).
- Provide `mobileCardRender` function that renders a compact card showing Status badge, Transaction ID, truncated address, sale price, and GCI.

### Column Definitions
```text
Visible by default: Status, Transaction ID, Close Date, Sale Price, GCI, Address, Amt Toward Cap
Hidden by default: Payment Settled Date, Transaction Type, Currency, Buyer Agent, Co-Agent %, Agent Payable %, Agent Net Commission, Company Commission, Net Payment, Broker Review Fee, TC Fee, Mentor Fee
```

### `src/components/agent/MasterTransactionTable.tsx`
- Keep the file but export only the `Transaction` type and `transactionsData` array. The table rendering moves into the page via `DataTable`.
- Alternatively, move data to a separate file. Either way, the old table UI is replaced.

---

## 4. Clickable Agent Dashboard Widgets

### `src/components/agent/AgentHeroBanner.tsx`
- Wrap each `MiniStatCard` and the transactions group in a clickable container.
- Use `useNavigate()` to go to `/agent/transactions` on click.
- The transactions status group passes `?status=paid`, `?status=pending`, or `?status=withdrawn` depending on which count is clicked.
- Add `cursor-pointer`, `hover:bg-white/15` transition, and `role="link"` with `aria-label`.

---

## 5. Sidebar and Route Updates

### `src/data/mockData.ts`
- Rename the "Transactions" submenu item to "Agent Production Details".

### `src/components/layout/Sidebar.tsx`
- Update `NAV_KEYS` mapping: `"Agent Production Details": "nav.agentProductionDetails"`.

### `src/i18n/*.ts` (all 7 files)
- Add keys: `nav.agentProductionDetails`, `txn.agentProductionDetails`, `txn.pageOf`, `txn.rowsPerPage`, `txn.noResults`, `txn.downloadCsv`, `txn.columns`, `txn.showColumns`, `txn.paymentSettledDate`, `txn.transactionType`, `txn.currency`, `txn.sortAsc`, `txn.sortDesc`

---

## 6. New Files Summary

| File | Purpose |
|------|---------|
| `src/components/shared/DataTable.tsx` | Reusable table with sort, filter, pagination, column visibility, mobile cards, CSV, a11y |
| `src/lib/csv-export.ts` | Raw-value CSV export with UTF-8 BOM |

## Modified Files

| File | Change |
|------|--------|
| `src/pages/agent/Transactions.tsx` | Full rewrite using DataTable + UniversalFilterBar |
| `src/components/agent/MasterTransactionTable.tsx` | Strip to data-only export |
| `src/components/agent/AgentHeroBanner.tsx` | Make widgets clickable with navigation |
| `src/data/mockData.ts` | Rename nav item |
| `src/components/layout/Sidebar.tsx` | Update NAV_KEYS |
| `src/i18n/en.ts` + 6 other language files | Add new keys |

## Implementation Order

1. Create `src/lib/csv-export.ts`
2. Create `src/components/shared/DataTable.tsx` (the big one)
3. Add translation keys to all 7 language files
4. Refactor `Transactions.tsx` page with DataTable and mobile card render
5. Extract data from `MasterTransactionTable.tsx`
6. Update sidebar nav label and NAV_KEYS
7. Make AgentHeroBanner widgets clickable with navigation
