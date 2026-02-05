

# Mobile Navigation Drawer with Slide-to-View Hierarchy

## Overview

Transforming the mobile sidebar from a left-sliding panel into a modern bottom drawer with a slide-to-view hierarchy pattern. Tapping a section header reveals only that section's links, with a "Back" button to return to the main menu.

---

## Visual Design

### Main Menu View
```text
+----------------------------------------+
|  [X]              MY | eXp             |
+----------------------------------------+
|                                        |
|  +----------------------------------+  |
|  | [Home Icon]        Home         >|  | <- 44px min-height
|  +----------------------------------+  |
|  | [Dashboard]   Agent Performance >|  |
|  +----------------------------------+  |
|  | [Docs Icon]      Documents      >|  | <- Has submenu
|  +----------------------------------+  |
|  | [Calendar]    Events Calendar   >|  |
|  +----------------------------------+  |
|                                        |
|  BUSINESS & GROWTH                     |
|  +----------------------------------+  |
|  | [Users]            Team         >|  |
|  +----------------------------------+  |
|  | [$]        RevShare Earnings    >|  | <- Has submenu
|  +----------------------------------+  |
|  | [Award]       ICON Program      >|  |
|  +----------------------------------+  |
|  ...                                   |
+----------------------------------------+
```

### Section Detail View (after tapping "Documents")
```text
+----------------------------------------+
|  [< Back]         Documents            |
+----------------------------------------+
|                                        |
|  +----------------------------------+  |
|  |           All Documents          |  | <- 44px min-height
|  +----------------------------------+  |
|  |             Templates            |  |
|  +----------------------------------+  |
|                                        |
+----------------------------------------+
```

---

## Technical Approach

### Component Architecture

**New Components:**
1. `MobileNavDrawer.tsx` - The main drawer component using vaul's Drawer
2. `MobileNavContent.tsx` - Shared content with slide-to-view logic

### State Management

```tsx
// State for slide-to-view hierarchy
const [activeSection, setActiveSection] = useState<{
  key: string;
  label: string;
  items: SidebarNavItem[];
} | null>(null);
```

### Slide Animation Pattern

Using the same translateX pattern already established in ChatPanel.tsx:

```tsx
<div 
  className="flex w-[200%] h-full transition-transform duration-300 ease-out"
  style={{ transform: activeSection ? 'translateX(-50%)' : 'translateX(0)' }}
>
  {/* Main Categories View */}
  <div className="w-1/2">...</div>
  
  {/* Section Detail View */}
  <div className="w-1/2">...</div>
</div>
```

---

## Implementation Details

### File Changes

| File | Action |
|------|--------|
| `src/components/layout/MobileNavDrawer.tsx` | Create - New drawer component |
| `src/components/layout/Sidebar.tsx` | Modify - Desktop only, remove mobile logic |
| `src/components/layout/DashboardLayout.tsx` | Modify - Use new drawer for mobile |
| `src/components/layout/Header.tsx` | No change - Already handles menu click |

---

### 1. MobileNavDrawer.tsx (New File)

**Key Features:**

- Uses vaul Drawer component (consistent with Mira chat)
- Dark navy background (`bg-exp-navy`)
- White text and icons for high contrast
- 44px minimum touch targets for all interactive elements
- Slide-to-view animation between main menu and section details

**Structure:**

```tsx
// Props
interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Main categories view shows:
// - Section headers (MY DESK, BUSINESS & GROWTH, RESOURCES)
// - Each nav item with icon, title, and chevron
// - Items with submenus navigate to detail view
// - Items without submenus navigate directly and close drawer

// Section detail view shows:
// - Back button + section title header
// - List of submenu links
// - Tapping a link navigates and closes drawer
```

**Touch Target Styling:**

```tsx
// All interactive elements use min-h-[44px]
<button className="min-h-[44px] flex items-center gap-4 px-4 py-3 w-full">
  {/* content */}
</button>
```

**Color Scheme (Dark Navy Theme):**

```tsx
// Background: dark navy
className="bg-exp-navy"

// Text: white for primary, white/70 for secondary
className="text-white"
className="text-white/70"

// Icons: white
className="text-white h-5 w-5"

// Active/hover states: lighter navy
className="hover:bg-exp-navy-light"
className="bg-sidebar-accent" // for active items
```

---

### 2. Sidebar.tsx Modifications

**Remove mobile-specific rendering:**
- Remove mobile overlay div
- Remove mobile translate animation
- Add `hidden lg:block` to make it desktop-only

**Simplified structure:**

```tsx
export function Sidebar() {
  // Remove isOpen/onClose props for desktop
  // Sidebar is always visible on desktop
  return (
    <aside className="hidden lg:block fixed left-0 top-0 z-50 h-screen w-64 bg-sidebar">
      {/* Existing sidebar content */}
    </aside>
  );
}
```

---

### 3. DashboardLayout.tsx Modifications

**Add MobileNavDrawer integration:**

```tsx
import { MobileNavDrawer } from "./MobileNavDrawer";

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <Header onMenuClick={() => setMobileMenuOpen(true)} />
      
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile Drawer */}
      <MobileNavDrawer 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
      
      <main>...</main>
    </div>
  );
}
```

---

## Interaction Flow

```text
User taps hamburger menu
        |
        v
+------------------+
| Main Menu Opens  |  <- Bottom drawer slides up
| (All sections)   |
+------------------+
        |
        | User taps "Documents" (has submenu)
        v
+------------------+
| Slides to        |  <- Content slides left
| Documents view   |
| [< Back]         |
| - All Documents  |
| - Templates      |
+------------------+
        |
        | User taps "All Documents"
        v
+------------------+
| Drawer closes    |  <- Navigates to /documents/all
| Page navigates   |
+------------------+

OR

        | User taps "< Back"
        v
+------------------+
| Slides back to   |  <- Content slides right
| Main Menu        |
+------------------+
```

---

## Accessibility Considerations

1. **Touch Targets**: All buttons/links have `min-h-[44px]` (Apple HIG standard)
2. **Color Contrast**: White text on dark navy meets WCAG AA standards
3. **Focus Management**: Focus trapped within drawer when open
4. **Escape Key**: Closes drawer (handled by vaul)
5. **Overlay Click**: Closes drawer (handled by vaul)

---

## Summary

This implementation:
- Replaces the "antiquated" left-slide menu with a modern bottom drawer
- Uses the slide-to-view hierarchy pattern for intuitive sub-navigation
- Maintains the existing dark navy theme with high-contrast white icons
- Ensures 44px+ touch targets for accessibility
- Reuses the vaul Drawer component pattern already in the codebase

