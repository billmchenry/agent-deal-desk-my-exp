

# Restyle RevShare Dashboard to Match Agent Dashboard Design

## Problem
The RevShare Dashboard uses a completely different visual language from the Agent Dashboard. It has oversized headings, loose spacing, generic Tailwind colors, and large padded cards -- none of which match the compact, branded style seen in the Agent section screenshot.

## Design System to Follow (from Agent Dashboard)

The Agent Dashboard pattern is:
- **Page title**: H1 via `AgentFilterBar` (text-xl font-bold), compact top bar
- **Hero banner**: Gradient card (`bg-gradient-to-br from-exp-navy via-exp-navy-light to-exp-blue`) with decorative circles, Badge labels, and `MiniStatCard` glass-morphism tiles (`bg-white/10 backdrop-blur-sm`)
- **Section cards**: `Card` with `border shadow-sm`, compact `CardHeader` with `text-sm font-semibold` titles, `px-4 sm:px-6` padding
- **Spacing**: `space-y-4` between sections, `gap-2 sm:gap-3` within grids
- **Colors**: eXp brand variables (`exp-navy`, `exp-blue`, `exp-green`, `exp-gold`) instead of generic Tailwind colors
- **Typography**: Small, dense -- `text-sm`, `text-xs`, nothing larger than `text-xl` inside cards

## What Changes

### File: `src/pages/revshare/Dashboard.tsx` (full restyle)

### Section 1: Revenue Share & Agent Metrics
**Before**: Large `text-2xl` heading, `bg-primary` card, `border-l-4 border-l-primary` accent cards with `p-6`
**After**: 
- Replace with a gradient hero banner matching Agent style (`bg-gradient-to-br from-exp-navy via-exp-navy-light to-exp-blue`) with decorative circles
- Revenue Share, FLA, and FLQA become glass-morphism `MiniStatCard`-style tiles inside the banner (`bg-white/10 backdrop-blur-sm`)
- Badge label: "REVENUE SHARE" with gold styling (matching "PERFORMANCE" badge pattern)
- Period filter moves into the page header row (same pattern as `AgentFilterBar`)

### Section 2: Current Payout Status
**Before**: Oversized cards with `border-l-4` using `amber-400`, `blue-500`, `green-500`, large `text-3xl` amounts
**After**:
- Wrap in a single `Card` with `border shadow-sm` (matching `CappingSection` pattern)
- Section title uses `text-sm font-semibold` inside `CardContent`
- Three payout items as a compact grid with `text-lg` amounts instead of `text-3xl`
- Use eXp brand colors: `exp-gold` for unpaid, `exp-blue` for expected, `exp-green` for paid
- Info banner stays but uses smaller text and tighter padding
- "Get Paid Now" uses a small `Button size="sm"`

### Section 3: RevShare Group Distribution
**Before**: Large section heading, oversized donut charts in separate cards
**After**:
- Single `Card` wrapper with `border shadow-sm` (matching `YearOverYearChart` card style)
- `CardHeader` with `text-sm font-semibold` title and Agents/RevShare tab toggle (matching the Units/Volume/Commission tab pattern)
- Two donut charts side by side inside `CardContent`
- Donut chart colors use eXp brand variables where possible
- Legend text stays `text-xs`/`text-sm` -- already compact

### Section 4: Revenue Share Comparison
**Before**: Separate card with large header, TrendingUp icon, external links
**After**:
- Same `Card` with `border shadow-sm` wrapper pattern as `YearOverYearChart`
- `CardHeader` with `text-sm font-semibold` title and tab toggle (Yearly/Quarterly/Monthly matching the Units/Volume/Commission pattern)
- Bar colors use `hsl(var(--exp-blue))` and `hsl(var(--exp-navy-light))` instead of generic fills
- Line color uses `hsl(var(--exp-green))`

### Page-Level Changes
- Page title: `text-xl font-bold` (not `text-2xl`) with period filter on the right (same layout as `AgentFilterBar`)
- Outer spacing: `space-y-4` (not `space-y-8`)
- Remove `p-4 lg:p-6` wrapper (DashboardLayout already handles padding)
- Add `pb-20` to match Agent Dashboard bottom padding

## Technical Details

- All colors switch from generic Tailwind (`amber-400`, `blue-500`, `green-500`, `bg-primary`) to eXp brand CSS variables (`exp-navy`, `exp-blue`, `exp-green`, `exp-gold`)
- Card padding reduces from `p-6` to `p-4` throughout
- Section headings reduce from `text-lg font-semibold` to `text-sm font-semibold`
- Amount typography reduces from `text-3xl`/`text-4xl` to `text-lg`/`text-xl`
- Grid gaps reduce from `gap-6` to `gap-2 sm:gap-3`
- No new files or dependencies needed
- Single file change: `src/pages/revshare/Dashboard.tsx`
