

## Problem

Tabs overflow on mobile across multiple areas:
- **Top Agents** (Team Dashboard): 3 underline tabs ("Units Closed", "Highest Volume", "Commission") get clipped
- **Profile bottom card**: 8 pill tabs wrap into 3+ lines, creating a cluttered mess
- **Profile upper card**: 5 pill tabs also wrap

## Solution: Horizontally scrollable tab strips on mobile

The cleanest mobile pattern is a **horizontally scrollable `TabsList`** with hidden scrollbar. This avoids wrapping, dropdowns, or double-navigation patterns (which the user dislikes).

### Implementation

1. **Update `TabsList` in `src/components/ui/tabs.tsx`** to include `overflow-x-auto scrollbar-hide` by default and add a `scrollbar-hide` utility class. This makes all `TabsList` instances scrollable when they overflow, with no visible scrollbar.

2. **Add `scrollbar-hide` CSS utility** to `src/index.css`:
   ```css
   .scrollbar-hide::-webkit-scrollbar { display: none; }
   .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
   ```

3. **Fix `flex-wrap` overrides** across affected files. Several `TabsList` usages add `flex-wrap` which forces wrapping instead of scrolling. Remove `flex-wrap` from:
   - `src/pages/profile/PersonalDetails.tsx` — both the upper pill tabs (5 items) and lower pill tabs (8 items)

4. **Ensure `TabsTrigger` items don't shrink** by adding `shrink-0` to the base trigger class in `tabs.tsx`.

### Files to modify
- `src/index.css` — add scrollbar-hide utility
- `src/components/ui/tabs.tsx` — add `overflow-x-auto scrollbar-hide` to TabsList, add `shrink-0` to TabsTrigger
- `src/pages/profile/PersonalDetails.tsx` — remove `flex-wrap` from both TabsList instances

This is a lightweight, app-wide fix. Any future tabs will automatically scroll on mobile without wrapping or clipping.

