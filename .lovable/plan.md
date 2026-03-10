

## Plan: Hide Pagination Dots on Desktop

In `src/components/dashboard/GrowthAndDevelopmentRows.tsx`, add `md:hidden` to the dots container so they only appear on mobile.

### Change

In the `CarouselRow` component, update the dots wrapper div (around line 89):

```tsx
// From:
{cards.length > 1 && (
  <div className="flex justify-center gap-1.5">

// To:
{cards.length > 1 && (
  <div className="flex justify-center gap-1.5 md:hidden">
```

This keeps the current carousel behavior intact — on desktop both cards are visible side-by-side so dots are unnecessary; on mobile the dots help indicate there's a second card to swipe to.

