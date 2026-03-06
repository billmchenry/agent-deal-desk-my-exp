

## Problem

Font sizes across the app are applied ad-hoc using random Tailwind text size classes (`text-3xl`, `text-2xl`, `text-lg`, `text-sm`, `text-xs`) with no consistent system. The same semantic element (e.g., a page heading) might use `text-2xl` on one page and `text-lg` on another. Stat values use `text-3xl` which is oversized on mobile.

The accessibility font-size feature (root `fontSize` change in `LocaleContext`) already works because Tailwind uses `rem`, but the underlying scale itself is inconsistent.

## Solution: Semantic Typography Utility Classes

Define a set of semantic CSS utility classes in `index.css` that map to specific Tailwind-equivalent sizes using `rem` (so they automatically scale with the accessibility root font-size setting). Then replace raw Tailwind text classes with these semantic classes across all pages.

### Typography Scale

```text
Token               rem     px@16  Use Case
─────────────────── ─────── ────── ──────────────────────────
.text-page-title    1.5rem  24px   Page headings (h1)
.text-section-title 1.125rem 18px  Card/section headings (h2/h3)
.text-stat-value    1.75rem 28px   Large stat numbers
.text-body          0.875rem 14px  Default body text
.text-body-lg       1rem    16px   Emphasized body text
.text-caption       0.75rem 12px   Labels, meta, secondary info
```

All values in `rem` — when the accessibility font-size bumps root from 16px to 18px or 20px, every semantic class scales proportionally.

### Files to Change

1. **`src/index.css`** — Add the semantic typography utility classes under `@layer utilities`

2. **`src/pages/team/Dashboard.tsx`** — Replace raw text sizes:
   - `text-2xl` on h1 → `text-page-title`
   - `text-3xl` on stat values → `text-stat-value`
   - `text-base` on card titles → `text-section-title`
   - `text-lg` on subtitle → `text-body-lg`

3. **All other pages** (agent/Dashboard, IconProgram, CustomServiceFees, Transactions, revshare/*, profile/*, documents/*, mentor/*, etc.) — Same pattern: replace raw Tailwind text classes with the semantic equivalents.

4. **Shared components** (`AgentHeroBanner`, `CappingSection`, `StatsRow`, `DataTable`, etc.) — Align to the same scale.

### Why This Works with Accessibility

- All sizes use `rem` → they inherit from `html { font-size }` set by `LocaleContext`
- When user selects "Large" (18px root), `text-stat-value` becomes `1.75 × 18 = 31.5px` instead of `1.75 × 16 = 28px`
- Minimum size (`text-caption` = 0.75rem) at normal = 12px, which meets the 12px minimum; at "Large" = 13.5px, at "X-Large" = 15px

### Scope

This touches ~25-30 files but is a mechanical find-and-replace per the mapping above. No logic changes, no new dependencies.

