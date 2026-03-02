

# RevShare Dashboard -- Complete Rebuild

Full rewrite of `src/pages/revshare/Dashboard.tsx` to match all three screenshots, with improved layout spacing, visual hierarchy, and responsive behavior.

---

## What Gets Removed

- CTA Banner ("Want to Grow Your Rev Share?")
- Old 4-card stats grid (FLA/FLQA/New Agents/Prospective Agents)
- Old Revenue Share Group card with Lineage/Contributor tabs
- Old Payout Details card
- Co Sponsees card
- Old mock data arrays (`levelData`, `coSponsees`)

---

## What Gets Built (4 Sections)

### Section 1: Revenue Share & Agent Metrics

- **Section header row**: "Revenue Share & Agent Metrics" title on the left, period filter ("Showing metrics for selected period" text + "Year to Date" Select dropdown) on the right
- **3-column grid** (`grid-cols-1 md:grid-cols-3`):
  - **Revenue Share card** -- dark primary background (`bg-primary text-primary-foreground`), DollarSign icon, three line items with "Before Adjustment", "Adjustment", and a large bold "After Adjustment" total
  - **FLA card** -- white card with teal left accent (`border-l-4 border-primary`), Users icon, "Front Line Agents" subtitle, large "24" metric, "View FLA list" link
  - **FLQA card** -- white card with teal left accent, Users icon, "Front Line Qualifying Agents" subtitle, level progress text in primary color, two side-by-side metrics (Actual: 18, After Bonus: 30), footer links for "View FLQA list" and "Levels"

### Section 2: Current Payout Status

- **Header row**: "Current Payout Status" title with Info icon on left, "View Periodic Overview" link on right
- **Info banner**: Muted callout about Pay Now processing times
- **3-column grid** (`grid-cols-1 md:grid-cols-3`):
  - **Unpaid** -- amber left border (`border-l-4 border-amber-400`), Clock icon, amount "$1,869.20", "View details" link
  - **Expected Next** -- blue left border (`border-l-4 border-blue-500`), Calendar icon, amount "$1,869.20", "View details" link + "Get Paid Now" primary Button
  - **Last Paid** -- green left border (`border-l-4 border-green-500`), CheckCircle icon, amount "$986.92", "View details" link

### Section 3: RevShare Group Distribution

- **Header**: "RevShare Group Distribution" title with Info icon
- **2-column grid** (`grid-cols-1 lg:grid-cols-2`):
  - **By Level card**: Donut chart (center text "17,816 Agents"), Agents/RevShare tab toggle, legend with 7 levels showing color dot, level name, percentage, and agent count with chevron
  - **By Country card**: Donut chart (center text "17,816 Agents"), Agents/RevShare tab toggle, legend with 7 countries (US, UK, Canada, Germany, Australia, Brazil, France) with colored dots matching the screenshot palette

### Section 4: Revenue Share Comparison

- **Full-width card** with header: TrendingUp icon + "Revenue Share Comparison" title + Info icon, right side has "View Trends Report" link + Yearly/Quarterly/Monthly tab toggle + color legend
- **Combo chart**: recharts `ComposedChart` with `Bar` (dark navy fill) for Revenue + `Line` (green stroke) for Growth. X-axis: 2024, 2025, 2026. Y-axis: $0.0M-$4.0M. Data label "$285K" on last bar

---

## Layout Improvements

- Consistent `space-y-8` vertical spacing between all sections for breathing room
- Section headers use a flex row with `items-center justify-between` for title/action alignment
- All grids use `gap-6` for uniform card spacing
- Cards use consistent `p-6` internal padding
- Responsive breakpoints: single column on mobile, 2-col for distribution, 3-col for metrics/payouts
- Info banners use `bg-muted/50 rounded-lg p-4` with icon + text pattern

---

## Technical Details

### File: `src/pages/revshare/Dashboard.tsx` (full rewrite)

**New imports** (all available, no new dependencies):
- `Clock`, `Calendar`, `CheckCircle2`, `TrendingUp`, `Users`, `DollarSign`, `ExternalLink` from `lucide-react`
- `ComposedChart`, `Bar`, `Line`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `Legend` from `recharts`
- Existing: `Card`, `Tabs`, `Select`, `Button`, `Info`, `ChevronRight`, `PieChart`, `Pie`, `Cell`, `ResponsiveContainer`

**New mock data constants**:
- `levelDistribution` -- 7 entries with name, value (percentage), agents count, color (matching screenshot grayscale-to-navy gradient)
- `countryDistribution` -- 7 entries with country name, agents count, color (purple, blue, teal, orange, pink, yellow, indigo matching screenshot)
- `revenueComparisonData` -- 3 entries for 2024/2025/2026 with revenue and growth values

**Styling** follows existing design system:
- Uses CSS variables from `index.css` (primary = blue, exp-navy, etc.)
- All cards use shadcn `Card`/`CardContent`/`CardHeader` primitives
- Tabs use shadcn `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent`
- Donut charts reuse the existing `PieChart`/`Pie`/`Cell` + absolute center overlay pattern
- No new files or components needed -- everything in one page file

