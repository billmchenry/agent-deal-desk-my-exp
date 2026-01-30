

# Auto-Play for Promotional Carousel

## Overview

Add auto-play functionality to the promotional carousel so it automatically advances to the next slide every 5 seconds, with pause-on-hover behavior for better user experience.

---

## Current State

The carousel currently:
- Has manual navigation via dot indicators
- Supports swipe/touch gestures
- Loops infinitely (`loop: true`)
- Does NOT auto-advance

---

## Implementation

### File to Modify

**`src/components/dashboard/PromotionalCarousel.tsx`**

Add a new `useEffect` hook that sets up an interval timer to auto-advance slides every 5 seconds.

### Changes

1. **Add auto-play interval** - Use `setInterval` to call `api.scrollNext()` every 5 seconds
2. **Pause on hover** - Track hover state and skip auto-advance when user is hovering
3. **Cleanup** - Clear interval on component unmount

---

## Code Changes

```tsx
// Add hover state
const [isHovered, setIsHovered] = React.useState(false);

// Add auto-play effect
React.useEffect(() => {
  if (!api || isHovered) return;

  const interval = setInterval(() => {
    api.scrollNext();
  }, 5000);

  return () => clearInterval(interval);
}, [api, isHovered]);

// Add hover handlers to container
<div 
  className="space-y-3"
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>
```

---

## Behavior

| Scenario | Auto-Play |
|----------|-----------|
| Normal viewing | Advances every 5 seconds |
| Mouse hovering over carousel | Paused |
| User clicks dot indicator | Continues from new position |
| User swipes manually | Continues from new position |

---

## File Summary

| Action | File |
|--------|------|
| Modify | `src/components/dashboard/PromotionalCarousel.tsx` |

