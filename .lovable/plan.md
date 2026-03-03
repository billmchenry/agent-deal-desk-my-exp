

## Fix Mobile Layout for Distribution Charts and Comparison Controls

### Problem
On mobile (390px), both the Distribution section and the Comparison chart controls look cramped and poorly organized:
- The donut charts sit side-by-side with the legend list, making both too small to read comfortably
- The Comparison header has too many controls wrapping awkwardly in one row

### Changes (all in `src/pages/revshare/Dashboard.tsx`)

**1. Distribution Charts — Stack chart above legend on mobile**

Instead of the current side-by-side layout (donut left, legend right), stack them vertically on mobile so the donut chart is centered above the legend list. This gives both elements proper breathing room.

- Lines 257 and 311: Change `flex items-center gap-4` to `flex flex-col items-center sm:flex-row sm:items-center gap-3 sm:gap-4`
- The donut container keeps `w-24 h-24 sm:w-32 sm:h-32` but now sits centered above the legend on mobile
- The legend list (`flex-1`) gets full width on mobile with `w-full sm:w-auto`

**2. Reduce donut chart inner/outer radius on mobile**

The current `innerRadius={38} outerRadius={56}` is fine for the 128px desktop container but too large for the 96px mobile one — the ring gets clipped or looks cramped. Use the `useIsMobile` hook to set smaller radii on mobile:
- Mobile: `innerRadius={28} outerRadius={42}`
- Desktop: `innerRadius={38} outerRadius={56}`

Import `useIsMobile` from `@/hooks/use-mobile` at the top of the component.

**3. Comparison Chart Controls — Stack controls below header on mobile**

- Line 367: Change the controls wrapper from `flex items-center gap-3 flex-wrap` to `flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto`
- Group the "View Trends" link and Tabs into one row, and the legend into its own row below, so the wrapping is intentional rather than chaotic
- Wrap "View Trends" + Tabs in a `flex items-center gap-2` container
- Keep legend as a separate `flex items-center gap-2` row

**4. Chart bar label font size**

- Line 427: The bar label uses `fontSize={10}` which violates the 12px minimum accessibility rule. Change to `fontSize={12}`.

### Technical Details

- Import `useIsMobile` hook
- Call `const isMobile = useIsMobile()` inside the component
- Use `isMobile` to conditionally set pie chart radii
- All other changes are pure Tailwind class adjustments
- Desktop appearance remains virtually unchanged

