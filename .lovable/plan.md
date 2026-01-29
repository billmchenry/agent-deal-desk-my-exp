

# Mobile-First Upline Card Implementation

## Overview

Redesign the "Connect with your Upline" card to be optimized for mobile devices, featuring a scrollable flat list of all upline partners with visible quick action icons, and a bottom drawer that slides up with full contact details when tapping on a partner.

---

## Design Approach

### Current State
- Shows 1 sponsor + 3 hardcoded members
- Uses a generic "more" menu (3-dot icon) that requires extra taps
- No scrolling for larger lists
- No detailed contact view

### Mobile-First Solution
1. **Flat Scrollable List** - All partners visible in a scroll area (max-height prevents card from dominating screen)
2. **Visible Quick Actions** - Phone and email icons directly on each row for one-tap calling/emailing
3. **Tappable Name/Avatar** - Opens a bottom drawer with full profile details
4. **48px Touch Targets** - All interactive elements meet minimum accessibility size
5. **Lineage/Contributor Toggle** - Reuse the tab pattern from existing UplinePartnersCard

---

## User Experience Flow

```text
+----------------------------------+
|  Connect with your Upline        |
|  [Lineage] [Contributor]         |
+----------------------------------+
|  +----+  James Anderson     [P][E]|  <-- Tap name = drawer
|  |    |  Level 1 - Sponsor        |      [P] = Phone, [E] = Email
|  +----+                           |
|  +----+  David Williams     [P][E]|
|  |    |  Level 2                  |
|  +----+                           |
|  +----+  Maria Garcia       [P][E]|
|  |    |  Level 3                  |
|  +----+                           |
|  ... scrollable ...               |
+----------------------------------+
```

When user taps on a name or avatar, a bottom drawer slides up:

```text
+----------------------------------+
|          [drag handle]           |
|                                  |
|       +--------+                 |
|       | Avatar |                 |
|       +--------+                 |
|      James Anderson              |
|      Level 1 - Sponsor           |
|                                  |
|  +------------------------------+|
|  |  [Phone Icon]  Call          ||
|  |  (555) 234-5678              ||
|  +------------------------------+|
|  |  [Email Icon]  Email         ||
|  |  james.anderson@exp.com      ||
|  +------------------------------+|
|  |  [Message Icon] Message      ||
|  +------------------------------+|
|                                  |
|        [Close Button]            |
+----------------------------------+
```

---

## Technical Details

### Files to Modify

**1. `src/components/dashboard/ConnectUplineCard.tsx`**
   - Replace hardcoded data with `uplinePartners` from mockData
   - Add Lineage/Contributor tabs filter
   - Wrap list in `ScrollArea` with `max-h-64` (256px)
   - Add phone/email quick action buttons per row (visible, not hidden in menu)
   - Make name/avatar clickable to trigger drawer
   - Add `Drawer` component for full contact details
   - Ensure row heights are at least 48px for touch targets

### Components Used
- `ScrollArea` - Already available at `@/components/ui/scroll-area`
- `Drawer` - Already available at `@/components/ui/drawer` (vaul-based)
- `Tabs` - Already available at `@/components/ui/tabs`
- `Avatar`, `Button`, `Card` - Already in use

### Data Source
- Use `uplinePartners` from `@/data/mockData.ts` (already has 6 partners with phone, email, level, isContributor fields)

### Mobile Considerations
- Row height: `min-h-[48px]` for accessibility
- Icon buttons: `h-10 w-10` minimum tap area
- ScrollArea max-height: `max-h-64` on mobile to prevent card from taking over the screen
- Drawer: Uses native-feeling slide-up animation (vaul library)
- Quick actions visible without extra taps

---

## Implementation Steps

1. **Update imports** - Add ScrollArea, Drawer, Tabs, and uplinePartners data
2. **Add state** - Track selected partner for drawer and current view filter
3. **Add Lineage/Contributor tabs** - Filter toggle in card header
4. **Replace member list** - Use uplinePartners data with ScrollArea wrapper
5. **Add quick action icons** - Phone and email buttons visible on each row
6. **Add bottom drawer** - Shows full contact details when tapping name/avatar
7. **Style for mobile** - Ensure 48px touch targets and proper spacing

---

## Expected Outcome

- Works seamlessly on mobile with thumb-friendly tap targets
- All upline partners accessible via scrolling
- One-tap access to call or email
- Full contact details available via bottom drawer
- Clean, uncluttered interface that doesn't overwhelm the sidebar

