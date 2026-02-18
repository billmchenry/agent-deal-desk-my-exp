
# Fix: Blue Outline and Mobile Toggle on ICON Pillar Cards

## Problems Identified

1. **Thick blue outline on active card**: The active pillar card uses `ring-2 ring-primary` which renders as a heavy blue border (visible in the screenshot). This should be a subtler indicator.

2. **Toggle appears broken on mobile**: The `tap-card` CSS class (in `index.css`) includes `@media (pointer: coarse)` rules that force `border-color: inherit !important` and `box-shadow: inherit !important` on hover/active states. Since Tailwind's `ring-*` utilities compile to `box-shadow`, the active card's ring is being stripped away on touch devices. The tap still fires the `onClick`, but because the visual active state is suppressed, it looks like nothing happens.

## Solution

### 1. Replace `ring-2` with a left-border accent (matches existing design patterns)

In `src/components/agent/IconStatusBanner.tsx`, change the active card styling from:
```
ring-2 ring-primary border-primary shadow-md
```
to:
```
border-l-[3px] border-l-primary bg-primary/5
```

This uses a left-border accent and subtle background tint -- consistent with the status indicator patterns already used elsewhere in the app. These styles use `border` and `background-color`, not `box-shadow`, so they won't be suppressed by the `tap-card` CSS.

### 2. Exempt active-state border from the `tap-card` override

In `src/index.css`, update the coarse-pointer rules to not override `border-color` and `background-color` when a card has an explicit active state. Specifically, change the `.tap-card:hover, .tap-card:active` rule to only suppress `transform` and `box-shadow` (the hover effects), leaving border/background alone so the selected state remains visible.

## Files Changed

- `src/components/agent/IconStatusBanner.tsx` -- Update active card classes
- `src/index.css` -- Relax the coarse-pointer overrides to preserve border-color and background-color on active state
