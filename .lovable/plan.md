

## Plan: Two-Row Horizontal Scrolling Dashboard Section

Replace the existing `promo-carousel` widget rendering with a new component that displays two titled horizontal scroll rows, each containing two cards.

### New File

**`src/components/dashboard/GrowthAndDevelopmentRows.tsx`**
- Two sections, each with a title and a horizontal scroll container (`overflow-x-auto flex gap-4 pb-2` with `snap-x` for mobile)
- Cards are fixed-width (`min-w-[280px]`) so they scroll on small screens and sit side-by-side on desktop
- **Row 1 — "Financial Growth"**:
  - Card 1: "Revenue Share Explained" — blue theme, `Play` icon, "Watch Video" button
  - Card 2: "Stock Purchase Program" — gold theme, `TrendingUp` icon, "Enroll Now" button
- **Row 2 — "Professional Development"**:
  - Card 1: "DISC Assessment" — purple theme, `Target` icon, "Take Assessment" button
  - Card 2: "Your Feedback" — default/primary theme, `MessageCircleQuestion` icon, "Take Survey" button (opens existing NPS dialog)
- Reuses existing theme styles (purple, gold, blue gradients) and card layout pattern from `PromotionalCarousel` and `DiscAssessmentCard`

### Modified Files

**`src/components/dashboard/WidgetRenderer.tsx`**
- Import `GrowthAndDevelopmentRows`
- Change `promo-carousel` case to render `<GrowthAndDevelopmentRows />`
- Remove `disc-assessment` and `nps-survey` cases (they're now inside the new component)

**`src/types/dashboard.ts`**
- Remove `disc-assessment` and `nps-survey` from `DEFAULT_LAYOUT` array (they're embedded in promo-carousel now)
- Keep their types in `WidgetType` and `WIDGET_REGISTRY` so existing saved layouts don't break

