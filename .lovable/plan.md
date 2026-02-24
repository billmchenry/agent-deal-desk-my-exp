

## Make the Sidebar Collapsible

Add a toggle to collapse the sidebar into a narrow icon-only rail (~64px / `w-16`), and expand it back to the full `w-64` width. The collapsed state persists via `localStorage`.

### Changes

**1. New context/hook: `src/hooks/use-sidebar-collapse.ts`**
- Create a small hook using `useLocalStorage` to store `sidebarCollapsed: boolean`
- Export `useSidebarCollapse()` returning `{ isCollapsed, toggleCollapse }`

**2. `src/components/layout/Sidebar.tsx`**
- Import and use `useSidebarCollapse`
- Toggle width between `w-64` (expanded) and `w-16` (collapsed) with a CSS transition
- In collapsed mode:
  - Hide section labels (MY DESK, BUSINESS & GROWTH, etc.)
  - Show only icons (centered), hide text labels
  - Hide submenu items and chevrons
  - Show a tooltip on hover for each icon with the item title
- Add a collapse/expand toggle button at the bottom of the sidebar (e.g., `ChevronsLeft` / `ChevronsRight` icon)

**3. `src/components/layout/Header.tsx`**
- Import `useSidebarCollapse`
- Change `lg:left-64` to dynamically use `lg:left-16` when collapsed, `lg:left-64` when expanded

**4. `src/components/layout/DashboardLayout.tsx`**
- Import `useSidebarCollapse`
- Change `lg:ml-64` on `<main>` to dynamically use `lg:ml-16` when collapsed, `lg:ml-64` when expanded

**5. No changes to mobile** -- the mobile nav drawer is separate and unaffected.

### Behavior
- Clicking the toggle button at the bottom of the sidebar collapses/expands it
- Collapsed state shows icon-only nav items with tooltips on hover
- Smooth width transition (`transition-all duration-300`)
- State persists across page reloads via localStorage
- Submenus are hidden in collapsed mode; hovering an icon with a submenu could show a tooltip with the parent label

