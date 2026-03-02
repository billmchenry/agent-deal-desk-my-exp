

# Fix Accessibility: Replace All 10px Font Sizes with 12px Minimum

## Problem
The RevShare Dashboard uses `text-[10px]` (10pt) extensively, which fails WCAG accessibility guidelines. The project standard requires a minimum of 12px (`text-xs`) on all viewports.

## Solution
Replace every instance of `text-[10px]` with `text-xs` (12px) across the entire file. This affects ~20 occurrences in:

### File: `src/pages/revshare/Dashboard.tsx`

**Hero Banner (Section 1)**
- "After Adj." label
- Before Adj / Adjustment breakdown lines
- "Front Line Agents" subtitle
- "Actual" / "After Bonus" labels
- "Front Line Qualifying Agents" subtitle
- Level progress text

**Distribution Charts (Section 3)**
- Tab triggers (Agents/RevShare) -- also increase tab height from `h-5` to `h-6` for tap targets
- Donut chart center labels ("Agents")
- Level percentage labels
- Agent count labels

**Revenue Comparison (Section 4)**
- Tab triggers (Yearly/Quarterly/Monthly) -- same height increase
- Legend labels (Revenue/Growth)

All `text-[10px]` becomes `text-xs`. Tab trigger heights go from `h-5` to `h-6` and padding adjusts to maintain proportion. No layout or design changes beyond the font size bump.

