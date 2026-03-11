

## ICON Program Hero Banner — Brand Color Update

### Brand Colors from eXp Toolkit

The toolkit defines these as **primary** colors:
- **Black** `#000000`
- **Charcoal Blue** `#31303F` (already `--exp-charcoal-blue`)
- **Dark Navy** `#0C0F24` (already `--exp-dark-navy`)
- **Moss Grey** `#686672` (already `--exp-moss-grey`)
- **Light Grey** `#EEEEEE`
- **Slate Blue** `#506CAA` (already `--exp-blue` / `--primary`)
- **White** `#FFFFFF`

**Secondary**: Frosted Blue `#D3DAE9` (already `--exp-frosted-blue`)

### Current State

The ICON hero banner (lines 93–109 of `IconProgram.tsx`) uses `exp-navy → exp-navy-light → exp-blue` gradient with `exp-gold` badge accents. These are close but the gradient leans more saturated blue than the toolkit's darker charcoal-navy palette.

### Planned Changes

**File: `src/pages/agent/IconProgram.tsx`** (hero banner section only)

1. **Gradient** — Change from `from-exp-navy via-exp-navy-light to-exp-blue` to `from-[#0C0F24] via-[#31303F] to-[#506CAA]` (Dark Navy → Charcoal Blue → Slate Blue), matching the toolkit's primary palette progression.

2. **Badge accent** — Update from gold tones to Slate Blue tones (`bg-[#506CAA]/20 text-white/90 border-[#506CAA]/30`) for a more brand-consistent look.

3. **Decorative circles** — Change the gold circle to Frosted Blue (`#D3DAE9`) to use the secondary brand color.

4. **Light mode support** — Add theme-aware styling similar to `HeroBannerCard.tsx`, using Frosted Blue and Light Grey for the light theme variant.

All existing CSS variables will be reused where they match; direct hex values used only where toolkit colors don't have an existing variable.

