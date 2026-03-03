

## WCAG 2.2 Level A and AA Compliance Plan

This is a large, multi-area effort. Rather than trying to do everything at once, the plan is organized by WCAG principle (Perceivable, Operable, Understandable, Robust) with the specific gaps found in this codebase.

---

### Phase 1: Structural and Navigation Foundations

**1. Add Skip Navigation Link**
- No skip link exists today. Add a "Skip to main content" link as the first focusable element in `DashboardLayout.tsx`
- Add `id="main-content"` to the `<main>` element
- Style it as `sr-only` until focused, then visually appear at the top of the page

**2. Add Landmark Roles and Page Titles**
- `DashboardLayout.tsx`: The `<main>` tag is already present (good), but the sidebar `<aside>` needs `aria-label="Main navigation"`
- `Header.tsx`: Wrap header content in semantic `<header>` (already done) and add `role="banner"` or keep as-is since `<header>` implies it
- Each page needs a unique document `<title>` -- currently all pages say "Lovable App". Add a simple `useEffect` in each page component to set `document.title`, or create a small `useDocumentTitle` hook

**3. Fix the Sidebar Header (Dark Mode)**
- `Sidebar.tsx` line 216-218: The header uses hardcoded `bg-white` -- needs to change to `bg-background` or a sidebar-appropriate variable for dark mode contrast compliance

---

### Phase 2: Interactive Element Accessibility

**4. Add Missing `aria-label`s to Icon-Only Buttons**
- `Header.tsx`: The hamburger menu button (`<Menu>`) has no accessible name -- add `aria-label="Open menu"`
- `Header.tsx`: The notification bell button needs `aria-label="Notifications, 3 unread"`
- `Header.tsx`: The help button (mobile icon-only variant) needs `aria-label="Get help"`
- `Header.tsx`: The theme toggle needs `aria-label` that updates with current theme state (e.g., "Switch to dark mode")
- `DashboardLayout.tsx`: The floating Mira chat button needs `aria-label="Open Mira chat"`

**5. Fix Non-Semantic Interactive Elements**
- `Sidebar.tsx` lines 83-90: Uses `<a>` tags without `href` attributes for navigation -- should use proper `<Link>` from react-router-dom or `<button>` elements
- `SettingsTab.tsx`: The setting cards use plain `<button>` elements without accessible names -- the icon buttons need `aria-label` attributes (e.g., "Edit Language", "Open Security settings")
- `MobileNavDrawer.tsx` line 169: `SheetHeader` uses hardcoded `bg-white` -- dark mode contrast issue

**6. Ensure Minimum Touch Targets (44x44px)**
- Audit and enforce `min-h-[44px] min-w-[44px]` on all mobile interactive elements
- `Sidebar.tsx` chevron toggles (line 116-127): Currently `p-1.5` which is ~30px -- needs to be at least 44px on touch devices
- `MobileNavDrawer.tsx` chevron buttons (line 132-134): Same issue

---

### Phase 3: Color and Visual Accessibility

**7. Ensure Sufficient Color Contrast (4.5:1 for text, 3:1 for large text / UI components)**
- `text-muted-foreground` in light mode is `hsl(215 16% 47%)` on `hsl(210 20% 98%)` -- this produces approximately 4.6:1 which passes, but should be verified on all background combinations
- `text-sidebar-foreground/50` and `/70` opacity values in the sidebar may fail contrast requirements -- these semi-transparent text colors on the dark navy background need checking and possible adjustments (e.g., raising `/50` to `/60` or `/70`)
- `text-white/40` and `text-white/50` used extensively in `revshare/Dashboard.tsx` hero banner -- these low-opacity values almost certainly fail WCAG AA contrast on the navy background. Raise minimum to `/70` or use distinct lighter colors
- Notification badge: `bg-exp-red` with `text-white` at `text-[10px]` -- extremely small text needs extra contrast verification

**8. Don't Rely on Color Alone (1.4.1)**
- Active sidebar items only differ by `bg-sidebar-accent` -- should also show a visual indicator like a left border bar or bold text (bold is already applied, which helps)
- Chart data in `YearOverYearChart.tsx` and donut charts should include patterns or labels, not just color coding

---

### Phase 4: Forms and Content

**9. Form Input Labels and Error States**
- `GlobalSearch.tsx`: The search input uses a raw `<input>` without a visible or associated `<label>` -- add `aria-label="Search"` or associate with a label
- `AgentFilterBar.tsx`: The calendar popover trigger button is accessible (has text content), but the preset buttons should have more descriptive labels for screen readers
- `EditProfileSheet.tsx`: Verify all form fields have proper label associations

**10. Focus Management**
- When mobile sheets/drawers open, focus should move to the sheet content (Radix Sheet handles this automatically -- verify)
- When the Mira chat panel opens/closes, focus should be managed appropriately
- The `.tap-card` CSS in `index.css` suppresses `outline: none !important` on focus -- this removes the focus indicator for keyboard users. This is a WCAG 2.4.7 failure. Change to only suppress on `:active` or use `:focus-visible` to preserve keyboard focus indicators while hiding them for touch/mouse

**11. Page Language**
- `index.html`: Already has `lang="en"` (good)

---

### Phase 5: Dynamic Content

**12. Status Messages and Live Regions**
- Toast notifications (sonner/toaster) should use `role="status"` or `aria-live="polite"` -- verify the Radix/Sonner components handle this (they typically do)
- When widgets are reordered via drag-and-drop, announce the change to screen readers with an `aria-live` region (e.g., "Widget moved to position 3")

**13. Drag and Drop Keyboard Support**
- `CustomizableDashboard.tsx` already uses `KeyboardSensor` from dnd-kit -- verify keyboard reordering works end-to-end
- Ensure the drag handle has proper `aria-roledescription="sortable"` and instructions

---

### Summary of Files to Modify

| File | Changes |
|------|---------|
| `src/components/layout/DashboardLayout.tsx` | Skip nav link, main content ID, Mira button aria-label |
| `src/components/layout/Header.tsx` | aria-labels on icon buttons, theme toggle label |
| `src/components/layout/Sidebar.tsx` | aria-label on nav, fix `bg-white`, link semantics, touch targets |
| `src/components/layout/MobileNavDrawer.tsx` | Fix `bg-white`, touch targets on chevrons |
| `src/components/layout/GlobalSearch.tsx` | aria-label on search input |
| `src/components/profile/SettingsTab.tsx` | aria-labels on icon buttons |
| `src/index.css` | Fix `.tap-card` focus suppression |
| `index.html` | Already has `lang="en"` -- no change needed |
| `src/pages/*.tsx` | Add `useDocumentTitle` hook calls for unique page titles |
| `src/hooks/use-document-title.ts` | New hook (simple `useEffect` setting `document.title`) |
| `src/pages/revshare/Dashboard.tsx` | Fix low-opacity text colors for contrast |

### What This Does NOT Cover
- AAA-level requirements (not requested)
- Automated testing tooling (axe-core, pa11y) -- can be added as a follow-up
- Full audit of every component variant -- this plan covers the identified issues from the codebase review

