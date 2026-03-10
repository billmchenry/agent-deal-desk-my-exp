

## Update Capping Update Hero Card for Light Mode

Based on the reference screenshot, the light mode version uses a soft frosted/lavender gradient instead of the current dark navy. The text switches to dark colors.

### Changes to `src/components/dashboard/HeroBannerCard.tsx`

Import `useTheme` from `next-themes` and conditionally apply light vs dark styles:

**Light mode appearance (matching screenshot):**
- **Card background**: Gradient from Frosted Blue (`#D3DAE9`) → Light Grey (`#EEEEEE`) → Frosted Blue (`#D3DAE9`)
- **Decorative orbs**: Slate Blue (`#506CAA`) and Moss Grey (`#686672`) at low opacity
- **Badge**: Slate Blue background/border with Charcoal Blue text
- **Title text**: Charcoal Blue (`#31303F`) / Dark Navy (`#0C0F24`)
- **Cap target value**: Dark Navy (`#0C0F24`) bold
- **Subtitle text**: Moss Grey (`#686672`)
- **Button**: Dark Navy bg with white text
- **Current value**: Green (kept as-is)
- **Progress ring**: Track in Slate Blue at 20% opacity, text in Dark Navy
- **"Complete" label**: Moss Grey

**Dark mode**: Keeps existing navy gradient styling unchanged.

### Implementation approach
Use a `resolvedTheme` check to toggle between two sets of class names / inline colors, keeping it all within the one component file.

