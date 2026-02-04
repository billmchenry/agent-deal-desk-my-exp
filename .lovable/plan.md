
# Simplify Dashboard Toolbar

## Problem
The current toolbar in edit mode shows too many elements:
- Done button
- Reset to Default button
- Create Widgets dropdown
- "Synced 6 min ago" text
- "Drag widgets to reorder • Hover to delete" text

This creates visual overload and takes up too much horizontal space.

## Solution

### Simplified Layout

**Normal Mode:**
```
[Customize]  [✨ Create Widgets ▼]  ↻ 2 min ago
```

**Edit Mode:**
```
[✓ Done]  [↺]  [✨ Create Widgets ▼]
          └── Reset icon only (tooltip: "Reset to Default")
```

### Key Changes

| Current | Proposed |
|---------|----------|
| Full "Reset to Default" button | Icon-only button with tooltip |
| "Synced X ago" always visible | Hidden during edit mode |
| Helper text inline in toolbar | Moved below toolbar or removed |

### Technical Changes

**File: `src/components/dashboard/DashboardToolbar.tsx`**

1. **Reset button becomes icon-only** - Use just the `RotateCcw` icon with a Tooltip wrapper
2. **Hide sync timestamp in edit mode** - Only show when not editing
3. **Remove inline helper text** - Move hint to a subtle subtitle or remove entirely (the drag handles are intuitive enough)

### Visual Result

Normal mode - clean and minimal:
```
[Customize]  [✨ Create Widgets ▼]  ↻ 2m
```

Edit mode - focused on actions:
```
[✓ Done]  [↺]  [✨ Create Widgets ▼]
```

The helper text "Drag widgets to reorder • Hover to delete" will be removed from the toolbar entirely - the UI affordances (drag handles, delete buttons on hover) are self-explanatory.

