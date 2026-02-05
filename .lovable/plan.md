

# High-End Collapsible Sidebar Navigation

## Overview

Redesigning the sidebar navigation with a clean, modern hierarchy organized into three static sections. The key UX improvement is removing all chevrons and implementing "smart expansion" where only one submenu can be open at a time.

---

## Navigation Structure

```text
+----------------------------------+
|  MY | eXp (Logo)                 |
+----------------------------------+
|                                  |
|  MY DESK                         |  <-- Section Label (muted, uppercase)
|    Home                          |
|    Dashboard                     |
|    Documents                     |  <-- Expandable (no chevron)
|       All Documents              |  <-- Indented sub-item
|       Templates                  |
|    Events Calendar               |
|                                  |
|  BUSINESS & GROWTH               |
|    Team                          |
|    RevShare Earnings             |  <-- Expandable
|       Dashboard                  |
|       Organization               |
|       Organization Tree          |
|       My RevShare Trends         |
|    ICON Program                  |
|    Mentor Program                |
|                                  |
|  RESOURCES                       |
|    Tools                         |
|    Knowledge Base                |
|    Help Center                   |
|                                  |
+----------------------------------+
```

---

## Implementation Details

### File Changes

**1. Update `src/data/mockData.ts`**

Replace the flat `navItems` array with a new structured `sidebarNavigation` export organized by section:

```typescript
export const sidebarNavigation = {
  myDesk: {
    label: "MY DESK",
    items: [
      { title: "Home", icon: "Home", url: "/" },
      { title: "Dashboard", icon: "LayoutDashboard", url: "/agent/dashboard" },
      { 
        title: "Documents", 
        icon: "FileText", 
        submenu: [
          { title: "All Documents", url: "/documents/all" },
          { title: "Templates", url: "/documents/templates" }
        ]
      },
      { title: "Events Calendar", icon: "Calendar", url: "/events" }
    ]
  },
  businessGrowth: {
    label: "BUSINESS & GROWTH",
    items: [
      { title: "Team", icon: "Users", url: "/team/dashboard" },
      { 
        title: "RevShare Earnings", 
        icon: "DollarSign", 
        submenu: [
          { title: "Dashboard", url: "/revshare/dashboard" },
          { title: "Organization", url: "/revshare/organization" },
          { title: "Organization Tree", url: "/revshare/organization-tree" },
          { title: "My RevShare Trends", url: "/revshare/trends" }
        ]
      },
      { title: "ICON Program", icon: "Award", url: "/agent/icon-program" },
      { title: "Mentor Program", icon: "GraduationCap", url: "/mentor" }
    ]
  },
  resources: {
    label: "RESOURCES",
    items: [
      { title: "Tools", icon: "Wrench", url: "/tools" },
      { title: "Knowledge Base", icon: "BookOpen", url: "/knowledge" },
      { title: "Help Center", icon: "HelpCircle", url: "/help" }
    ]
  }
};
```

**2. Rewrite `src/components/layout/Sidebar.tsx`**

Key changes:
- Remove chevron icons entirely
- Change state from array to single string (`expandedItem` instead of `expandedItems[]`)
- Add section labels with muted styling
- Implement accordion-style behavior (only one submenu open at a time)
- Add smooth CSS transitions for expand/collapse using Radix Collapsible

```typescript
// State change: only one item can be expanded
const [expandedItem, setExpandedItem] = useState<string | null>(null);

// Toggle logic: clicking same item closes it, clicking different item opens it
const handleItemClick = (title: string, hasSubmenu: boolean, url?: string) => {
  if (hasSubmenu) {
    setExpandedItem(prev => prev === title ? null : title);
  }
  // If it has a URL and no submenu, navigate normally
};
```

---

## Visual Design Specifications

| Element | Style |
|---------|-------|
| Section Labels | `text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50` |
| Parent Items | `text-sm font-medium` with hover highlight |
| Sub-items | `text-sm text-sidebar-foreground/70` with left indent (`ml-9`) |
| Active State | `bg-sidebar-accent text-sidebar-foreground` |
| Spacing | `py-1.5` for items, `mt-6` between sections |

---

## Smart Expansion Behavior

1. **Click parent with submenu** - Submenu slides down, any other open submenu collapses
2. **Click same parent again** - Submenu collapses (toggle behavior)
3. **Click parent without submenu** - Navigates directly, collapses any open submenu
4. **Active route detection** - If user navigates to a sub-route, that section auto-expands on load

---

## Technical Considerations

### Auto-expand on Active Route

When the page loads, detect if the current URL matches any submenu item and auto-expand that parent:

```typescript
useEffect(() => {
  // Find which parent contains the active route
  const activeParent = findParentWithActiveChild(location.pathname);
  if (activeParent) {
    setExpandedItem(activeParent);
  }
}, [location.pathname]);
```

### Smooth Animations

Use Radix Collapsible with CSS transitions:
- `data-[state=open]:animate-accordion-down`
- `data-[state=closed]:animate-accordion-up`

---

## Summary of Changes

| File | Action |
|------|--------|
| `src/data/mockData.ts` | Add new `sidebarNavigation` structure |
| `src/components/layout/Sidebar.tsx` | Complete rewrite with new hierarchy, no chevrons, smart expansion |

