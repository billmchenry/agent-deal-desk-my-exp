
# Dashboard Header and Widget Behavior Refinements

## Overview
This plan covers four enhancements to improve the dashboard user experience:
1. Add a "Last Synced" timestamp that updates automatically
2. Show a "Reset to Default" button when in Customize mode
3. Persist widget positions across page refreshes using localStorage
4. Add skeleton loaders for GCI and Volume stats during data updates

---

## 1. Last Synced Timestamp

Add a subtle timestamp next to the toolbar buttons showing when data was last synced.

**Location:** After the "Create Widgets" button in the toolbar

**Behavior:**
- Displays relative time (e.g., "Synced 2 min ago")
- Updates every 30 seconds automatically
- Clicking it triggers a manual data refresh
- Shows a brief loading spinner during refresh

**Visual Design:**
```
[Customize] [Create Widgets ▼] • Synced 2 min ago [Templates ▼]
```

---

## 2. Reset to Default Button in Edit Mode

When "Customize" is active (edit mode), display a "Reset to Default" button inline for quick access.

**Current behavior:** Reset is buried in Templates dropdown
**New behavior:** When `isEditMode === true`, show the reset button directly in the toolbar

**Visual:**
```
Edit mode OFF:  [Customize] [Create Widgets ▼] ...
Edit mode ON:   [Done ✓] [Reset to Default ↺] [Create Widgets ▼] ...
```

---

## 3. Persist Widget Layout with localStorage

Save widget positions to localStorage so they survive page refreshes.

**Implementation:**
- Create a custom `useLocalStorage` hook
- Store `widgets` array under key `dashboard-widgets`
- Store `templates` under key `dashboard-templates`
- Load from localStorage on initial mount
- Save to localStorage whenever widgets or templates change

**Data Structure:**
```typescript
// localStorage key: "dashboard-widgets"
{
  widgets: DashboardWidget[],
  lastUpdated: string // ISO timestamp
}

// localStorage key: "dashboard-templates"
{
  templates: DashboardTemplate[],
  activeTemplateId: string | null
}
```

---

## 4. Skeleton Loaders for Stats

Add loading states to GCI and Volume stat cards so they don't shift layout during updates.

**Changes to StatsRow.tsx:**
- Accept optional `isLoading` prop
- When loading, show Skeleton components for the value text
- Keep icon and label visible (only value becomes skeleton)
- Fixed height on value container to prevent layout shift

**Visual:**
```
Normal:   [💰]  $2.67K        Loading:  [💰]  ░░░░░░░
          Gross Commission             Gross Commission
```

---

## Technical Implementation

### Files to Create

| File | Purpose |
|------|---------|
| `src/hooks/use-local-storage.ts` | Custom hook for localStorage with React state sync |

### Files to Modify

| File | Changes |
|------|---------|
| `src/contexts/DashboardContext.tsx` | Add `lastSynced`, `isRefreshing`, `refreshData` state; integrate localStorage persistence |
| `src/components/dashboard/DashboardToolbar.tsx` | Add Last Synced display, Reset button in edit mode, refresh trigger |
| `src/components/dashboard/StatsRow.tsx` | Add `isLoading` prop and Skeleton loader for GCI/Volume values |

---

## Context Changes (DashboardContext.tsx)

New state and functions:
```typescript
interface DashboardContextType {
  // ... existing
  
  // Data refresh
  lastSynced: Date;
  isRefreshing: boolean;
  refreshData: () => Promise<void>;
}
```

**localStorage initialization:**
- On mount, check localStorage for saved widgets
- If found, use saved widgets instead of DEFAULT_LAYOUT
- On any widget change, save to localStorage

---

## Toolbar Layout (DashboardToolbar.tsx)

**Edit Mode OFF:**
```
[Customize] [Create Widgets ▼] • Synced 2 min ago [Templates ▼]
```

**Edit Mode ON:**
```
[Done ✓] [Reset to Default ↺] [Create Widgets ▼] [Templates ▼]
```

The Last Synced timestamp is:
- Styled as muted text with a small clock or refresh icon
- Clickable to trigger manual refresh
- Hidden on very small mobile screens (shows only icon)

---

## StatsRow Loading State

Add loading prop that triggers skeleton display:

```tsx
function StatCard({ icon, value, label, color, isLoading }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className={`rounded-lg p-2.5 ${colors.bg}`}>
            <div className={colors.icon}>{icon}</div>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <span className="text-2xl font-bold">{value}</span>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
```

---

## Summary

| Feature | Implementation |
|---------|----------------|
| Last Synced | New timestamp display in toolbar, auto-updates every 30s |
| Reset Button | Conditionally shown when `isEditMode` is true |
| Persistence | localStorage hook syncs widgets and templates |
| Skeleton Loaders | Loading state prop on StatsRow with fixed-height skeletons |

This approach keeps all changes contained to a few files while adding meaningful UX improvements without disrupting the existing widget architecture.
