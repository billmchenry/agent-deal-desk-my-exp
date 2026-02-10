

# Refine ICON Program Page to Match Home & Agent Dashboard

## What's Different Today

The Home and Agent dashboards feel more polished because they use:
- A **branded gradient hero banner** (navy-to-blue with decorative circles and frosted-glass elements)
- **Colored icon badges** on stat/metric cards (blue, green, gold tints)
- Consistent **section header style** (`text-sm font-semibold` with compact spacing)
- Cards with subtle **visual hierarchy** (icon + bold value + muted label pattern)

The ICON Program page currently uses plain white cards with text-only headers and no visual anchoring element at the top. It feels flat by comparison.

## Changes

### 1. Add a branded ICON Hero Banner
Replace the plain "ICON Program" heading + year selector with a gradient hero banner matching the Agent Dashboard style.

- Uses the same `bg-gradient-to-br from-exp-navy via-exp-navy-light to-exp-blue` treatment
- Contains the page title, year selector (styled for dark background), and a summary line like "3 of 4 pillars complete"
- Includes the decorative background circles for visual consistency

### 2. Add colored icons to Production metric cards
The top-row cards (Company Commission, Capped Transaction Fees) and Qualify Option 2 metrics currently have no icons. Add small colored icon badges to match the StatsRow pattern:

- Company Commission: DollarSign icon with blue tint
- Capped Transaction Fees: FileText icon with gold tint
- GCI: TrendingUp icon with green tint
- Closed Transactions: Home icon with purple tint
- ICON Qualifying Fee: Award icon with destructive/red tint

### 3. Polish the Stock Grants cards
Add subtle gradient backgrounds or colored top-border accents to the grant cards to make them feel more premium, similar to how the Home dashboard stat cards use colored icon containers.

### 4. Consistent card internal spacing
Standardize all cards to use the same `CardContent className="p-4"` pattern with `space-y-3` internal spacing, matching the Agent Dashboard's CappingSection.

## Technical Details

### File: `src/pages/agent/IconProgram.tsx`

**Hero Banner** (replaces lines 18-33):
- Wrap header in a Card with `bg-gradient-to-br from-exp-navy via-exp-navy-light to-exp-blue` and decorative circles
- Move year Select inside the banner, styled with white/transparent colors
- Add a summary Badge and subtitle text

**Metric card icons** (lines 46-86 and 95-143):
- Import additional icons: `DollarSign`, `FileText`, `TrendingUp`, `Home`
- Add a small `rounded-lg p-2 bg-{color}/10` icon container before each metric title
- Use the same color palette as `AgentHeroBanner` and `StatsRow`

**Stock Grants polish** (lines 245-266):
- Add a subtle top-border accent using `border-t-2 border-[hsl(var(--exp-green))]` to each awarded grant card

### File: `src/components/agent/IconStatusBanner.tsx`

- No changes needed -- the banner cards already use a consistent card pattern with icons and progress indicators

## Summary of Visual Improvements

| Element | Before | After |
|---------|--------|-------|
| Page header | Plain text + dropdown | Gradient hero banner with summary |
| Metric cards | Text-only headers | Colored icon badges + headers |
| Stock grant cards | Plain centered cards | Top-border accent for awarded status |
| Overall feel | Flat, form-like | Matches dashboard polish level |
