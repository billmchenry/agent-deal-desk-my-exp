

## Move Chevron Arrows to After RevShare Amount Column

Currently the `ChevronRight` arrows sit inside the first column (level/country name). Move them to the last column (RevShare amount) instead, so the arrow appears at the far right after the dollar amount.

### Changes in `src/pages/revshare/Dashboard.tsx`

**For both Level and Country tables (4 spots each = 8 total edits):**

1. **Data rows — Level table (lines 589-594)**: Remove `<ChevronRight>` from the level name `<td>`, add it to the revShare `<td>` (line 597).

2. **Footer row — Level table (lines 610-614)**: Remove `<ChevronRight>` from Total `<td>`, add it to the revShare total `<td>` (line 617).

3. **Data rows — Country table (lines 653-658)**: Remove `<ChevronRight>` from country name `<td>`, add it to the revShare `<td>` (line 661).

4. **Footer row — Country table (lines 674-678)**: Remove `<ChevronRight>` from Total `<td>`, add it to the revShare total `<td>` (line 681).

**Pattern for each change:**

First column becomes simple (no arrow):
```tsx
<div className="flex items-center gap-2">
  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
  {row.level}
</div>
```

Last column gets the arrow appended:
```tsx
<td className="py-2 pl-2 text-right font-secondary text-foreground whitespace-nowrap">
  <span className="inline-flex items-center gap-1">
    {formatCurrency(row.revShare)} <span className="text-muted-foreground text-xs">USD</span>
    <ChevronRight className="h-3 w-3 text-muted-foreground" />
  </span>
</td>
```

Same pattern for Total/footer rows.

