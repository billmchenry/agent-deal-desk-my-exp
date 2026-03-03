

## Better Mobile Experience for RevShare Group Distribution

### Problem
On mobile, the Distribution section stacks two complete chart+legend blocks vertically, creating a very long scroll. Each block (donut chart + 7 legend rows) takes significant vertical space, and the user has to scroll past both to reach the Comparison section.

### Solution: Tab-Based View Switching on Mobile

On mobile only, replace the stacked "By Level" / "By Country" layout with a single top-level tab switcher that shows one view at a time. On desktop, keep the current side-by-side layout unchanged.

This approach:
- Cuts vertical space roughly in half on mobile
- Gives the visible chart+legend the full card width
- Follows the existing tap-to-interact pattern used elsewhere in the app
- The Agents/RevShare toggle moves inline with the section header

### Visual Concept (Mobile)

```text
+------------------------------------------+
| RevShare Group Distribution              |
| Agent distribution across levels...      |
|                                          |
|  [ By Level ]  [ By Country ]            |
|                                          |
|        Agents  |  RevShare               |
|                                          |
|         (Donut Chart)                    |
|          17,816                          |
|          Agents                          |
|                                          |
|  * Level 1 (0.7%)              129       |
|  * Level 2 (2.1%)              374       |
|  * Level 3 (5.4%)              962       |
|  ...                                     |
+------------------------------------------+
```

### Desktop (unchanged)

The current side-by-side `lg:grid-cols-2` layout remains exactly as-is.

### Technical Approach

All changes in `src/pages/revshare/Dashboard.tsx`:

1. **Add a `distributionView` state** (`"level" | "country"`, default `"level"`) to track which view is active on mobile.

2. **Mobile layout**: Replace the `grid grid-cols-1 lg:grid-cols-2` wrapper with:
   - On mobile: A top-level `Tabs` component with "By Level" and "By Country" triggers, rendering only the selected chart+legend block.
   - On desktop (`lg:` and up): Keep the existing two-column grid with both blocks visible.

3. **Use `isMobile` (already imported)** to conditionally render:
   - Mobile: Single tab-switched view
   - Desktop: Side-by-side grid (current code, untouched)

4. **Move the Agents/RevShare toggle** into the header row next to the tab triggers on mobile, so there's one clean control bar instead of separate toggles per section.

5. **Touch targets**: The new "By Level" / "By Country" tab triggers will use the same `min-h-[44px] sm:min-h-0` pattern already established.

6. **Donut chart sizing on mobile**: With the full card width available (instead of sharing with a second chart), the donut can be slightly larger — `w-28 h-28` — improving readability without taking excessive space.

