

# Bottom Tab Bar Navigation with "More" Menu

## Overview

Replacing the bottom drawer navigation with a **fixed bottom tab bar** that provides instant 1-tap access to key destinations. A "More" tab opens a compact bottom sheet for remaining navigation items.

---

## Visual Design

### Bottom Tab Bar (Always Visible)
```text
+--------------------------------------------+
|                                            |
|              PAGE CONTENT                  |
|                                            |
+--------------------------------------------+
| [🏠]     [📊]     [👥]     [$]      [≡]   |
| Home   Perform   Team  RevShare   More    |
+--------------------------------------------+
  ↑ Fixed at bottom, always visible on mobile
```

### "More" Bottom Sheet (When Tapped)
```text
+--------------------------------------------+
|                                            |
|  +--------------------------------------+  |
|  |           ≡  More Options            |  |
|  +--------------------------------------+  |
|  | [📄] Documents                     > |  |
|  | [📅] Events Calendar                 |  |
|  | [🎓] Mentor Program                  |  |
|  | [🏆] ICON Program                    |  |
|  | [🔧] Tools                           |  |
|  | [📚] Knowledge Base                  |  |
|  | [❓] Help Center                     |  |
|  +--------------------------------------+  |
+--------------------------------------------+
```

---

## Primary Tabs Selection

Based on the sidebar navigation structure, here are the 5 tabs:

| Position | Icon | Label | Destination |
|----------|------|-------|-------------|
| 1 | Home | Home | `/` |
| 2 | LayoutDashboard | Perform | `/agent/dashboard` |
| 3 | Users | Team | `/team/dashboard` |
| 4 | DollarSign | RevShare | `/revshare/dashboard` |
| 5 | Menu | More | Opens bottom sheet |

---

## Technical Approach

### New Components

1. **`MobileBottomNav.tsx`** - Fixed bottom tab bar component
2. **`MoreMenuSheet.tsx`** - Bottom sheet for remaining nav items

### Component Removal

- **`MobileNavDrawer.tsx`** - Will be deleted (replaced by new components)

---

## Implementation Details

### File Changes

| File | Action |
|------|--------|
| `src/components/layout/MobileBottomNav.tsx` | Create - Bottom tab bar |
| `src/components/layout/MoreMenuSheet.tsx` | Create - "More" bottom sheet |
| `src/components/layout/MobileNavDrawer.tsx` | Delete - No longer needed |
| `src/components/layout/DashboardLayout.tsx` | Modify - Add bottom nav, adjust padding |
| `src/components/layout/Header.tsx` | Modify - Remove hamburger menu on mobile |

---

### 1. MobileBottomNav.tsx (New File)

**Key Features:**

- Fixed at bottom of screen on mobile only (`lg:hidden`)
- 5 tabs with icons and labels
- Active state highlighting with brand blue color
- Safe area padding for devices with home indicators
- 60px height for comfortable touch targets

**Structure:**

```tsx
interface TabItem {
  icon: LucideIcon;
  label: string;
  path?: string;
  isMore?: boolean;
}

const tabs: TabItem[] = [
  { icon: Home, label: "Home", path: "/" },
  { icon: LayoutDashboard, label: "Perform", path: "/agent/dashboard" },
  { icon: Users, label: "Team", path: "/team/dashboard" },
  { icon: DollarSign, label: "RevShare", path: "/revshare/dashboard" },
  { icon: Menu, label: "More", isMore: true },
];
```

**Styling:**

```tsx
// Container - fixed bottom, safe area aware
className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-border pb-safe"

// Individual tab - centered, touch-friendly
className="flex flex-col items-center justify-center flex-1 py-2 min-h-[60px]"

// Active state
className="text-exp-blue"

// Inactive state  
className="text-muted-foreground"
```

---

### 2. MoreMenuSheet.tsx (New File)

**Key Features:**

- Uses vaul Drawer component (bottom sheet style)
- Contains all remaining navigation items not in the tab bar
- Items with submenus expand inline (accordion style) rather than slide-to-view
- Closes on navigation

**Navigation Items in "More":**

- Documents (with submenu: All Documents, Templates)
- Events Calendar
- ICON Program
- Mentor Program
- Tools
- Knowledge Base
- Help Center

**Structure:**

```tsx
interface MoreMenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

// Submenu items expand inline when tapped
const [expandedItem, setExpandedItem] = useState<string | null>(null);
```

**Styling:**

```tsx
// Sheet background
className="bg-white"

// Menu items - 44px touch targets
className="min-h-[44px] flex items-center gap-3 px-4 py-3"

// Submenu items - slightly indented
className="pl-12"
```

---

### 3. DashboardLayout.tsx Modifications

**Changes needed:**

1. Remove `MobileNavDrawer` import and usage
2. Remove `mobileMenuOpen` state (hamburger no longer needed)
3. Add `MobileBottomNav` component
4. Add bottom padding on mobile to account for tab bar (`pb-20 lg:pb-6`)
5. Move Mira chat button above the tab bar

**Updated structure:**

```tsx
import { MobileBottomNav } from "./MobileBottomNav";

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isChatOpen, openChat, closeChat } = useMiraChat();

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <Header />
      <Sidebar />
      
      <main className={`lg:ml-64 min-h-screen px-4 lg:px-6 pt-20 pb-24 lg:pb-6 ...`}>
        {children}
      </main>

      {/* Mira Chat Button - positioned above tab bar on mobile */}
      <Button
        onClick={openChat}
        className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 ..."
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      <ChatPanel isOpen={isChatOpen} onClose={closeChat} />
    </div>
  );
}
```

---

### 4. Header.tsx Modifications

**Changes needed:**

- Remove hamburger menu button on mobile (no longer needed)
- Remove `onMenuClick` prop

**Before:**
```tsx
interface HeaderProps {
  onMenuClick: () => void;
}
```

**After:**
```tsx
// No props needed - header is simpler now
export function Header() {
  // Remove hamburger button completely
}
```

---

## Safe Area Handling

For devices with bottom home indicators (iPhone X and later):

```css
/* Add to index.css */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
```

The tab bar will use `pb-safe` to ensure content doesn't overlap with the home indicator.

---

## Interaction Flow

```text
User lands on app
        |
        v
+------------------+
| Bottom tab bar   |  <- Always visible
| visible          |
+------------------+
        |
        | User taps "Home"
        v
+------------------+
| Navigates to /   |  <- Direct 1-tap navigation
+------------------+

OR
        | User taps "More"
        v
+------------------+
| Bottom sheet     |  <- Slides up from bottom
| with remaining   |
| nav options      |
+------------------+
        |
        | User taps "Documents"
        v
+------------------+
| Submenu expands  |  <- Inline accordion
| - All Documents  |
| - Templates      |
+------------------+
        |
        | User taps "All Documents"
        v
+------------------+
| Sheet closes     |  <- Navigates to /documents/all
| Page navigates   |
+------------------+
```

---

## Benefits Over Previous Drawer

| Aspect | Drawer | Tab Bar |
|--------|--------|---------|
| Taps to Home | 2 (open + tap) | 1 |
| Taps to Team | 2 (open + tap) | 1 |
| Scrolling needed | Yes | No (for primary items) |
| Always visible | No | Yes |
| Discoverability | Low | High |

---

## Accessibility

1. **Touch Targets**: All tabs are 60px tall with minimum 44px touch area
2. **Labels**: Every icon has a text label for clarity
3. **Active State**: Clear visual distinction for current page
4. **Safe Areas**: Proper padding for modern device home indicators

---

## Summary

This implementation:

- Provides **1-tap access** to the 4 most important destinations
- Eliminates scrolling through navigation items
- Uses familiar mobile patterns (Instagram, TikTok, etc.)
- Keeps less-used items accessible via "More" menu
- Maintains brand colors and accessibility standards

