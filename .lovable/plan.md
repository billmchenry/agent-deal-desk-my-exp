
# Promotional Cards Carousel

## Overview

Create a carousel component that cycles through three promotional cards (DISC Assessment, Stock Purchase Program, Revenue Share Explained), replacing the current stacked layout with a swipeable/clickable carousel.

---

## Current vs After

```text
CURRENT (Stacked)               AFTER (Carousel)
┌─────────────────────┐         ┌─────────────────────┐
│  DISC Assessment    │         │  • ○ ○              │
│  [Button]           │         │  ◀ [Active Card] ▶  │
└─────────────────────┘         │                     │
┌─────────────────────┐         │  Swipe or click     │
│  Stock Program      │         │  to navigate        │
│  [Button]           │         └─────────────────────┘
└─────────────────────┘
┌─────────────────────┐
│  Revenue Share      │
│  [Button]           │
└─────────────────────┘

Height: ~450px                  Height: ~160px
```

---

## Component Design

### New: `PromotionalCarousel.tsx`

A single carousel containing three themed promotional slides:

| Slide | Title | Theme | Button |
|-------|-------|-------|--------|
| 1 | DISC Assessment | Purple gradient | "Take Assessment" |
| 2 | Stock Purchase Program | Amber/Gold gradient | "Learn More" |
| 3 | Revenue Share Explained | Amber/Gold gradient | "Watch Video" |

### Features
- Dot indicators showing current slide
- Left/right navigation arrows
- Auto-advances every 5 seconds (optional)
- Touch/swipe support on mobile
- Keyboard navigation (arrow keys)

---

## Visual Design

Each slide maintains the current card styling from your screenshot:

```text
┌────────────────────────────────────────┐
│  [Icon]  Title                         │
│          Description text that         │
│          explains the feature          │
│                                        │
│          [Action Button →]             │
└────────────────────────────────────────┘
```

With themed backgrounds:
- **Purple gradient** for DISC
- **Amber/gold gradient** for Stock & Revenue

---

## Technical Implementation

### Files to Create

**`src/components/dashboard/PromotionalCarousel.tsx`**

Uses the existing Embla carousel components:
- `Carousel`, `CarouselContent`, `CarouselItem` from `@/components/ui/carousel`
- Adds custom dot indicators for navigation
- Contains all three promotional cards inline

```tsx
// Structure
<Carousel opts={{ loop: true }}>
  <CarouselContent>
    <CarouselItem>
      {/* DISC Card - Purple */}
    </CarouselItem>
    <CarouselItem>
      {/* Stock Program Card - Amber */}
    </CarouselItem>
    <CarouselItem>
      {/* Revenue Share Card - Amber */}
    </CarouselItem>
  </CarouselContent>
  {/* Dot indicators below */}
</Carousel>
```

### Files to Modify

**`src/pages/Index.tsx`**

Add the `PromotionalCarousel` to the right sidebar:

```tsx
<div className="space-y-6">
  <NewsAndTrainingCard />
  <PromotionalCarousel />  {/* New */}
  <ConnectUplineCard />
</div>
```

### Files to Delete

**`src/components/dashboard/DISCCard.tsx`**

Content merged into the carousel, standalone file no longer needed.

---

## Carousel Features

### Navigation
- **Dots**: Click to jump to specific slide
- **Arrows**: Small prev/next buttons (can be hidden on mobile)
- **Swipe**: Touch gestures on mobile
- **Keyboard**: Arrow keys when focused

### Auto-play (Optional)
- Advances every 5 seconds
- Pauses on hover/focus
- Can be disabled for accessibility

---

## Implementation Steps

1. Create `PromotionalCarousel.tsx` with carousel wrapper
2. Add three promotional slide cards with themed styling
3. Add dot indicator component below carousel
4. Update `Index.tsx` to include the carousel in sidebar
5. Delete the standalone `DISCCard.tsx` file

---

## File Summary

| Action | File |
|--------|------|
| Create | `src/components/dashboard/PromotionalCarousel.tsx` |
| Modify | `src/pages/Index.tsx` |
| Delete | `src/components/dashboard/DISCCard.tsx` |

---

## Benefits

- **Saves vertical space** - 3 cards become 1 carousel (~66% height reduction)
- **Better mobile UX** - Less scrolling required
- **Engagement** - Carousel draws attention to rotating content
- **Uses existing components** - Leverages the Embla carousel already installed
- **All content preserved** - Nothing removed, just reorganized
