

## Make "Agent" a Direct Link with Auto-Expanding Submenu

Right now, clicking "Agent" in the sidebar only toggles the submenu open/closed -- it doesn't navigate anywhere. This creates a dead-end click that feels unintuitive. The fix is straightforward: make the parent label itself navigate to the dashboard, and auto-show the sub-items whenever you're in that section.

### What Changes

**1. "Agent" becomes a clickable link to `/agent/dashboard`**
- Clicking the word "Agent" takes you straight to the Agent Dashboard
- No more "click once to expand, then click again to go somewhere" pattern

**2. Submenu auto-expands when you're in the section**
- If you're on any `/agent/*` route (Dashboard, Transactions, ICON Program), the submenu items are visible automatically
- The submenu stays expanded as long as you're in that section -- no need to manually open it
- You can still collapse it manually if you want, but navigating to any agent page re-expands it

**3. Same pattern applied to other expandable menus**
- "RevShare Earnings" and "Documents" follow the same logic: the parent item links to the first submenu destination, and the submenu auto-expands based on the current route
- This keeps the sidebar behavior consistent across all sections

**4. Applied to both desktop and mobile navigation**
- Desktop sidebar (`Sidebar.tsx`) and mobile drawer (`MobileNavDrawer.tsx`) both get updated

### Technical Details

**Files modified:**

**`src/data/mockData.ts`**
- Add a `url` field to the Agent nav item pointing to `/agent/dashboard`
- Add a `url` field to RevShare Earnings pointing to `/revshare/dashboard`
- Add a `url` field to Documents pointing to `/documents/all`
- These items keep their `submenu` arrays -- they now have both a `url` and a `submenu`

**`src/components/layout/Sidebar.tsx`**
- Update `handleItemClick`: if the item has both a `url` and a `submenu`, navigate to the URL and expand the submenu simultaneously
- Update `renderNavItem` for the `hasSubmenu` case: wrap the parent label in an `<a>` tag (or use `react-router-dom`'s `Link`) pointing to `item.url`, while keeping the chevron as a separate expand/collapse toggle
- Update auto-expand logic: use `location.pathname.startsWith()` to match section prefixes (e.g., `/agent/`) so the submenu stays open across all child routes, not just exact matches

**`src/components/layout/MobileNavDrawer.tsx`**
- Mirror the same changes: clicking the parent navigates and expands, submenu auto-expands based on current route prefix
- Auto-expand on mount by checking the current path against submenu URLs

### Interaction Flow

```text
Before:
  Click "Agent"     --> submenu expands (no navigation)
  Click "Dashboard" --> navigates to /agent/dashboard

After:
  Click "Agent"      --> navigates to /agent/dashboard AND submenu expands
  Click "Transactions" --> navigates to /agent/transactions (submenu stays open)
  Navigate away       --> submenu collapses automatically
```
