

## Add Pagination Dots to Scroll Rows

Add non-looping pagination dots below each horizontal scroll row in `GrowthAndDevelopmentRows.tsx` to indicate which card is currently in view.

### Approach

**`src/components/dashboard/GrowthAndDevelopmentRows.tsx`**
- Track the active card index via an `IntersectionObserver` on each card (threshold ~0.6) inside `ScrollRow`
- Render small dot indicators below each row — filled for active, muted for inactive
- Dots are non-interactive (visual indicator only) since users scroll naturally
- No looping — dots simply reflect scroll position
- On desktop where both cards are visible, both dots fill or dots are hidden (since no scrolling is needed)

This keeps the UI clean and gives mobile users a clear signal there's more content to swipe to.

