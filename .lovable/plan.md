

## Plan: Make Close Icon Visible in Mobile Nav Drawer

**Problem**: The MobileNavDrawer uses a dark `bg-sidebar` background, but the Sheet component's built-in close button uses default text colors, making it invisible against the dark background.

**Fix** in `src/components/layout/MobileNavDrawer.tsx`:

Add a custom class to the SheetContent to style the close button with white/light text so it's visible on the dark sidebar background. Specifically, add `[&>button]:text-sidebar-foreground` to the SheetContent className on line 189, which will target the built-in close button and make it visible.

Single-line change — no structural modifications needed.

