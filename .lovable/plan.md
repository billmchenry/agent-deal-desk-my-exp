

## Confetti Celebration When Agent Hits $16,000 Cap

### What We're Building
A confetti animation + congratulatory modal that triggers when the agent's capping reaches 100% ($16,000). The confetti uses the exact colors from the reference image: deep navy/indigo, medium blue, and light lavender/periwinkle.

### Approach

1. **Create a `ConfettiCelebration` component** (`src/components/shared/ConfettiCelebration.tsx`)
   - Pure CSS/canvas confetti animation using the exact colors from the screenshot: `#1a1a4e` (dark navy), `#3b3b9e` (indigo), `#7b7bcc` (periwinkle), `#b8b8e8` (light lavender)
   - Renders confetti pieces (triangles, circles, rectangles) falling/bursting from the top
   - Use a lightweight canvas-based approach (no new dependency needed)

2. **Create a `CappingCelebrationModal` component** (`src/components/dashboard/CappingCelebrationModal.tsx`)
   - Matching the reference image layout: confetti burst at top, checkmark icon in a circle, "Congratulations, You've Hit Your Cap!" heading, subtitle text, a CTA button, and a "Back to Home" link
   - Uses Dialog component from existing UI library
   - Stores a dismissal flag in localStorage so it only shows once per session/period

3. **Integration points**
   - Add the modal to the **Home page** (`Index.tsx`) and **Agent Dashboard** (`pages/agent/Dashboard.tsx`)
   - Trigger condition: `cappingData.current >= cappingData.target` (i.e., cap reached)
   - For demo purposes, add a `cappingMode` toggle to `DemoConfigContext` (e.g., "uncapped" vs "capped") so the demo can show both states

4. **Demo config addition**
   - Add `cappingMode: "uncapped" | "capped"` to `DemoConfigContext` and `DemoConfigSheet`
   - When set to "capped", override `cappingData.current` to equal `cappingData.target` (16000), triggering the celebration

### Technical Details

- **Confetti colors** (extracted from screenshot): `#2D2A6E`, `#4A47A3`, `#8B88C9`, `#C5C3E8` — navy-to-lavender palette
- **Canvas confetti**: ~80 particles with gravity, random rotation, and fade-out over ~3 seconds
- **localStorage key**: `cappingCelebrationDismissed_2026` to track dismissal per capping year
- **Modal**: Uses existing `Dialog` + `DialogContent` components, centered layout matching reference

