

# Fix Mobile Nav: Don't Auto-Navigate on Parent Tap

## The Problem

On desktop, the "parent is the link" strategy works great because the sidebar is always visible. But on mobile, tapping a parent item (e.g., "Agent") immediately navigates to its dashboard page and closes the drawer. This means users can never simply expand a submenu to see its child links -- they're always forced to navigate first.

## The Fix

Change the mobile nav so that tapping a parent item with a submenu **only toggles the submenu open/closed** without navigating. Users then pick the specific sub-page they want from the expanded list.

### Behavior Changes

| Action | Current Behavior | New Behavior |
|--------|-----------------|-------------|
| Tap parent with submenu (e.g. "Agent") | Navigates to dashboard + closes drawer | Toggles submenu open/closed (stays on drawer) |
| Tap chevron arrow | Toggles submenu OR navigates if not in section | Toggles submenu open/closed (same as tapping parent) |
| Tap a sub-item (e.g. "Transactions") | Navigates + closes drawer | No change -- same behavior |
| Tap parent without submenu (e.g. "Home") | Navigates + closes drawer | No change -- same behavior |

### Technical Details

**File: `src/components/layout/MobileNavDrawer.tsx`**

1. **Change `handleParentClick`** -- When the item has a submenu, toggle expansion state instead of navigating. Only navigate + close when the item has no submenu.

2. **Change `handleChevronClick`** -- Always toggle the submenu, regardless of whether the user is currently in that section. Remove the navigation fallback.

3. **Track manually expanded items** -- Replace the `manuallyCollapsed` state (which only tracks one collapsed section) with a `manuallyToggled` set that tracks which sections the user has explicitly opened or closed. This allows multiple sections to be expanded simultaneously.

4. **Update `isExpanded` logic** -- A section is expanded if:
   - The user is currently in that section's routes (auto-expand), OR
   - The user has manually toggled it open
   - Unless the user has manually toggled it closed

This keeps the desktop sidebar behavior unchanged (it stays in `Sidebar.tsx`) while giving mobile users a browse-friendly experience.

