

## Update Confetti to Use Squiggly Shapes

The screenshot shows the confetti particles are **squiggly/wavy lines and curves** (like ribbon streamers), not the current geometric shapes (rectangles, circles, triangles). The current `ConfettiCelebration` component uses basic `fillRect`, `arc`, and triangle paths.

### Change

In `src/components/shared/ConfettiCelebration.tsx`:

1. **Replace the three shape types** (`rect`, `circle`, `triangle`) with squiggly streamer shapes:
   - `squiggle` — a wavy S-curve drawn with `bezierCurveTo`
   - `curl` — a tight spiral/curl shape
   - `dot` — small filled circle (some dots are visible in the screenshot)

2. **Draw squiggles using canvas bezier curves** with `strokeStyle` and rounded `lineCap` instead of fills, giving the ribbon/streamer look from the screenshot.

3. **Adjust particle properties**: Make particles thinner (stroke width 2-3px), longer, and add slight wobble to rotation for the tumbling streamer effect.

4. **Keep the same color palette** (`#E9EBF6`, `#6065AE`, `#989ECB`, `#4142A3`) and animation timing.

