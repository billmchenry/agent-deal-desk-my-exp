

## Replace Tooltips with Inline Subtitles (Non-Redundant Only)

### Strategy
Remove the 3 decorative `Info` icons and convert tooltip explanations into small inline subtitle text (`text-xs text-muted-foreground`) — but only where the explanation isn't already covered by existing text.

### Redundancy Analysis

| Section | Tooltip Text | Already Shown Inline? | Action |
|---------|-------------|----------------------|--------|
| Revenue Share tile | "Total revenue share earnings before and after adjustments" | Yes — "After Adj.", "Before Adj.", "Adjustment" already visible | **Skip** — redundant |
| FLA tile | "Front Line Agents count before and after concession adjustments" | Partially — label says "FLA - Front Line Agents" but "concession adjustments" is missing | **Add subtitle**: "Count before and after concession adjustments" |
| FLQA tile | "Front Line Qualifying Agents count before and after concession adjustments" | Partially — shows "Actual" / "After Bonus" but doesn't mention concessions | **Add subtitle**: "Count before and after concession adjustments" |
| Current Payout Status | "Overview of your revenue share payout status and history" | No | **Add subtitle**, remove Info icon |
| Unpaid card | "Total amount earned but not yet paid out" | Yes — "Calculated but not paid out" | **Skip** — redundant |
| Expected Next card | "Estimated amount for the next scheduled payout" | Partially — says "Due in February" | **Update subtitle** to "Estimated next scheduled payout" |
| Last Paid card | "Amount paid in the most recent payout" | Partially — says "Paid to you" | **Update subtitle** to "Most recent payout amount" |
| RevShare Group Distribution | "Distribution of agents across revenue share levels (1-7) and regions" | No | **Add subtitle**, remove Info icon |
| Revenue Share Comparison | "Compare revenue share across different time periods" | No | **Add subtitle**, remove Info icon |

### Changes in `src/pages/revshare/Dashboard.tsx`

**Hero Banner tiles:**
1. **FLA tile** (after label, ~line 132): Add `text-xs text-white/50` subtitle: "Count before and after concession adjustments"
2. **FLQA tile** (after label, ~line 144): Add same subtitle

**Current Payout Status section:**
3. **Section header** (line 170-172): Remove the `Info` icon. Add a `text-xs text-muted-foreground` line below the title: "Overview of your revenue share payout status and history"
4. **Expected Next subtitle** (line 205): Change "Due in February" to "Estimated next scheduled payout"
5. **Last Paid subtitle** (line 221): Change "Paid to you" to "Most recent payout amount"
6. **Unpaid subtitle**: Keep as-is ("Calculated but not paid out") — already covers the tooltip

**RevShare Group Distribution:**
7. **Section header** (line 234-236): Remove `Info` icon. Add subtitle: "Agent distribution across levels (1-7) and regions"

**Revenue Share Comparison:**
8. **Section header** (~line 357): Remove `Info` icon. Add subtitle: "Compare revenue share earnings across different time periods"

**Cleanup:**
- Keep `Info` import — still used by the info banner (line 179)

### Result
All tooltip context is preserved as always-visible inline text, but nothing redundant is added. No popovers, no hover tooltips, no extra icons — just clean, scannable subtitles.

