

# ICON Banner Mobile UX Improvements

## Goal
Make the banner cards more intuitive as navigation elements on mobile, improve touch targets, and strengthen the visual connection between the selected card and its content.

## Changes

### 1. Improve tap affordance on banner cards
**File: `src/components/agent/IconStatusBanner.tsx`**
- Add a subtle bottom-border accent or arrow indicator on the active card pointing down toward the content
- Add a slight scale or lift effect on the active card to reinforce selection
- Increase minimum card height to `min-h-[88px]` for comfortable 44px+ touch targets

### 2. Better low-percentage visibility on Production card
**File: `src/components/agent/IconStatusBanner.tsx`**
- When progress is below 10%, show a minimum visible width on the progress bar (e.g., `max(value, 8)%`) so the bar is never invisible
- Make the percentage text slightly bolder/larger to compensate

### 3. Add active tab heading with transition
**File: `src/pages/agent/IconProgram.tsx`**
- Each `TabsContent` section already has an `h2` heading (e.g., "ICON Production Overview", "Event Overview"). These serve as the connection. No change needed here -- the headings are sufficient.

### 4. Mobile-specific spacing polish
**File: `src/components/agent/IconStatusBanner.tsx`**
- Reduce gap between cards from `gap-3` to `gap-2` on mobile to give each card a bit more breathing room within the grid
- Ensure text doesn't truncate on small screens by using `text-xs` consistently for detail labels

## Technical Details

All changes are in `src/components/agent/IconStatusBanner.tsx`:

- Active card: add `ring-2 ring-primary shadow-md` (already has ring) plus a small bottom indicator triangle or just rely on the stronger shadow
- Add `min-h-[88px]` to each card for touch target compliance  
- Progress bar minimum visible width: `Math.max(pillar.progress, 8)` when rendering the Progress value
- Gap: `gap-2 lg:gap-3` on the grid container
- Active card gets a subtle `transform scale-[1.02]` transition for tactile feedback

