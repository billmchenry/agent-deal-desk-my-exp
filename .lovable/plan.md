

## Mobile Responsiveness + Touch-Friendly CTAs for RevShare Dashboard

### Summary
Make all interactive elements meet the 44px minimum touch target on mobile, improve layout stacking for 390px viewports, and ensure charts scale properly.

### All Changes in `src/pages/revshare/Dashboard.tsx`

**1. Page Header — Select trigger touch target**
- Line 79: Change `h-8` to `h-8 sm:h-8 min-h-[44px] sm:min-h-0` so the period selector is tappable on mobile.

**2. Hero Banner CTA buttons (View FLA List, View FLQA List)**
- Lines 137 and 163: These `button` elements currently use `px-2.5 py-1` which renders well under 44px tall. Update to `px-3 py-2.5 min-h-[44px] sm:min-h-0 sm:py-1` so they expand to thumb-friendly size on mobile while staying compact on desktop.

**3. Current Payout Status header — stack on mobile**
- Line 174: Change from `flex items-center justify-between` to `flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1` so the "View Periodic Overview" link wraps below the title on small screens.
- Line 179 ("View Periodic Overview" link): Add `min-h-[44px] sm:min-h-0 flex items-center` for touch target.

**4. Payout card CTAs (View details x3, Get Paid Now)**
- Lines 200, 214, 229 ("View details" buttons): Change `px-2.5 py-1` to `px-3 py-2.5 min-h-[44px] sm:min-h-0 sm:py-1` for mobile touch targets.
- Line 217 ("Get Paid Now" Button): Change `h-7` to `h-11 sm:h-7` for 44px on mobile.
- Line 213: On mobile the two buttons should stack. Change `flex items-center justify-between` to `flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-2`.

**5. Distribution section — mobile separator + smaller donuts**
- Line 258 and 312 (donut containers): Change `w-32 h-32` to `w-24 h-24 sm:w-32 sm:h-32` so charts don't eat too much horizontal space on 390px.
- Line 301 ("By Country" wrapper): Add `border-t pt-4 lg:border-t-0 lg:pt-0` for a visible mobile separator between the two chart sections.
- Lines 251-253 and 304-308 (Tab triggers for Agents/RevShare): Change `h-6` triggers to `h-8 sm:h-6 min-h-[44px] sm:min-h-0` for touch targets, and TabsList from `h-7` to `h-9 sm:h-7`.
- Lines 284 and 338 (legend rows): Change `py-0.5` to `py-2 sm:py-0.5` to increase row tap targets on mobile.

**6. Revenue Share Comparison — controls and chart height**
- Lines 371-377 (Yearly/Quarterly/Monthly tabs): Same tab trigger treatment as above — `h-8 sm:h-6 min-h-[44px] sm:min-h-0`.
- Line 368 ("View Trends" link): Add `min-h-[44px] sm:min-h-0 flex items-center`.
- Line 390: Wrap `ResponsiveContainer` in a `div` with `h-[200px] sm:h-[240px]` and set height to `"100%"` for a shorter chart on mobile.

### Touch Target Summary

| Element | Current Height | Mobile Target |
|---------|---------------|---------------|
| Period Select | 32px | 44px |
| View FLA/FLQA List | ~28px | 44px |
| View Periodic Overview | ~20px | 44px |
| View details (x3) | ~28px | 44px |
| Get Paid Now | 28px | 44px |
| Tab triggers (x8) | 24px | 44px |
| Distribution legend rows | ~24px | 40px+ |
| View Trends link | ~20px | 44px |

### What stays the same
- Overall page structure and section order
- Color scheme, typography, and card layouts
- All mock data unchanged
- Desktop appearance virtually identical (changes only kick in below `sm` breakpoint)

