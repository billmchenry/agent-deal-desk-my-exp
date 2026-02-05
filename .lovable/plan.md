

# Hover-Reveal Chevron Indicators for Sidebar

## Overview

Adding subtle chevron indicators that only appear when hovering over expandable menu items (Documents, RevShare Earnings). This provides the best of both worlds: a clean default state with discoverability on interaction.

---

## Visual Behavior

```text
Default State:                    On Hover:
+------------------------+        +------------------------+
|  📄 Documents          |   -->  |  📄 Documents        ▶ |
+------------------------+        +------------------------+

Expanded State (with hover):
+------------------------+
|  📄 Documents        ▼ |  <-- Chevron rotates down
|     All Documents      |
|     Templates          |
+------------------------+
```

---

## Implementation Details

### File: `src/components/layout/Sidebar.tsx`

**Changes:**

1. **Add ChevronRight icon import** from lucide-react

2. **Add hover state tracking** using CSS group utilities (no JS state needed)

3. **Render chevron conditionally** for items with submenus:
   - Hidden by default (`opacity-0`)
   - Visible on hover (`group-hover:opacity-100`)
   - Rotates 90° when expanded (`rotate-90`)
   - Smooth transition (`transition-all duration-200`)

**Code approach:**

```tsx
// For items with submenus, add the chevron
<button className="group flex w-full items-center ...">
  {Icon && <Icon className="h-4 w-4" />}
  <span>{item.title}</span>
  
  {item.submenu && (
    <ChevronRight 
      className={cn(
        "ml-auto h-4 w-4 opacity-0 transition-all duration-200",
        "group-hover:opacity-100",
        isExpanded && "rotate-90 opacity-100"
      )}
    />
  )}
</button>
```

---

## Behavior Summary

| State | Chevron Visibility | Chevron Rotation |
|-------|-------------------|------------------|
| Default (collapsed) | Hidden | 0° (pointing right) |
| Hover (collapsed) | Visible | 0° (pointing right) |
| Expanded | Always visible | 90° (pointing down) |
| Hover (expanded) | Always visible | 90° (pointing down) |

---

## CSS Utilities Used

- `group` - Parent element for group-hover
- `group-hover:opacity-100` - Show on parent hover
- `opacity-0` - Hidden by default
- `rotate-90` - Rotated state for expanded
- `transition-all duration-200` - Smooth animation

---

## File Changes

| File | Action |
|------|--------|
| `src/components/layout/Sidebar.tsx` | Add ChevronRight with hover-reveal behavior |

