

## Plan: Update Agent Performance Hero Banner to Match ICON Program Design

**Goal**: Apply the ICON Program's dark gradient banner style to the Agent Performance hero banner (both light and dark modes), keeping all data and functionality unchanged.

### Changes (single file: `src/components/agent/AgentHeroBanner.tsx`)

1. **Card gradient**: Replace the light frosted-blue gradient with the ICON Program's dark gradient:
   - `from-[hsl(var(--exp-dark-navy))] via-[hsl(var(--exp-charcoal-blue))] to-[hsl(var(--exp-slate-blue))]` (same for both light and dark modes)
   - Add `text-white` to the Card

2. **Decorative circles**: Change to white/frosted-blue (matching ICON) instead of slate-blue/moss-grey

3. **Badge**: Update to white-on-transparent style (`bg-white/15 text-white border-white/20`)

4. **MiniStatCard**: Update colors for white-text context:
   - Border: `border-white/20`
   - Background: `bg-white/10` with `hover:bg-white/15`
   - Icon containers: use `bg-white/15` with white text for all color variants
   - Value text: `text-white`
   - Label text: `text-white/60`

5. **Transaction status breakdown card** (4th column): Same border/bg updates, text to white/white-60

No data, props, or functionality changes.

