

# Combined Plan: RevShare Dashboard Upgrade + Font Rules

## Summary

Enhance the existing RevShare Dashboard with: (1) a reusable `DistributionDonut` component, (2) a working agents/revshare toggle via shared state, (3) multi-period comparison chart (yearly/quarterly/monthly with mobile scroll), (4) FLQA progress bar, and (5) `font-secondary` on all numeric/currency values throughout.

## Files

### 1. NEW: `src/components/revshare/DistributionDonut.tsx`

Reusable donut chart with center label + vertical legend. Props: `data`, `total`, `formatValue`, `centerLabel`. Uses Recharts `PieChart`/`Pie`/`Cell`, dark-mode-safe colors (`hsl(var(--card))` stroke), and `font-secondary` on all numeric values in the legend and center.

### 2. REWRITE: `src/pages/revshare/Dashboard.tsx`

Key changes from current version:

- **Add state**: `compPeriod` (yearly/quarterly/monthly) and `distMode` (agents/revshare) as controlled state instead of uncontrolled Tabs
- **Add mock data**: `levelRevShare`, `countryRevShare`, `revenueQuarterlyGrouped`, `revenueMonthlyGrouped` arrays from the user's code
- **Distribution section**: Single `distMode` toggle controls both donut charts. When "revshare", show dollar amounts; when "agents", show agent counts. Replace inline PieChart code with `DistributionDonut` component
- **Comparison section**: Replace single ComposedChart with period-aware rendering:
  - Yearly: bar chart (current style)
  - Quarterly: multi-line chart (y2024/y2025/y2026 lines)
  - Monthly: multi-line chart, horizontally scrollable on mobile (min-w-[600px] wrapper), tap-to-select detail strip below chart
- **FLQA progress bar**: Add visual progress indicator (0→18 current→30 goal) with level-up messaging
- **Font rules**: Add `font-secondary` class to every numeric/currency element:
  - Hero banner: `$264,138.52`, `$242,857.04`, `$21,281.48`, FLA count `24`, FLQA counts `18`/`30`
  - Payout cards: `$1,869.20`, `$986.92`
  - Donut centers and legend values
  - Chart axis ticks: `tick={{ fontFamily: 'var(--font-secondary)' }}`
  - Tooltip values
- Keep all existing i18n (`useTranslation`), formatting (`useFormatters`), a11y (`min-h-[44px]`, aria labels), and dark mode patterns

### 3. No i18n changes needed

The current i18n files already have all needed revshare keys from the previous implementation.

## Implementation Order

1. Create `DistributionDonut` component
2. Rewrite `Dashboard.tsx` with combined enhancements + font-secondary everywhere

