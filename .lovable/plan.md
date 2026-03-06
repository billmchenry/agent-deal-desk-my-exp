

## Settings Consistency Audit: Dates, Currencies & Numbers

### Problem

Several pages and components bypass the `useFormatters` hook and render dates, currencies, or numbers with hardcoded `$` signs, raw `.toLocaleString()`, or `.toFixed()` instead of respecting the user's Settings preferences.

### Violations Found

**Category 1: Hardcoded `$` in chart formatters (not using `formatCurrency`)**

| File | Location | Current |
|------|----------|---------|
| `ForecastWidget.tsx` | Y-axis + tooltip | `` `$${value}` `` |
| `revshare/Dashboard.tsx` | 4 chart Y-axes + tooltips | `` `$${v.toFixed(1)}M` ``, `` `$${Math.round(v*1000)}K` `` |

**Category 2: Raw `.toLocaleString()` / `.toFixed()` instead of `formatNumber`**

| File | Location | Current |
|------|----------|---------|
| `Notifications.tsx:380` | salesPrice display | `salesPrice.toLocaleString()` — should use `formatCurrency` |
| `Organization.tsx` (x4) | Productivity per person | `.toFixed(2)` — should use `formatNumber` |
| `DistributionDonut.tsx:60` | Percentage | `.toFixed(1)` — acceptable for %, but should use `formatNumber` for locale-aware decimal |
| `VelocityWidget.tsx:27` | Improvement % | `.toFixed(0)` — acceptable for simple integer |

**Category 3: Hardcoded date strings not run through `formatDate`**

| File | Location | Current |
|------|----------|---------|
| `Notifications.tsx` | `timestamp` field (x12 items) | Hardcoded `"03/07/2025 12:00 AM"` displayed raw |
| `Notifications.tsx:384` | `capReachedDate` display | Rendered raw without `formatDate` |
| `YearEnd.tsx:208` | `reportingDate` | Hardcoded `"01/01/2026"` displayed raw |
| `OrganizationTree.tsx` | `revShare` / `contribution` fields | Hardcoded `"$6,487.88"` strings — these are pre-formatted in mock data, bypassing formatters |

**Category 4: Hardcoded currency in mock data strings**

| File | Location | Issue |
|------|----------|-------|
| `OrganizationTree.tsx:55-72` | `revShare: "$6,487.88"`, `contribution: "53.51 USD"` | Pre-formatted strings instead of numeric values |
| `Trends.tsx:15-50` | `"892.71 USD"`, `"3,987.73 USD"` etc. | Pre-formatted strings in table data |
| `NotificationsSheet.tsx:27` | `"$4,250 has been deposited"` | Hardcoded in description text — leave as-is (natural language) |

### Plan

**1. Fix chart formatters** (2 files)
- `ForecastWidget.tsx` — import `useFormatters`, use `formatCurrency` in `tickFormatter` and `Tooltip formatter`
- `revshare/Dashboard.tsx` — replace all 4 chart Y-axis `tickFormatter` and `Tooltip formatter` callbacks to use `formatCurrency` with compact options instead of hardcoded `$`

**2. Fix display-time formatting** (3 files)
- `Notifications.tsx` — use `formatCurrency` for `salesPrice`, `formatDate` for `capReachedDate` and `timestamp` display
- `Organization.tsx` — replace `.toFixed(2)` with `formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })` in all 4 occurrences
- `DistributionDonut.tsx` — use `formatNumber` for the percentage calculation

**3. Fix hardcoded date in mock data** (1 file)
- `YearEnd.tsx` — format `reportingDate` through `formatDate` at render time

**4. Convert pre-formatted currency strings to numeric values** (2 files)
- `OrganizationTree.tsx` — change `revShare` and `contribution` from pre-formatted strings to numbers, format at render time with `formatCurrency`
- `Trends.tsx` — this has deeply embedded pre-formatted strings in table data; the cleanest approach is to format them at render time by parsing the numeric portion, but given the complexity, a pragmatic first pass is to leave the tabular mock data as-is and flag it for future refactor when real data replaces mocks

**5. Leave as-is**
- `VelocityWidget.tsx` `.toFixed(0)` on a percentage — simple integer, no locale sensitivity needed
- `NotificationsSheet.tsx` description text with `$4,250` — natural language string
- `MiraChatContext.tsx` chat messages with `$279K` — natural language AI responses
- `csv-export.ts` `.toFixed(2)` — CSV export format, intentionally consistent

### Files to Change (~6 files)

1. `src/components/dashboard/widgets/ForecastWidget.tsx`
2. `src/pages/revshare/Dashboard.tsx`
3. `src/pages/notifications/Notifications.tsx`
4. `src/pages/revshare/Organization.tsx`
5. `src/components/revshare/DistributionDonut.tsx`
6. `src/pages/revshare/OrganizationTree.tsx`

