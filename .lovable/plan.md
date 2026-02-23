

## Remove Grayed-Out Background Overlay from Mira Chat Panel

**Problem**: When the Mira chat panel opens (both on desktop and mobile), a dark semi-transparent overlay covers the entire background, making the dashboard inaccessible. The chat should be a side panel that sits alongside the content, not a modal with a backdrop.

### Approach

Replace the `Sheet`/`Drawer` wrapper components with a simple positioned `div` panel. The dashboard layout already handles content reflow via `lg:mr-[28rem]` when the chat is open, so we just need the panel itself without the modal overlay.

### Changes

**1. `src/components/chat/ChatPanel.tsx`**
- Remove the `Sheet` / `SheetContent` wrapper for the desktop (non-expanded) chat panel
- Replace with a fixed-position `div` that slides in from the right (matching the current width/styling)
- Remove the `Drawer` / `DrawerContent` wrapper for mobile
- Replace with a fixed-position full-height `div` panel (no overlay behind it)
- Keep the expanded (full-screen) mode using `Sheet` since that is intentionally a full takeover
- Remove unused `Sheet`/`Drawer` imports if no longer needed

**2. Result**
- The chat panel slides in from the right as before, but the rest of the page remains fully visible and interactive
- On mobile, the chat panel covers the screen (as intended for mobile) but without the dark backdrop
- The expanded mode continues to work as a full-screen overlay (intentional behavior)

### Technical Detail
The desktop panel will be a `fixed right-0 top-0 h-full w-[28rem] z-50` div with a slide-in transition. The mobile panel will be `fixed inset-0 z-50` without an overlay. Both will have proper close handling and maintain all existing chat functionality.

