

## Separate Stock Grants from the 3 Pillars

### What Changes
Visually distinguish the 3 ICON pillars (Production, Cultural, Events) from Stock Grants, which is an outcome/reward — not a pillar. This resolves the confusion where the hero says "1 of 3 pillars complete" but 4 equal tiles are shown.

### Layout

**Desktop (lg+)**
```text
[Production]    [Cultural]     [Events]
[Award icon]  Stock Grants: $16,000 earned  [>]
```

**Mobile (390px)**
```text
[Production]  [Cultural]
[Events    ]
[Award  Stock Grants: $16K earned  >]
```

### File: `src/components/agent/IconStatusBanner.tsx`

1. Split the `pillars` array — filter out `stockgrants` from the main grid loop
2. Change grid from `grid-cols-2 lg:grid-cols-4` to `grid-cols-2 lg:grid-cols-3`
3. Add a new full-width Stock Grants banner below the pillar grid:
   - Styled as a subtle card with left Award icon, summary text ("Stock Grants: 4/4 awarded"), and a chevron-right indicator
   - Uses the same `tap-card` class for touch suppression
   - Triggers `onTabChange('stockgrants')` on tap
   - Active state: ring + border highlight matching the pillar cards
   - Completed state: green check icon + "All awarded" text
4. Import `ChevronRight` from lucide-react

### No other files change
The tab system in `IconProgram.tsx` remains untouched — tapping the Stock Grants banner still switches to the `stockgrants` tab content as before.
